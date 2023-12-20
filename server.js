// Importing the Express app from app.js
const app = require('./app');
// Specifying the port for the server to listen on
const port = 7775;
// Starting the server and logging the port it's running on
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});