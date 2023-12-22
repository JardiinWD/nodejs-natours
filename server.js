// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({
    path: './config.env'
});

// Importing the Express app from app.js
const app = require('./app');

// Specifying the port for the server to listen on
const port = process.env.PORT || 3375;

// Starting the server and logging the port it's running on
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});