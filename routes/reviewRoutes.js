// Importing the Express framework
const express = require('express');
// Destructuring controller and extract all methods
const {
    getAllReviews,
    getReview,
    createReview,
    deleteReview,
    updateReview,
    setTourUsersIds
} = require('./../controllers/reviewController')
// Destructuring authController and extract all methods
const { protect, restrictTo } = require('./../controllers/authController')

// Creating a router instance for handling routes with merged parameters from parent routers.
const router = express.Router({
    mergeParams: true // By default, each route gets its specific params
});

// ===== AUTHENTICATED ROUTES ======= //

// Protects all routes after this middleware
router.use(protect)

// Handling GET and POST requests to the '/api/v1/reviews' endpoint
router
    .route('/')
    .get(getAllReviews)
    .post(
        restrictTo('user'),
        setTourUsersIds,
        createReview
    )

// Handling DELETE, PATCH, GET requests to the '/api/v1/reviews/:id' endpoint
router
    .route('/:id')
    .delete(restrictTo('user', 'admin'), deleteReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .get(getReview)


// Export router
module.exports = router;