const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    //remove tpassword from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    //1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    //2) check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    //3) if everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    //1) pobranie tokena
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError('Nie jestes zalogowany', 401));
    }
    //2) weryfikacja tokena 
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) sprawdzam czy uzytkownik wciaz istnieje
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('Blad przypisanego tokenu, prosze zaloguj sie ponownie', 401))
    }
    //4) check if change password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again.', 401));
    }
    //przyznanie dostepu do
    req.user = currentUser;
    next();
});

