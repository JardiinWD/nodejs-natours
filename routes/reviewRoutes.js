// Importing the Express framework
const express = require('express');
// Define router 
const router = express.Router();
// Destructuring controller and extract all methods
const {
    getAllReviews,
    createReview
} = require('./../controllers/reviewController')
// Destructuring authController and extract all methods
const { protect, restrictTo } = require('./../controllers/authController')


// Handling GET and POST requests to the '/api/v1/reviews' endpoint
router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview)

// Export router
module.exports = router;