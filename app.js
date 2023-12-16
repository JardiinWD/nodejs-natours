// Importing the File System module
const fs = require('fs');
// Importing the Express framework
const express = require('express');
// Initializing the Express application
const app = express();
// Creating Middleware to parse JSON in requests
app.use(express.json());

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

// Handling GET requests to the '/api/v1/tours/:id' endpoint
app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    // Responding with a 404 status code for an invalid ID
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    // Responding with a 200 status code and the requested tour data
    else {
        return res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }
});

// Handling POST requests to the '/api/v1/tours' endpoint
app.post('/api/v1/tours', (req, res) => {
    // Generating a new ID for the new tour
    const newId = tours[tours.length - 1].id + 1;
    // Creating a new tour object by merging the new ID and request body
    const newTour = Object.assign({ id: newId }, req.body);
    // Adding the new tour to the existing tours array
    tours.push(newTour);

    // Writing the updated tour data back to the JSON file
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // Responding with a 201 status code and the newly created tour data
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
});

// Specifying the port for the server to listen on
const port = 7775;

// Starting the server and logging the port it's running on
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
