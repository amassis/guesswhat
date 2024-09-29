const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const Type = require('./TypeModel');
const { DEBUG, debug } = require('../utils/debug');

const elementSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	type: {
		type: mongoose.Schema.ObjectId,
		ref: 'Type',
		required: [true, 'You must indicate the type of element you are dealing with.'],
	},
	question: {
		type: String,
		required: [true, 'Specify a question that I can use to identify this element in relation other elements.'],
	},
	leftNode: {
		type: mongoose.Schema.ObjectId,
		ref: 'Element',
	},
	rightNode: {
		type: mongoose.Schema.ObjectId,
		ref: 'Element',
	},
});

// elementSchema.pre(/^find/, function (next) {
// 	this.populate({ path: 'type', select: '_id, type' });
// 	next();
// });

elementSchema.post('save', async function (element) {
	const type = await Type.findById({ _id: element.type });
	type.elements.push(element._id);

	await Type.updateOne({ _id: type._id }, { elements: type.elements });
});

const Element = mongoose.model('Element', elementSchema);

module.exports = Element;
