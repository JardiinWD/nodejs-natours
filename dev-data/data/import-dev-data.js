// Importing the fs package for file system operations
const fs = require('fs');
// Importing the mongoose package for MongoDB connectivity
const mongoose = require('mongoose');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Importing the Tour model for database operations
const Tour = require('./../../models/tourModel');
// Importing the Review model for database operations
const Review = require('./../../models/reviewModel');
// Importing the User model for database operations
const User = require('./../../models/userModel');

// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({
    path: './config.env'
});

// Setting the MongoDB Connection strings with .env variables
const mongoDbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_PROJECT}/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`

// Connect to Hosted Atlas Database
mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,       // Use the new URL parser
    useCreateIndex: true,        // Ensure indexes are created when needed
    useFindAndModify: false,     // Disable 'findOneAndUpdate' and 'findOneAndDelete' to use 'updateOne' and 'deleteOne'
    useUnifiedTopology: true     // Use the new Server Discovery and Monitoring engine
}).then(() => {
    console.log(`MongoDB database's (${process.env.MONGO_DB_DATABASE}) is successfully connected`);
});

// READ JSON FILE
// Reading and parsing the tour data from a JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// Reading and parsing the tour data from a JSON file
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// Reading and parsing the tour data from a JSON file
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// Asynchronous function to import data into the MongoDB database
const importData = async () => {
    try {
        // Creating tours in the database using the Tour model
        // await Tour.create(tours);
        // Creating users in the database using the User model
        /* await User.create(users, {
            validateBeforeSave: false // Only for avoid "passwordConfirm: Please confirm your password"
        }); */
        // Creating reviews in the database using the Review model
        await Review.create(reviews);

        console.log(`Data successfully loaded on ${process.env.MONGO_DB_DATABASE} Database!`);
    } catch (error) {
        console.log(`Cannot load data on ${process.env.MONGO_DB_DATABASE} Database!`, error.message);
    }
    process.exit(); // Exiting the process after data import
};

// Asynchronous function to delete all data from the MongoDB collection
const deleteData = async () => {
    try {
        // Deleting all tours from the database using the Tour model
        await Tour.deleteMany();
        // Deleting all reviews from the database using the Tour model
        await User.deleteMany();
        // Deleting all users from the database using the Tour model
        await Review.deleteMany();

        console.log(`Data successfully deleted on ${process.env.MONGO_DB_DATABASE} Database!`);
    } catch (error) {
        console.log(`Cannot delete data on ${process.env.MONGO_DB_DATABASE} Database!`, error.message);
    }
    process.exit(); // Exiting the process after data deletion
};

// Conditional logic based on command line arguments
if (process.argv[2] === '--import') {
    importData(); // Invoking data import function
} else if (process.argv[2] === '--delete') {
    deleteData(); // Invoking data deletion function
}