// Importing the File System module
const fs = require('fs');
// Reading and parsing tour data from a JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/** Handling GET requests to the '/api/v1/tours' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllTours = (req, res) => {
    // Responding with a JSON object containing a list of tours
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

/** Handling GET requests to the '/api/v1/tours/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getTour = (req, res) => {
    // Extracting the ID parameter from the request
    const id = req.params.id * 1;
    // Finding the tour with the specified ID
    const tour = tours.find(el => el.id === id)

    // Responding with a 404 status code for an invalid ID
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
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
}

/** Handling POST requests to the '/api/v1/tours' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.createTour = (req, res) => {
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
}

/** Handling PATCH requests to the '/api/v1/tours/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.updateTour = (req, res) => {
    // Responding with a 404 status code for an invalid ID
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    } else {
        // Responding with a 200 status code and a placeholder for the updated tour
        res.status(200).json({
            status: 'success',
            data: {
                tour: '<Updated tour here...>'
            }
        })
    }
}

/** Handling DELETE requests to the '/api/v1/tours/:id' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteTour = (req, res) => {
    // Responding with a 404 status code for an invalid ID
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    } else {
        // Responding with a 204 status code as the tour is deleted
        return res.status(204).json({
            status: 'success',
            data: null
        })
    }
}