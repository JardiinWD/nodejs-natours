// Custom error class for the application
class AppErrors extends Error {
    /** Constructor for AppErrors class.
     * @param {string} message - Error message.
     * @param {number} statusCode - HTTP status code.
     */
    constructor(message, statusCode) {
        // Calling the Error constructor with the provided message
        super(message);
        // Assigning the statusCode property with the provided HTTP status code
        this.statusCode = statusCode;
        // Assigning the status property based on the statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // Setting the isOperational property to true, indicating operational errors
        this.isOperational = true;
        // Capturing the stack trace for debugging purposes
        Error.captureStackTrace(this, this.constructor);
    }
}

// Exporting the AppErrors class for use in other modules
module.exports = AppErrors;
