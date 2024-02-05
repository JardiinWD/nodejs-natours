// Importing the Tour model
const Tour = require('./../models/tourModel');
// Importing the catchAsync function
const catchAsync = require('./../utils/catchAsync')
// Importing and destrucuting endpoints utilities
const {
    apiVersionEndpoint,
    toursEndpoint,
    URLEnvironment,
    tourStatsRoute,
    monthlyPlanRoute,
} = require('../utils/endpoints')
// Importing Handled factory 
const Factory = require('./handlers/handlerFactory')




/** This middleware modifies the request query to retrieve the top 5 tours with specific fields and sorting.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback to proceed to the next middleware.
 */
exports.aliasTopTours = (req, res, next) => {
    // Setting limit, sort, and fields in the request query for retrieving top tours
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    // Proceeding to the next middleware
    next();
}

// Reading and parsing tour data from a JSON file
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// Handling GET requests to the '/api/v1/tours' endpoint. Retrieves all tours from the database.
exports.getAllTours = Factory.getAll(Tour)
// Controller function for retrieving a single tour with reviews.
exports.getTour = Factory.getOne(Tour, {
    path: 'reviews'
})
// Handling POST requests to the '/api/v1/tours' endpoint. Creates a new tour in the database based on the provided data.
exports.createTour = Factory.createOne(Tour)
// Handling PATCH requests to the '/api/v1/tours/:id' endpoint
exports.updateTour = Factory.updateOne(Tour)
// Handling DELETE requests to the '/api/v1/tours/:id' endpoint
exports.deleteTour = Factory.deleteOne(Tour)


/** Handling GET requests to the '/tour-stats' endpoint
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getTourStats = catchAsync(async (req, res, next) => {
    // Using MongoDB aggregation pipeline to calculate tour statistics
    const stats = await Tour.aggregate([
        {
            // Matching: Filtering tours with ratingsAverage greater than or equal to 4.5
            $match: {
                ratingsAverage: {
                    $gte: 4.5
                }
            }
        },
        {
            // Grouping: Grouping tours by difficulty, calculating various statistics for each group
            $group: {
                _id: {
                    $toUpper: '$difficulty' // Grouping by the uppercase difficulty level
                },
                numOfTours: {
                    $sum: 1 // Counting the number of tours in each difficulty group
                },
                numRatings: {
                    $sum: '$ratingsQuantity' // Summing up the ratingsQuantity for each difficulty group
                },
                averageRating: {
                    $avg: '$ratingsAverage' // Calculating the average ratingsAverage for each difficulty group
                },
                averagePrice: {
                    $avg: '$price' // Calculating the average price for each difficulty group
                },
                minPrice: {
                    $min: '$price' // Finding the minimum price for each difficulty group
                },
                maxPrice: {
                    $max: '$price' // Finding the maximum price for each difficulty group
                },
            }
        },
        {
            // Sorting: Sorting the results by averagePrice in ascending order
            $sort: {
                averagePrice: 1
            }
        }
    ]);
    // Responding with a JSON object containing the requested tour data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        url: `${URLEnvironment}/${apiVersionEndpoint}/${toursEndpoint}/${tourStatsRoute}`,
        data: {
            stats
        }
    });
})

/** Controller function to handle GET requests for fetching monthly plans.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // Extracting the year parameter from the request URL
    const year = req.params.year * 1;
    // Aggregating data to get monthly plans for the specified year
    const plan = await Tour.aggregate([
        {
            // Deconstructing the startDates array to create separate documents for each date
            $unwind: '$startDates'
        },
        {
            // Matching documents with start dates within the specified year
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            // Grouping documents by month to calculate tour starts and collect tour names
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            // Adding a new 'month' field based on the grouped month ID
            $addFields: { month: '$_id' }
        },
        {
            // Excluding the default MongoDB '_id' field from the results
            $project: { _id: 0 }
        },
        {
            // Sorting the results by the number of tour starts in descending order
            $sort: { numTourStarts: -1 }
        },
        {
            // Limiting the results to a maximum of 12 months
            $limit: 12
        }
    ]);
    // Responding with a JSON object containing the requested tour data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        url: `${URLEnvironment}/${apiVersionEndpoint}/${toursEndpoint}/${monthlyPlanRoute}/${year}`,
        data: {
            plan
        }
    });
})