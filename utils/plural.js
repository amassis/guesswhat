const pluralize = require('pluralize');
const pluralizar = require('pluralize-ptbr');

exports.getPlural = (subject, language) => {
	if (language === 'en_US') return pluralize.plural(subject);
	if (language === 'pt_BR') return pluralizar(subject);
};
