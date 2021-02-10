const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')
const matchRouter = require('./routes/matchRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// serving static files
app.use(express.json());    //potrzebne (konieczne) do app.post 
app.use(cookieParser());
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
    //console.log('Hello from the middleware!');
    next();
});



app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
});

// 3) ROUTES 
app.use('/api/v1/matches', matchRouter);
app.use('/api/v1/users', userRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
