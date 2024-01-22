
// Importing the Express framework
const express = require('express');
// Define router 
const router = express.Router();
// Destructuring controller and extract all methods
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
} = require('./../controllers/tourController')
// Destructuring authentication controller and extract protect method
const { protect } = require('./../controllers/authController')

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
    .get(getMonthlyPlan)

// Handling GET and POST requests to the '/tours' endpoint
router
    .route('/')
    .get(protect, getAllTours)
    .post(createTour)

// Handling GET, PATCH and DELETE requests to the '/tours/:id' endpoint
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

// Export router
module.exports = router;