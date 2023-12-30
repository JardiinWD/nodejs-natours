// Importing the mongoose package for connecting MongoDb
const mongoose = require('mongoose')
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Importing the Express app from app.js
const app = require('./app');

// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({
    path: './config.env'
});

// Setting the MongoDB Connection strings with .env variables
const mongoDbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_PROJECT}/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`

// METHOD 1 -> Connect to Hosted Atlas Database

mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,       // Use the new URL parser
    useCreateIndex: true,        // Ensure indexes are created when needed
    useFindAndModify: false,     // Disable 'findOneAndUpdate' and 'findOneAndDelete' to use 'updateOne' and 'deleteOne'
    useUnifiedTopology: true     // Use the new Server Discovery and Monitoring engine
}).then(() => {
    console.log("DB Connection successful");
})

// METHOD 2 -> Connect to Local Database

/* mongoose.connect(process.env.MONGO_DB_LOCAL , {
    useNewUrlParser: true,       // Use the new URL parser
    useCreateIndex: true,        // Ensure indexes are created when needed
    useFindAndModify: false,     // Disable 'findOneAndUpdate' and 'findOneAndDelete' to use 'updateOne' and 'deleteOne'
    useUnifiedTopology: true     // Use the new Server Discovery and Monitoring engine
}).then(() => {
    console.log("DB Connection successful");
}) */

// Specifying the port for the server to listen on
const port = process.env.PORT || 3375;

// Starting the server and logging the port it's running on
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});