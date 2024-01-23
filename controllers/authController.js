// Importing promisify from util
const { promisify } = require('util')
// Importing User Model
const User = require('./../models/userModel')
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('./../utils/appErrors')
// Importing sendEmail handler
const sendEmail = require('./../utils/email')
// Importing JWT Package
const jwt = require('jsonwebtoken')
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' });
// Importing and destructuring endpoints utilities
const { apiVersionEndpoint, usersEndpoint, URLEnvironment, loginRoute, signupRoute } = require('../utils/endpoints')


// Generating a JSON Web Token (JWT)
const signToken = id => {
    return jwt.sign(
        // User's ID as the payload of the JWT
        { id },
        // JWT secret for encoding the token
        process.env.JWT_SECRET,
        // Token expiration time from the environment variables
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}


/** Middleware for handling user signup.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.signup = catchAsync(async (req, res, next) => {
    // Creating a new user with the provided user information from the request body
    const newUser = await User.create({
        name: req.body.name, // User's name from the request
        email: req.body.email, // User's email from the request
        password: req.body.password, // User's password from the request
        passwordConfirm: req.body.passwordConfirm, // User's password confirmation from the request
        passwordChangedAt: req.body.passwordChangedAt, // User's password changed at confirmation from the request
    });

    // Generating a JSON Web Token (JWT) for the newly created user
    const token = signToken(newUser._id)
    console.log("This is the token: ", token);

    // Responding with a JSON object containing the success status, token, and user data
    res.status(201).json({
        status: 'success',
        createdAt: req.requestTime,
        token,
        url: `${URLEnvironment}/${apiVersionEndpoint}/${usersEndpoint}/${signupRoute}`,
        data: {
            user: newUser
        }
    });
});

/** Middleware for handling user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.login = catchAsync(async (req, res, next) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        // If email or password doesn't exist, return an error to the client
        return next(new AppErrors('Please provide email and password!', 400));
    }
    // Search for the user in the database using the provided email
    const user = await User.findOne({
        email
    }).select('+password');

    // Check if the user exists and the provided password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
        console.log("Something went wrong with correctPassword");
        // If the user doesn't exist or the password isn't correct, return an error to the client
        return next(new AppErrors('Incorrect email or password', 401));
    } else {
        // If everything is okay, generate a JWT token for the authenticated user
        const token = signToken(user._id);
        // Send the token to the client
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            url: `${URLEnvironment}/${apiVersionEndpoint}/${usersEndpoint}/${loginRoute}`,
            token,
        });
    }
})

/** Middleware for protecting other routes.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.protect = catchAsync(async (req, res, next) => {
    // Declare the token variable
    let token;

    // 1) Get token and check if it's there.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Extract the token from the authorization header.
        token = req.headers.authorization.split(' ')[1]
    }

    // Check if the token is present.
    if (!token) {
        return next(new AppErrors('You are not logged in! Please log in to get access.', 401))
    }

    // 2) Verification token.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exists.
    const currentUser = await User.findById(decoded.id)
    // Check the condition where the User changed so, at least, his Token expires
    if (!currentUser) {
        // Then call the next middleware
        return next(new AppErrors('The user belonging to this user does no longer exist.', 401))
    }

    // 4) Check if user changed password after the JTW was issued.
    if (currentUser.changePasswordAfter(decoded.iat)) {
        // Then call the next middleware
        return next(new AppErrors('User recently changed password! Please login again.', 401))
    }

    // Set the user object on the request for further middleware to use.
    req.user = currentUser
    // Grant access to protected Route
    next();
})

/** Middleware for restricting actions to users with specific roles.
 * @param {...string} roles - Possible roles that can perform the action.
 */
exports.restrictTo = (...roles) => {
    /**
     * Middleware function to check if the user has the required role.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Callback to proceed to the next middleware.
     */
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles.
        if (!roles.includes(req.user.role)) {
            // If not, return an error response.
            return next(new AppErrors('You do not have permission to perform this action', 403));
        }
        // Grant access to the protected route.
        next();
    };
};

/** Middleware for handling forgot password actions.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. Get user based on the posted email.

    // Email address from the request body.
    const user = await User.findOne({
        email: req.body.email,
    });
    // Check if the user exists.
    if (!user) {
        return next(new AppErrors('There is no user with the provided email address.', 404));
    }
    // 2. Generate the random reset token.

    const resetToken = user.createPasswordResetToken();
    // Save the user with the updated password reset token and expiration time.
    await user.save({ validateBeforeSave: false });

    // 3. Send the reset token to the user's email.
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    // Create the message for the forgot password middleware
    const message = `
        Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n
        If you didn't forget your password, please ignore this email!
    `

    // Try sending the password reset email.
    try {
        // Send the email with the password reset token.
        await sendEmail({
            // Specify the user's email address.
            email: user.email,
            // Define the subject of the email.
            subject: 'Your Password Reset Token (Valid for 10 Minutes)',
            // Provide the email message content.
            message
        });

        // Respond with a success status and message.
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (error) {
        // Clear the password reset token and expiration fields.
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // Save the user with the updated password reset token and expiration time.
        await user.save({ validateBeforeSave: false });
        // If there was an error sending the email, respond with an error status and message.
        return next(new AppErrors('There was an error sending the email. Try again later!', 500));
    }
});

/**
 * Middleware for resetting the user's password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.resetPassword = (req, res, next) => {
    // Implementation for resetting the user's password will be added here.
    // (This function is currently empty and will be completed based on your requirements.)
};
