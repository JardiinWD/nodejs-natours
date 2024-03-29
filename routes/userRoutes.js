// Importing the Express framework
const express = require('express');
// Define router 
const router = express.Router();
// Destructuring controller and extract all methods
const {
    getAllUsers, createUser, getUser,
    updateUser, deleteUser, updateMe, deleteMe, getMe
} = require('./../controllers/userController')
// Destructuring authController and extract all methods
const {
    signup, login, logout,
    forgotPassword, resetPassword, updatePassword,
    protect, restrictTo
} = require('./../controllers/authController')


// Handling POST requests to the '/api/v1/signup' endpoint
router.post('/signup', signup)
// Handling POST requests to the '/api/v1/login' endpoint
router.post('/login', login)
// Handling POST requests to the '/api/v1/logout' endpoint
router.get('/logout', logout)
// Handling POST requests to the '/api/v1/forgotPassword' endpoint
router.post('/forgotPassword', forgotPassword)
// Handling PATCH requests to the '/api/v1/resetPassword' endpoint
router.patch('/resetPassword/:token', resetPassword)

// ===== AUTHENTICATED ROUTES ======= //

// Protects all routes after this middleware
router.use(protect)

// Handling GET requests to the '/api/v1/getMe' endpoint
router.get('/getMe', getMe, getUser)
// Handling PATCH requests to the '/api/v1/updateMyPassword' endpoint
router.patch('/updateMyPassword', updatePassword)
// Handling PATCH requests to the '/api/v1/updateMe' endpoint
router.patch('/updateMe', updateMe)
// Handling DELETE requests to the '/api/v1/deleteMe' endpoint
router.delete('/deleteMe', deleteMe)

// ===== RESTRICTED ROUTES ======= //

// Restrict access to all routes after this middleware
router.use(restrictTo('admin'))

// Handling GET and POST requests to the '/api/v1/users' endpoint
router.route('/').get(getAllUsers).post(createUser)
// Handling GET, PATCH and DELETE requests to the '/api/v1/users/:id' endpoint
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

// Export router
module.exports = router;