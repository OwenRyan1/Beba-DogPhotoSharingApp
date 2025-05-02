/**]
 * @description Global error-handling middleware for the application.
 * Handles Mongoose validation errors explicitly and returns a 400 status with detailed messages.
 * Falls back to a 500 Internal Server Error for any other unhandled exceptions.
 * 
 * @param {Object} err - The error object passed from previous middleware or routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @returns {Object} 400 - If the error is a Mongoose validation error with specific messages
 * @returns {Object} 500 - For all other unexpected server errors
 */
const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    res.status(500).json({ success: false, message: "Server error" });
};

module.exports = errorHandler;
