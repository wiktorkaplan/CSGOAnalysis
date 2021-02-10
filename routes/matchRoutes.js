const express = require('express');
const matchController = require('./../controllers/matchController');
const authController = require('./../controllers/authController');
const formidableMiddleware = require('express-formidable');
const router = express.Router();

router
    .route('/')
    .get(authController.protect, matchController.readAllMatches)
    .post(formidableMiddleware(), authController.protect, matchController.createMatch)

router
    .route('/:id')
    .get(authController.protect, matchController.readMatch)
    .delete(authController.protect, matchController.deleteMatch)

module.exports = router;