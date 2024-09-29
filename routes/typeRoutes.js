const express = require('express');
const typeController = require('../controllers/typeController');

const router = express.Router();

router.route('/').get(typeController.getAllTypes).post(
	typeController.getTypeColor,
	typeController.getTypeImage,
	// typeController.resizeTypePhoto,
	typeController.createType
);
router
	.route('/:id')
	.get(typeController.getType)
	.patch(typeController.updateType)
	.delete(typeController.deleteType);

module.exports = router;
