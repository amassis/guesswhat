const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const catchAsync = require('../utils/catchAsync');
const { DEBUG, debug } = require('../utils/debug');
// const Element = require('./ElementModel');
// const elementController = require('../controllers/elementController');

const typeSchema = new mongoose.Schema(
	{
		type: {
			singular: {
				type: String,
				required: [true, 'Type is required'],
			},
			plural: {
				type: String,
				required: [true, 'Type is required'],
			},
		},
		language: {
			type: String,
			default: 'en_US',
			enum: {
				values: ['en_US', 'pt_BR', 'es_ES'],
				message: 'We currently support English (en_US), Portuguese (pt_BR) and Spanish (es_ES).',
			},
		},
		example: {
			type: String,
			required: [true, 'Example is required'],
		},
		question: {
			type: String,
			required: [true, 'Specify a question that I can use to identify this example'],
		},
		answer: {
			type: Boolean,
			required: [true, 'You must answer the question with Yes or No for that example'],
		},
		image: {
			type: String,
		},
		color: {
			bg1: String,
			bg2: String,
			font: String,
		},
		elements: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Element',
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

typeSchema.index({ type: 1, language: 1 }, { unique: true });

typeSchema.virtual('elementCount').get(function () {
	return this.elements.length;
});

// typeSchema.statics.createFirstElement = async (type) => {
// 	// Prepares basic Element data
// 	const data = {
// 		name: type.example,
// 		type: type._id,
// 		question: type.question,
// 	};

// 	// Create new Element with data
// 	const element = await Element.create(data);

// 	// Prepares element's binary Tree data
// 	const bTree = {
// 		leftNode: type.answer ? element._id : null,
// 		rightNode: type.answer ? null : element._id,
// 	};

// 	// Updates Element with Binary Tree
// 	const updatedElement = await Element.findByIdAndUpdate(element._id, bTree, {
// 		new: true,
// 		runValidators: true,
// 	});

// 	return updatedElement._id;
// };

// typeSchema.pre('save', function (next) {
// 	this.wasNew = this.isNew;
// 	next();
// });
// typeSchema.post('save', async (type) => {
// 	if (!this.wasNew) return;

// 	const elementId = await type.constructor.createFirstElement(type);
// 	type.elements.push(elementId);

// 	await Type.updateOne({ _id: type._id }, { elements: type.elements });
// });

const Type = mongoose.model('Type', typeSchema);

module.exports = Type;
