const express = require('express');
const elementController = require('../controllers/elementController');

const router = express.Router();

router
	.route('/')
	.get(elementController.getAllElements)
	.post(elementController.createElement);
router
	.route('/:id')
	.get(elementController.getElement)
	.patch(elementController.updateElement)
	.delete(elementController.deleteElement);

module.exports = router;
