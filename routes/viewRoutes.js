// Importing the Express framework
const express = require('express');
// Destructuring controller and extract all methods
const { getOverview, getTour, getLoginForm, getAccount, updateUserData } = require('./../controllers/viewsController')
// Destructuring controller and extract all methods
const { protect, isLoggedIn } = require('./../controllers/authController')

// Creating a router instance for handling views routes 
const router = express.Router();

// Route to handle requests for the overview page
router.get('/', isLoggedIn, getOverview);
// Route to handle requests for individual tour pages
router.get('/tour/:slug', isLoggedIn, getTour);
// Route to handle requests for login
router.get('/login', isLoggedIn, getLoginForm)
// Routes to handle requests for user account management
router.get('/getMe', protect, getAccount)
router.post('/submit-user-data', protect, updateUserData)


// Export router
module.exports = router;

