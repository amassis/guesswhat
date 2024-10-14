const mongoose = require('mongoose');
const { translate } = require('bing-translate-api');
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
		imageAuthor: {
			type: String,
		},
		imageAuthorLink: {
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
		originalType: {
			type: mongoose.Schema.ObjectId,
			ref: 'Type',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

typeSchema.index({ type: 1, language: 1 }, { unique: true });
typeSchema.index({ originalType: 1, language: 1 }, { unique: true });

typeSchema.virtual('elementCount').get(function () {
	return this.elements.length;
});

//BUG CANNOT TRANSLATE TYPE IN THE MODEL BECAUSE WE NEED TO CREATE THE FIRST ELEMENT AS WELL, and the Types must exist before element is created
// TRANSLATE TYPE IN THE viewController AddType
// typeSchema.post('save', async (type) => {
// 	if (type.originalType) return;

// 	const langsToCreate = [];
// 	if (type.language !== 'en_US') {
// 		langsToCreate.push('en_US');
// 	} else {
// 		originalLang = 'en';
// 	}
// 	if (type.language !== 'pt_BR') {
// 		langsToCreate.push('pt_BR');
// 	} else {
// 		originalLang = 'pt';
// 	}
// 	if (type.language !== 'es_ES') {
// 		langsToCreate.push('es_ES');
// 	} else {
// 		originalLang = 'es';
// 	}

// 	langsToCreate.forEach(async (lang) => {
// 		const langCode = lang.slice(0, 2);
// 		let text = '';
// 		const newType = {};
// 		text = await translate(type.type.singular, originalLang, langCode);
// 		const singular = text.translation;
// 		text = await translate(type.type.plural, originalLang, langCode);
// 		const plural = text.translation;
// 		newType.type = {
// 			singular,
// 			plural,
// 		};
// 		text = await translate(type.example, originalLang, langCode);
// 		newType.example = text.translation;
// 		text = await translate(type.question, originalLang, langCode);
// 		newType.question = text.translation;
// 		newType.language = lang;
// 		newType.color = type.color;
// 		newType.image = type.image;
// 		newType.originalType = type._id;
// 		newType.answer = true;
// 		newType.elements = [];
// 		newTypeCreated = await Type.create(newType);
// 	});
// });

const Type = mongoose.model('Type', typeSchema);

module.exports = Type;
