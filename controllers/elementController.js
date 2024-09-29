const Element = require('../models/ElementModel');
const Type = require('../models/TypeModel');
const factory = require('./handlerFactory');
// const typeController = require('./typeController');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { DEBUG, debug } = require('../utils/debug');

exports.getAllElements = factory.getAll(Element);
exports.getElement = factory.getOne(Element);
exports.createElement = factory.createOne(Element);
exports.updateElement = factory.updateOne(Element);
exports.deleteElement = factory.deleteOne(Element);

exports.elementCountAggregate = catchAsync(async (type) => {
	const count = await Element.aggregate([
		{ $match: { type } },
		{ $group: { _id: null, elementCount: { $sum: 1 } } },
	]);
	return count[0].elementCount;
});

exports.elementCount = catchAsync(async (type) => {
	const elements = await Element.find({ type });
	console.log(elements);
	console.log(elements.length);
	return elements.length;
});
