const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
	script: String,
	page: String,
	messageKey: {
		type: String,
		validate: {
			validator: function (v) {
				return validator.isAlpha(v, 'en-US', { ignore: '-_' });
			},
			message: 'Message key must contain only alphabetical chars, dashes (-) or underscores (_).',
		},
	},
	message: {
		en_US: String,
		pt_BR: String,
		es_ES: String,
	},
});

messageSchema.index({ messageKey: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
