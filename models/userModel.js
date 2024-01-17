// Importing the mongoose package for MongoDB schema and model handling
const mongoose = require('mongoose');
// Importing the validator package for MongoDB schema
const validator = require('validator');
// Importing the bcryptjs package for MongoDB password hashing
const bcrypt = require('bcryptjs')


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
    // Field for the password of the user
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'An user password must have more or equal then 8 characters'],
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
    }
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



// Creating a model named 'User' based on the defined schema
const User = mongoose.model('User', userSchema);

// Exporting the 'User' model for use in other parts of the application
module.exports = User;