const Message = require('../models/MessageModel');
const catchAsync = require('./catchAsync');

module.exports = async (messageKey, language = 'en_US', argument = '') => {
	let doc = await Message.findOne({ messageKey: messageKey }).exec();
	if (argument !== '') {
		if (!doc) return messageKey.replace('{{VARIABLE}}', argument);
		if (doc.message[language]) return doc.message[language].replace('{{VARIABLE}}', argument);
		if (!doc.message[language]) return doc.message['en_US'].replace('{{VARIABLE}}', argument);
	} else {
		if (!doc) return messageKey;
		if (doc.message[language]) return doc.message[language];
		if (!doc.message[language]) return doc.message['en_US'];
	}
};
