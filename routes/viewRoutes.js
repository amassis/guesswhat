const express = require('express');
const viewController = require('../controllers/viewController');
//const bookingController = require('../controllers/bookingController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', viewController.setDefaultLanguage, viewController.goHome);
router.get('/game', viewController.setDefaultLanguage, viewController.resetType, viewController.goToGame);
router.get('/game/:lang', viewController.resetType, viewController.goToGame);
router.get('/game/:lang/addType', viewController.addType);
router.get('/rungame/:typeId', viewController.setType, viewController.runGame);
router.get('/rungame/:typeId/:elementId', viewController.setType, viewController.runGame);
router.get('/rungame/:typeId/:elementId/:operation/:nextElement', viewController.setType, viewController.runGame);
module.exports = router;
