/** APIFeatures Class
 * 
 * A utility class for handling query features such as filtering, sorting, field limiting, and pagination.
 */
class APIFeatures {
    /** Constructor method for APIFeatures class.
     * 
     * @param {*} query - The MongoDB query object.
     * @param {*} queryString - The request query string.
     */
    constructor(query, queryString) {
        this.query = query; // The MongoDB query object
        this.queryString = queryString; // The request query string
    }

    /** Constructs the MongoDB query for filtering based on the request parameters.
     * @returns {APIFeatures} - The current instance of the APIFeatures class.
     */
    filter() {
        // Creating a copy of the request query object and excluding certain fields
        const queryObject = { ...this.queryString };
        // Creating an array with specific fields that we don't want to filter
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // Looping through excludedFields and removing each one from queryObject
        excludedFields.forEach(el => delete queryObject[el]);

        // Converting the queryObject to a string and replacing specific keywords for MongoDB operators
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // Constructing the MongoDB query based on the request parameters
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    /** Applies sorting to the MongoDB query based on the request parameters.
     * @returns {APIFeatures} - The current instance of the APIFeatures class.
     */
    sort() {
        if (this.queryString.sort) {
            // Splitting and joining the sort parameter for multiple fields and directions
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Default sorting by createdAt in descending order
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    /** Applies field limiting to the MongoDB query based on the request parameters.
     * @returns {APIFeatures} - The current instance of the APIFeatures class.
     */
    limitFields() {
        if (this.queryString.fields) {
            // Splitting and joining the fields parameter for selecting specific fields
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            // Excluding the '__v' field by default
            this.query = this.query.select('-__v');
        }
        return this;
    }

    /** Applies pagination to the MongoDB query based on the request parameters.
     * @returns {APIFeatures} - The current instance of the APIFeatures class.
     */
    paginate() {
        // Extracting page and limit values from the request query, with default values if not provided
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        // Calculating the number of documents to skip based on page and limit
        const skip = (page - 1) * limit;

        // Applying pagination to the MongoDB query
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;