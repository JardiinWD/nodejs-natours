
// Importing the Express framework
const express = require('express');
// Define router 
const router = express.Router();
// Destructuring controller and extract all methods
const {
    getAllTours, createTour, getTour,
    updateTour, deleteTour, aliasTopTours,
    getTourStats, getMonthlyPlan
} = require('./../controllers/tourController')
// Destructuring authentication controller and extract protect method
const { protect, restrictTo } = require('./../controllers/authController')
// Importing the Review Router
const reviewRouter = require('./reviewRoutes')

// ===== NESTED ROUTES ======= //

// Mounting the review router as a middleware for the current router.
router.use('/:tourId/reviews', reviewRouter);


// Route for getting the top 5 cheapest tours with alias to the '/top-5-cheap' endpoint
router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

// Route for getting tour statistics to the '/tour-stats' endpoint 
router
    .route('/tour-stats')
    .get(getTourStats)

// Route for getting tour statistics to the '/tour-stats' endpoint 
router
    .route('/monthly-plan/:year')
    .get(
        protect,
        restrictTo('admin', 'lead-guide', 'guide'),
        getMonthlyPlan
    )

// Handling GET and POST requests to the '/tours' endpoint
router
    .route('/')
    .get(getAllTours)
    .post(
        protect,
        restrictTo('admin', 'lead-guide'),
        createTour
    )

// Handling GET, PATCH and DELETE requests to the '/tours/:id' endpoint
router
    .route('/:id')
    .get(getTour)
    .patch(
        protect,
        restrictTo('admin', 'lead-guide'),
        updateTour
    )
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteTour
    )

// Export router
module.exports = router;