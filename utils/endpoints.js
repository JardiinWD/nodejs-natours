// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' });

// ====== URL ========= //
exports.URLEnvironment = process.env.NODE_ENV === 'development' ? `localhost:${process.env.PORT}` : ''

// ====== ENDPOINTS ========= //
exports.apiVersionEndpoint = 'api/v1'
exports.toursEndpoint = 'tours'
exports.usersEndpoint = 'users'
exports.reviewsEndpoint = 'reviews'


// ====== ROUTES ========= //

// Common Routes
exports.basicRoute = '/'
exports.idRoute = ':id'

// Tour Routes
exports.top5CheapRoute = 'top-5-cheap'
exports.tourStatsRoute = 'tour-stats'
exports.monthlyPlanRoute = 'monthly-plan'

// Auth Routes
exports.signupRoute = 'signup'
exports.loginRoute = 'login'

