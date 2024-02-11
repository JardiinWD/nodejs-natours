// Importing the Express framework
const express = require('express');
// Destructuring controller and extract all methods
const { getOverview, getTour, getLoginForm } = require('./../controllers/viewsController')
// Destructuring controller and extract all methods
const { protect } = require('./../controllers/authController')


// Creating a router instance for handling views routes 
const router = express.Router();

// Route to handle requests for the overview page
router.get('/', getOverview);
// Route to handle requests for individual tour pages
router.get('/tour/:slug', protect, getTour);
// Route to handle requests for login
router.get('/login', getLoginForm)



// Export router
module.exports = router;

