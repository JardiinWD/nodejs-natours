
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
} = require('./../controllers/tourController')

// Registering the 'checkID' middleware for the 'id' parameter in route parameters.
// router.param('id', checkID);

// Handling GET and POST requests to the '/api/v1/tours' endpoint
router
    .route('/')
    .get(getAllTours)
    .post(createTour)

// Handling GET, PATCH and DELETE requests to the '/api/v1/tours/:id' endpoint
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

// Export router
module.exports = router;