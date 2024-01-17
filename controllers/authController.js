// Importing User Model
const User = require('./../models/userModel')
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing AppErrors handler
const AppErrors = require('./../utils/appErrors')
// Importing JWT Package
const jwt = require('jsonwebtoken')
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' });

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
    });

    // Generating a JSON Web Token (JWT) for the newly created user
    const token = jwt.sign({
        id: newUser._id // User's ID as the payload of the JWT
    },
        process.env.JWT_SECRET, // JWT secret for encoding the token
        {
            expiresIn: process.env.JWT_EXPIRES_IN // Token expiration time from the environment variables
        }
    );

    // Responding with a JSON object containing the success status, token, and user data
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });

});
