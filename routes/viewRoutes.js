// Importing the Express framework
const express = require('express');
// Destructuring controller and extract all methods
const { getOverview, getTour } = require('./../controllers/viewsController')
// Creating a router instance for handling views routes 
const router = express.Router();

// Route to handle requests for the overview page
router.get('/', getOverview);
// Route to handle requests for individual tour pages
router.get('/tour/:slug', getTour);


// Export router
module.exports = router;

