exports.DEBUG = process.env.DEBUG;

exports.debug = (level, content, msg = '', fct = '', step = '') => {
	const caller = new Error().stack.match(/at (\S+)/g)[1].slice(3);
	let callerModule = caller.slice(
		caller.lastIndexOf('/') + 1,
		caller.lastIndexOf('.js')
	);

	if (callerModule.startsWith('model.')) callerModule = 'Model';

	console.log(
		`\nDEBUG ${'>>'.repeat(level)} Module: ${callerModule}${fct ? '; Function: ' + fct : ''}${step ? '; Step: ' + step : ''}.\n${msg}\n`,
		content
	);
};

exports.fctName = () => {
	console.log(new Error().stack);
	const caller = new Error().stack.match(/at (\S+)/g)[1].slice(3);
	let callerModule = caller.slice(
		caller.lastIndexOf('/') + 1,
		caller.lastIndexOf('.js')
	);
	return callerModule;
};
