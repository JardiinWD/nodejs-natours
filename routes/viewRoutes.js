// Importing the Express framework
const express = require('express');
// Destructuring controller and extract all methods
const { getOverview, getTour } = require('./../controllers/viewsController')
// Creating a router instance for handling views routes 
const router = express.Router();


// INSERT COMMENT HERE
router.get('/', getOverview)
// INSERT COMMENT HERE
router.get('/tour', getTour)

// Export router
module.exports = router;

