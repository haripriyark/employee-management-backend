const { AppError } = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
    console.error(err.name,"::::", err.message);
    if (err instanceof AppError) {
        console.log("error code :::", err.statusCode);
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        })
    } else if (err?.name === "ValidationError") {
        return res.status(400).json({
            message: err.message,
            success: false
        })
    } else if (err?.name === "MongoServerError" && err?.code === 11000) {
        return res.status(409).json({
            message: `Employee with email ${err.keyValue.email} already exists`,
            success: false
        })
    } else {
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }

}

module.exports = errorHandler;