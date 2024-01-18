// Importing the Express framework
const express = require('express');
// Define router 
const router = express.Router();
// Destructuring controller and extract all methods
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('./../controllers/userController')
// Destructuring authController and extract all methods
const { signup, login } = require('./../controllers/authController')

// Handling POST requests to the '/api/v1/signup' endpoint
router.post('/signup', signup)
// Handling POST requests to the '/api/v1/login' endpoint
router.post('/login', login)
// Handling GET and POST requests to the '/api/v1/users' endpoint
router.route('/').get(getAllUsers).post(createUser)
// Handling GET, PATCH and DELETE requests to the '/api/v1/users/:id' endpoint
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)


// Export router
module.exports = router;