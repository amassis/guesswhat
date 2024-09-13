const express = require('express');
const viewController = require('../controllers/viewController');
//const bookingController = require('../controllers/bookingController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', viewController.goHome);

module.exports = router;
