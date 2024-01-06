/** Wraps an asynchronous function to catch any errors and pass them to the next middleware.
 * @param {Function} func - Asynchronous function to be wrapped.
 */
module.exports = (func) => {
    /** Express middleware function that calls the provided asynchronous function and catches any errors.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Callback to proceed to the next middleware.
     */
    return (req, res, next) => {
        // Calling the provided asynchronous function and handling any errors
        func(req, res, next).catch(next);
    };
};