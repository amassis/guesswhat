const mongoose = require('mongoose');
const { translate } = require('bing-translate-api');
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
	originalElement: {
		type: mongoose.Schema.ObjectId,
		ref: 'Element',
	},
	isRootElement: {
		type: Boolean,
		default: false,
	},
});

elementSchema.post('save', async function (element) {
	const type = await Type.findById({ _id: element.type });
	type.elements.push(element._id);

	await Type.updateOne({ _id: type._id }, { elements: type.elements });
});

//TODO NEEDS TO HANDLE NOT ONLY CREATE BUT UPDATE ELEMENT AS WELL
//OR MOVE TO SAME SOLUTION AS TYPES, USE A ROUT TO TRANSLATE
elementSchema.post('save', async (element) => {
	if (element.originalElement) return;

	console.log('Original element');
	console.log(element);
	const type = await Type.findById(element.type);
	console.log('Original type');
	console.log(type);
	const langsToCreate = [];
	if (type.language !== 'en_US') {
		langsToCreate.push('en_US');
	} else {
		originalLang = 'en';
	}
	if (type.language !== 'pt_BR') {
		langsToCreate.push('pt_BR');
	} else {
		originalLang = 'pt';
	}
	if (type.language !== 'es_ES') {
		langsToCreate.push('es_ES');
	} else {
		originalLang = 'es';
	}
	console.log(langsToCreate);
	console.log(originalLang);

	langsToCreate.forEach(async (lang) => {
		console.log(`Translating ${lang}`);
		const langCode = lang.slice(0, 2);
		let text = '';
		const newElement = {};
		text = await translate(element.name, originalLang, langCode);
		newElement.name = text.translation;
		text = await translate(element.question, originalLang, langCode);
		newElement.question = text.translation;
		newElement.originalElement = element._id;

		const newElementType = await Type.findOne({ originalType: element.type, language: lang }).exec();
		console.log(`Found Type for originalType ${element.type} and lang ${lang}`);
		console.log(newElementType);
		newElement.type = newElementType._id.toString();

		if (element.leftNode) {
			const newElementLeftNode = await Element.findOne({
				originalElement: element.leftNode,
				type: element.type,
			}).exec();

			console.log(`Found element for leftNode ${element.leftNode} and type ${element.type}`);
			console.log(newElementLeftNode);
			newElement.leftNode = newElementLeftNode._id.toString();
		} else {
			newElement.leftNode = null;
		}

		if (element.rightNode) {
			const newElementRightNode = await Element.findOne({
				originalElement: element.rightNode,
				type: element.type,
			}).exec();
			console.log(`Found element for rightNode ${element.rightNode} and type ${element.type}`);
			console.log(newElementRightNode);
			newElement.rightNode = newElementRightNode._id.toString();
		} else {
			newElement.rightNode = null;
		}
		console.log(newElement);
		newElementCreated = await Element.create(newElement);
		console.log(newElementCreated);
	});
});

const Element = mongoose.model('Element', elementSchema);

module.exports = Element;
