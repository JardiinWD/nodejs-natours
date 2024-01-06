// Importing the Express framework
const express = require('express');
// Importing the Morgan library for logging
const morgan = require('morgan');
// Initializing the Express application
const app = express();
// Importing Tours Router
const tourRouter = require('./routes/tourRoutes');
// Importing Users Router
const userRouter = require('./routes/userRoutes');
// Importing AppErrors handler
const AppErrors = require('./utils/appErrors')
// Importing Global Error from Controllers
const globalErrorHandler = require('./controllers/errorController')


// Check if the application is running in development environment
if (process.env.NODE_ENV === 'development') {
    // Apply logging middleware using Morgan in 'dev' mode
    app.use(morgan('dev'));
}

// Middleware to parse JSON in requests using Express
app.use(express.json());
// Middleware for Static files
app.use(express.static(`${__dirname}/public`));

/** Middleware to add a request timestamp.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routing middleware for Tours and Users
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/** Middleware for handling unmatched routes.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
app.all('*', (req, res, next) => {
    // Creating and passing an error to the next middleware
    next(new AppErrors(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware.
app.use(globalErrorHandler);

module.exports = app;
