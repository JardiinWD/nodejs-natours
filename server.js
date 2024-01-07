// Importing the mongoose package for connecting MongoDb
const mongoose = require('mongoose')
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Handling uncaught exceptions to prevent abrupt termination of the application
process.on('uncaughtException', err => {
    // Logging the error name and message
    console.log(`${err.name}: ${err.message}`);
    // Exiting the process with a failure code
    process.exit(1);
})

// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' });
// Importing the Express app from app.js
const app = require('./app');

// Setting the MongoDB Connection strings with .env variables
const mongoDbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_PROJECT}/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`

// Connect to Hosted Atlas Database (To Connect to Local Database use process.env.MONGO_DB_LOCAL instead of mongoDbUri)
mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,       // Use the new URL parser
    useCreateIndex: true,        // Ensure indexes are created when needed
    useFindAndModify: false,     // Disable 'findOneAndUpdate' and 'findOneAndDelete' to use 'updateOne' and 'deleteOne'
    useUnifiedTopology: true     // Use the new Server Discovery and Monitoring engine
}).then(() => {
    console.log(`MongoDB database's (${process.env.MONGO_DB_DATABASE}) is successfully connected`);
})

// Specifying the port for the server to listen on
const port = process.env.PORT || 3375;

// Starting the server and logging the port it's running on
const server = app.listen(port, () => {
    console.log(`App is currently running on port: ${port}`);
});

// Handling uncaught exceptions to prevent abrupt termination of the application
process.on('uncaughtException', err => {
    // Logging the error name and message
    console.log(`${err.name}: ${err.message}`);
    // Closing the server gracefully before exiting the process
    server.close(() => {
        // Exiting the process with a failure code
        process.exit(1);
    });
});
