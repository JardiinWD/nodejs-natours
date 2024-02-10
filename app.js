// Importing Path module
const path = require('path')
// Importing the Express framework
const express = require('express');
// Importing the Morgan library for logging
const morgan = require('morgan');
// Importing the express-rate-limit package for limit the HTTP request from an IP (preventing DDos attack)
const rateLimit = require('express-rate-limit')
// Importing the express-mongo-sanitize package for avoiding NoSQL query injection
const mongoSanitize = require('express-mongo-sanitize')
// Importing the xss-clean package for Data sanitization against XSS Attack
const xss = require('xss-clean')
// Importing the xss-clean package for Preventing Parameter Pollution
const hpp = require('hpp')
// Initializing the helmet Package
const helmet = require('helmet')
// Initializing the Express application
const app = express();
// Importing Tours Router
const tourRouter = require('./routes/tourRoutes');
// Importing Users Router
const userRouter = require('./routes/userRoutes');
// Importing Reviews Router
const reviewRouter = require('./routes/reviewRoutes');
// Importing Views Router
const viewRouter = require('./routes/viewRoutes');

// Importing AppErrors handler
const AppErrors = require('./utils/appErrors')
// Importing Global Error from Controllers
const globalErrorHandler = require('./controllers/errorController');


// ==== PUG ENGINES ===== //

// INSERT COMMENT HERE
app.set('view engine', 'pug')
// INSERT COMMENT HERE
app.set('views', path.join(__dirname, 'views'))
// Middleware for Static files
app.use(express.static(path.join(__dirname, 'public')));


// ==== SECURITY AND DATA SANITIZATION ===== //

// Middleware for Set Security HTTP Headers
app.use(helmet())

// Rate limiter middleware to limit requests from the same IP
const limiter = rateLimit({
    max: 100, // Maximum number of requests allowed per windowMs
    windowMs: 60 * 60 * 1000, // Window in milliseconds for rate limiting (1 hour)
    message: 'Too many requests from this IP, please try again in an hour!' // Error message for exceeding the rate limit
});
// Middleware to Limit access to resources after 100 requests (Preventing DDos attack)
app.use('/api', limiter)
// Middleware for Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Middleware for Data sanitization against XSS Attack
app.use(xss())
// Middleware for Preventing Parameter Pollution
app.use(hpp({
    // Allow Duplicate Query Params for the Whitelist values
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}))

// Check if the application is running in development environment
if (process.env.NODE_ENV === 'development') {
    // Apply logging middleware using Morgan in 'dev' mode
    app.use(morgan('dev'));
}

// Middleware to parse JSON in requests using Express
app.use(express.json({
    limit: '10kb' // For body larger than 10kb
}));


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

// Routing middleware for Tours, Users, Reviews and Views
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


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
