// Importing AppErrors handler
const AppErrors = require("../utils/appErrors");

/** Handles cast errors in the database.
 * @param {Object} err - Error object.
 */
const handleCastErrorDB = (err) => {
    // Generating a user-friendly error message for invalid cast errors
    const message = `Invalid ${err.path}: ${err.value}.`;
    // Creating a new AppErrors instance with a 400 status code
    return new AppErrors(message, 400);
}

/** Handles duplicate field errors in the database.
 * @param {Object} err - Error object.
 */
const handleDuplicateFieldDB = (err) => {
    // Extracting the duplicate field value from the error message
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // Generating a user-friendly error message for duplicate field errors
    const message = `Duplicate field value: ${value}. Please use another value!`;
    // Creating a new AppErrors instance with a 400 status code
    return new AppErrors(message, 400);
}

/** Handles validation field errors in the Schema.
 * @param {Object} err - Error object.
 */
const handleValidationErrorDB = (err) => {
    // Loop inside all validation errors objects
    const errors = Object.values(err.errors).map(el => el.message)
    // Generating a user-friendly error message for duplicate field errors
    const message = `Invalid input data. ${errors.join('. ')}`
    // Creating a new AppErrors instance with a 400 status code
    return new AppErrors(message, 400);
}

// Handles JWT validation error
const handleJWTError = () => {
    new AppErrors('Invalid token. Please login again!', 401)
}

//  Handles JWT Expiration validation error
const handleJWTExpiredError = () => {
    new AppErrors('Your token has expired! Please log in again.', 401)
}

/** Sends detailed error information in the development environment.
 * @param {Object} err - Error object.
 * @param {Object} res - Express response object.
 */
const sendErrorDev = (err, res) => {
    console.log(err);

    // Check if is an operational error
    if (err.isOperational) {
        // Sending a JSON response with the error status, message and environment
        res.status(err.statusCode).json({
            status: err.status,
            statusCode: err.statusCode,
            isOperational: err.isOperational,
            message: err.message ?? 'Something went wrong!',
            environment: process.env.NODE_ENV
        });
    }
    // Programming or other unknow error
    else {
        // Check in console unexpected error
        console.error('ERROR', err.message)
        // Send the message
        res.status(500).json({
            status: err.status,
            stack: err.stack,
            message: err.message ?? 'Something went wrong!',
            error: err,
        })
    }
}

/** Sends minimal error information in the production environment.
 * @param {Object} err - Error object.
 * @param {Object} res - Express response object.
 */
const sendErrorProd = (err, res) => {
    // Check if is an operational error
    if (err.isOperational) {
        // Sending a JSON response with the error status, message and environment
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message ?? 'Something went wrong!',
            stack: err.stack,
            environment: process.env.NODE_ENV
        });
    }
    // Programming or other unknow error
    else {
        // Check in console unexpected error
        console.error('ERROR', err.message)
        // Send the message
        res.status(500).json({
            status: err.status,
            message: err.message,
        })
    }
}


/** Middleware for handling errors.
 *
 * @param {Object} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
module.exports = (err, req, res, next) => {
    // Setting default values for status and statusCode if not provided in the error object
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Handling errors differently based on the environment
    if (process.env.NODE_ENV === 'development') {
        // Creating a hard copy of the error object
        let errorObj = { ...err };

        // Handling specific errors for a more user-friendly response
        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError()
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError()


        // Sending detailed error information in the development environment
        sendErrorDev(err, res);
        // Calling the next middleware
        next();
    } else if (process.env.NODE_ENV === 'production') {
        // Creating a hard copy of the error object
        let errorObj = { ...err };

        // Handling specific errors for a more user-friendly response
        if (errorObj.name === 'CastError') errorObj = handleCastErrorDB(errorObj);
        if (errorObj.code === 11000) errorObj = handleDuplicateFieldDB(errorObj);
        if (errorObj.name === 'ValidationError') errorObj = handleValidationErrorDB(errorObj);
        if (errorObj.name === 'JsonWebTokenError') errorObj = handleJWTError()
        if (errorObj.name === 'TokenExpiredError') errorObj = handleJWTExpiredError()

        // Sending minimal error information in the production environment
        sendErrorProd(errorObj, res);
        // Calling the next middleware
        next();
    }
}
