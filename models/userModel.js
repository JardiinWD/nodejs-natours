// Importing the mongoose package for MongoDB schema and model handling
const mongoose = require('mongoose');
// Importing the validator package for MongoDB schema
const validator = require('validator');
// Importing the bcryptjs package for MongoDB password hashing
const bcrypt = require('bcryptjs')
// Importing the crypto package
const crypto = require('crypto')



// Defining a schema for the 'User' collection in MongoDB
const userSchema = new mongoose.Schema({
    // Field for the name of the user
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
    },
    // Field for the email of the user
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    // Field for the photo of the user
    photo: String,
    // Field for the role of the user
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'], // The possible roles
        default: 'user'
    },
    // Field for the password of the user
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'An user password must have more or equal then 8 characters'],
        select: false
    },
    // Field for the property of password Confirm
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (element) {
                return element === this.password
            },
            message: 'Passwords are not the same'
        }
    },
    // Field for the property of password Confirm
    passwordChangedAt: {
        type: Date
    },
    // Field for the property of password reset Token
    passwordResetToken: {
        type: String
    },
    // Field for the property of password reset expirated token
    passwordResetExpires: {
        type: Date
    },
    // Field for the property of active status for currentUser
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

// Middleware to exclude inactive users from queries (those with 'active' set to false)
userSchema.pre(/^find/, function (next) {
    // Exclude users with 'active' set to false
    this.find({
        active: {
            $ne: false
        }
    });
    // Calling the next middleware in the stack
    next();
})


// Middleware function executed before saving a new user document to the 'User' collection.
userSchema.pre('save', async function (next) {
    // Checking if the password field is modified before proceeding
    if (!this.isModified('password')) return next();
    // Hashing the password with a cost factor of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Clearing the passwordConfirm field as it is not needed after validation
    this.passwordConfirm = undefined;
    // Calling the next middleware in the stack
    next();
});


// Middleware function executed for update changedAt properties after the Reset Password
userSchema.pre('save', function (next) {
    // If we didn't manipulated the changedAt then return the next() middleware
    if (!this.isModified('password') || this.isNew) return next();
    // Update the passwordChangedAt property
    // We decrease the date.now() functionality because the JWT is a bit faster than the timestamp update
    // So in order for the user to be logged in after the reset password I find this small hack
    this.passwordChangedAt = Date.now() - 1000
    // Calling the next middleware in the stack
    next();

})

/** Method to check if the provided password matches the user's stored password. 
 * @param {string} candidatePassword - The password provided by the user for verification.
 * @param {string} userPassword - The hashed password stored for the user.
 * @returns {boolean} - Returns true if the passwords match, false otherwise.
 */
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    // Using bcrypt to compare the candidate password with the stored hashed password
    return await bcrypt.compare(candidatePassword, userPassword);
}


/** Method to check if the user changed the password after the provided JWT timestamp.
 * @param {number} JWTTimestamp - The timestamp from the JWT token.
 * @returns {boolean} - Returns true if the user changed the password after the provided timestamp; otherwise, returns false.
 */
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    // Check if the user has a password change timestamp.
    if (this.passwordChangedAt) {
        // Convert the password change timestamp to seconds.
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // Return true if the user changed the password after the provided JWT timestamp.
        return JWTTimestamp < changedTimestamp;
    }

    // Return false if the user didn't change the password.
    return false;
};

/** Method to generate a password reset token and set the corresponding expiration time.
 * @returns {string} - Returns the generated reset token.
 */
userSchema.methods.createPasswordResetToken = function () {
    // Generate a random reset token using crypto.
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the reset token and set it in the user document.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set the expiration time for the reset token to 10 minutes from the current time.
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    // Return the generated reset token.
    return resetToken;
};

// Creating a model named 'User' based on the defined schema
const User = mongoose.model('User', userSchema);
// Exporting the 'User' model for use in other parts of the application
module.exports = User;