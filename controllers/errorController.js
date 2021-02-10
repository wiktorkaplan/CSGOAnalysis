///Obsluga bledow z podzialem na dev/prod
const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleJWTError = () => {
    new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
    new AppError('Your token has expired. Please log in again.', 401);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error('!!!!!! ERROR !!!!!! - ', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

module.exports = (err, req, res, next) => {
    //console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};

