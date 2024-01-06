/** Middleware for handling errors
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
    // Sending a JSON response with the error status and message
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
    // Calling the next middleware
    next();
}