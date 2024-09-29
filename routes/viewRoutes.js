const express = require('express');
const viewController = require('../controllers/viewController');
//const bookingController = require('../controllers/bookingController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get(
	'/',
	viewController.setDefaultLanguage,
	// viewController.loadFooterStrings,
	viewController.goHome,
);
router.get(
	'/game',
	viewController.setDefaultLanguage,
	// viewController.loadFooterStrings,
	viewController.resetType,
	viewController.goToGame,
);
router.get(
	'/game/:lang',
	// viewController.loadFooterStrings,
	viewController.resetType,
	viewController.goToGame,
);
router.get(
	'/game/:lang/addType',
	// viewController.loadFooterStrings,
	viewController.addType,
);
router.get(
	'/rungame/:typeId',
	// viewController.loadFooterStrings,
	viewController.setType,
	viewController.runGame,
);
router.get(
	'/rungame/:typeId/:elementId',
	// viewController.loadFooterStrings,
	viewController.setType,
	viewController.runGame,
);
router.get(
	'/rungame/:typeId/:elementId/:prevElement/:operation/:nextElement',
	// viewController.loadFooterStrings,
	viewController.setType,
	viewController.runGame,
);
module.exports = router;
