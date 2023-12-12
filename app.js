// Importing the File System module
const fs = require('fs');
// Importing the Express framework
const express = require('express');
// Initializing the Express application
const app = express();

//#region Trash

// Commented-out code for handling root URL requests
/* app.get('/', (req, res) => {
    // Sending a JSON response with a 200 status code
    res.status(200).json({
        message: 'Hello from the server side!',
        app: 'NodeJS-Natours'
    });
});

// Commented-out code for handling POST requests to the root URL
app.post('/', (req, res) => {
    res.send('You can post to this endpoint');
}) */

//#endregion 

// Reading and parsing tour data from a JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Handling GET requests to the '/api/v1/tours' endpoint
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
});

// Specifying the port for the server to listen on
const port = 7775;

// Starting the server and logging the port it's running on
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
