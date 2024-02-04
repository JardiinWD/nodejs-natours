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

// Handling GET and POST requests to the '/api/v1/reviews' endpoint
router
    .route('/')
    .get(getAllReviews)
    .post(
        protect,
        restrictTo('user'),
        setTourUsersIds,
        createReview
    )

// Handling DELETE, PATCH, GET requests to the '/api/v1/reviews/:id' endpoint
router.route('/:id')
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteReview
    )
    .patch(
        protect,
        restrictTo('user'),
        updateReview
    ).get(
        protect,
        getReview
    )


// Export router
module.exports = router;