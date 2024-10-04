const Type = require('../models/TypeModel');
const Element = require('../models/ElementModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const messages = require('../utils/messages');
let { DEBUG, debug, fctName } = require('../utils/debug');

countElementsForType = catchAsync(async (type) => {
	const elements = await Element.find({ type });
	return elements.length;
});

exports.setDefaultLanguage = (req, res, next) => {
	// Middleware - when there is no language defined, set language as en_US
	req.params.lang = 'en_US';
	next();
};

exports.resetType = (req, res, next) => {
	// Middleware - when resets res.locals.type
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'resetType ';
	DEBUG = false;

	res.locals.type = '';
	if (DEBUG) debug(debugLevel, res.locals.type, 'Here is res.locals.type after reset ', debugMe, ++debugStep);
	next();
};

exports.setType = async (req, res, next) => {
	// Middleware - when sets res.locals.type and loads type
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'setType';
	DEBUG = false;

	const { typeId } = req.params;

	// Load type
	const type = await Type.findById({ _id: typeId });

	if (!type) return next(new AppError(`Type ${typeId} was not found`, 404));

	if (DEBUG) debug(debugLevel, type, 'Here is the type I found ', debugMe, ++debugStep);

	res.locals.type = type;
	next();
};

const fetchLang = async (langCode) => {
	// Build lang object for home page
	const lang = { code: langCode };
	lang.name = await messages('langName', lang.code);
	lang.intro = await messages('intro', lang.code);
	lang.message = await messages('message', lang.code);
	lang.cta = await messages('callToAction', lang.code);
	return lang;
};

exports.goHome = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'goHome';
	DEBUG = false;

	// load langs with strings for all three languages
	const langs = [];
	langs.push(await fetchLang('en_US'));
	langs.push(await fetchLang('pt_BR'));
	langs.push(await fetchLang('es_ES'));

	if (DEBUG) debug(debugLevel, langs, 'Langs array is here ', debugMe, ++debugStep);

	// render the home page
	res.status(200).render('home', {
		title: 'GuessWhat?',
		home: '',
		langs,
	});
});

exports.goToGame = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'goToGame';
	DEBUG = false;

	if (DEBUG) debug(debugLevel, req.params, 'Parameters - should have lang', debugMe, ++debugStep);

	// Load gameStrings in correct Language
	const gameStrings = {};
	const language = req.params.lang;
	gameStrings.title = await messages('whatDoYouWantMeToGuess', language);
	gameStrings.subtitle = await messages('theseAreTheThingsIHaveAlreadyLearnedAbout', language);

	// Load types in correct language
	const types = await Type.find({ language });

	// Sort by elementCount in Descending order
	types.sort((a, b) => b.elementCount - a.elementCount);
	if (DEBUG) debug(debugLevel, types, 'Sorted Types for language ', debugMe, ++debugStep);

	// set plural var
	const plural = types.length > 1 ? true : false;

	// Render game page
	res.status(200).render('game', {
		title: 'GuessWhat?',
		home: '',
		language,
		gameStrings,
		plural,
		types,
	});
});

exports.addType = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'addType';
	DEBUG = false;

	if (DEBUG) debug(debugLevel, req.params, 'Parameters - should have lang', debugMe, ++debugStep);

	// Load addStrings in correct Language
	const addStrings = {};
	const language = req.params.lang;
	addStrings.title = await messages('whatDoYouWantToTeachMe', language);
	addStrings.example = await messages('giveMeAnExampleOf_DOM_SINGULAR', language);
	addStrings.question = await messages('tellMeYesNoQuestionToIdentify_DOM_EXAMPLE', language);
	addStrings.answer = await messages('whatIsTheAnswerFor_DOM_EXAMPLE', language);
	addStrings.thanks = await messages('nowICanLearnMore_DOM_PLURAL', language);
	addStrings.useSingular = await messages('useSingularForm', language);
	addStrings.singular = await messages('singular', language);
	addStrings.plural = await messages('plural', language);
	addStrings.yesString = await messages('yes', language);
	addStrings.noString = await messages('no', language);
	addStrings.done = await messages('done', language);
	addStrings.newTypeMsg = await messages('newTypeInserted', language);

	// Render addType page
	res.status(200).render('addType', {
		title: 'GuessWhat?',
		home: `game/${language}`,
		addStrings,
	});
});

const prepareDestinations = async (prevElement, currentElement, operation) => {
	// Designs the flow of the game by setting actions and destinations for left and right nodes
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'prepareDestinations';

	const elementId = currentElement._id.toString();
	const left = currentElement.leftNode?.toString();
	const right = currentElement.rightNode?.toString();
	const response = {};

	if (DEBUG)
		debug(
			debugLevel,
			{ prevElement, elementId, operation, left, right },
			'Init Prepare Destinations',
			debugMe,
			++debugStep,
		);

	// If this is a guess, left means success, right means learn new element
	if (operation.startsWith('guess')) {
		response.operationLeft = 'success';
		response.operationRight = `learn${operation.slice(5)}`;
		response.nextnodeLeft = elementId;
		response.nextnodeRight = elementId;
	} else {
		// Left Node is not null
		if (left) {
			// If we have been through left before, or if left is the current element, we should guess it
			// otherwise, navigate left
			if (prevElement.includes(left)) {
				response.operationLeft = 'guessLeft';
				response.nextnodeLeft = left;
			} else if (left === elementId) {
				response.operationLeft = 'guessLeft';
				response.nextnodeLeft = left;
			} else {
				response.operationLeft = 'ask';
				response.nextnodeLeft = left;
			}
		} else {
			// Null left node means Learn new Left node
			response.operationLeft = 'learnLeft';
			response.nextnodeLeft = elementId;
		}

		// Right Node is not null
		if (right) {
			// If we have been through right before, or if right is the current element, we should guess it
			// otherwise, navigate right
			if (prevElement.includes(right)) {
				response.operationRight = 'guessRight';
				response.nextnodeRight = right;
			} else if (right === elementId) {
				response.operationRight = 'guessRight';
				response.nextnodeRight = right;
			} else {
				response.operationRight = 'ask';
				response.nextnodeRight = right;
			}
		} else {
			// Null right node means Learn new Right node
			response.operationRight = 'learnRight';
			response.nextnodeRight = elementId;
		}
	}
	return response;
};

exports.runGame = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'runGame';

	// Params bring the type, Element, current Operation and current Destination
	if (DEBUG) debug(debugLevel, req.params, 'INIT - Parameters received', debugMe, ++debugStep);
	let { typeId, elementId, operation, nextElement } = req.params;

	// Query brings the whole tree of elements we've been through before
	// load the elements into prevElement array
	if (DEBUG) debug(debugLevel, req.query, 'INIT - Query received', debugMe, ++debugStep);
	let prevElement = [];
	const queryPrevious = req.query.eID;
	if (queryPrevious) {
		if (typeof queryPrevious === 'object') {
			// query already brings an array
			prevElement = [...queryPrevious];
		} else {
			// query brings only one eID, push to empty array
			prevElement.push(queryPrevious);
		}
	}

	// sets correct page to render
	let page = 'runGame';
	if (operation && operation.startsWith('learn')) page = 'runGameLearn';
	if (operation && operation === 'success') page = `runGameSuccess`;
	prevElement.push(nextElement);
	elementId = nextElement;

	if (DEBUG)
		debug(
			debugLevel,
			{ operation, page, prevElement, elementId },
			'Here are operation page and prev/current elementId',
			debugMe,
			++debugStep,
		);

	// Load type
	let type;
	if (!res.locals.type) {
		// This shouldn't happen, it's just for safety, type shouldn't change during the game.
		// type should have been loaded in a previous middleware into res.locals.type
		type = await Type.findById({ _id: typeId });
		if (!type) return next(new AppError(`Type ${typeId} was not found`, 404));
		if (DEBUG) debug(debugLevel, type, 'Here is the type I found ', debugMe, ++debugStep);
		res.locals.type = type;
	} else {
		type = res.locals.type;
	}

	// should no longer be required, kept for safety
	if (!elementId) {
		elementId = type.elements[0];
	}

	// Load element
	const element = await Element.findById({ _id: elementId });

	// This should not happen, just extra safety
	if (!element) return next(new AppError(`Element ${elementId} was not found`, 404));
	if (DEBUG) debug(debugLevel, element, 'Here is the element I found ', debugMe, ++debugStep);

	// Sets the next possible responses operation and destination for left and right nodes
	const destination = await prepareDestinations(prevElement, element, operation);
	if (DEBUG) debug(debugLevel, destination, 'Destinations for page', debugMe, ++debugStep);

	// Load runStrings in correct Language
	const language = type.language;
	const runStrings = {};
	runStrings.title = await messages('letsPlayGuess', language);
	runStrings.subtitle = await messages('thinkAboutElement_SINGULAR', language, type.type.singular);

	if (operation) {
		// loads Success strings
		if (operation === 'success') {
			runStrings.title = await messages('success_ELEMENT', language, element.name);
			runStrings.subtitle = await messages('gameWins', language);
			runStrings.letsGoSame = await messages('letsGoSame', language);
			runStrings.letsGoDifferent = await messages('letsGoDifferent', language);
		}
		// loads learn strings
		if (operation.startsWith('learn')) {
			runStrings.title = await messages('playerWins', language);
			runStrings.subtitle = await messages('timeToLearnNew_SINGULAR', language, type.type.singular);
			runStrings.yourElement = await messages('whichElementDidYouThinkAbout_SINGULAR', language, type.type.singular);
			runStrings.question = await messages('tellMeYesNoQuestionToIdentify_SINGULAR', language, type.type.singular);
			runStrings.newAnswer = await messages('whatIsTheAnswerFor_SINGULAR', language, type.type.singular);
			runStrings.send = await messages('send', language);
			runStrings.thanks = await messages('iLoveLearningNewThings', language);
			console.log('Before', runStrings.newElementMsg);
			runStrings.newElementMsg = await messages('newElementInserted_DOM_ELEMENT', language);
			console.log('After', runStrings.newElementMsg);
		}
		// loads guess strings
		if (operation.startsWith('guess')) runStrings.guess = await messages('validate_ELEMENT', language, element.name);
	}
	// loads common strings
	runStrings.yesString = await messages('yes', language);
	runStrings.noString = await messages('no', language);

	const isGuess = operation.startsWith('guess');
	query = `?eID=${prevElement.join('&eID=')}`; // sends all of previous tree elements in query string

	// Render runGame page
	res.status(200).render(page, {
		title: 'GuessWhat?',
		home: `game/${language}`,
		runStrings,
		type,
		element,
		destination,
		operation,
		isGuess,
		query,
	});
});

// middleware available for eventual pre-route alerts; so far unused, "booking" kept as an example.
exports.alerts = (req, res, next) => {
	const { alert } = req.query;
	if (alert === 'booking')
		res.locals.alert =
			"Your booking was successful and a confirmation was sent to your email. Please notice, it may take a few minutes for your account to reflect the new booking. If that's the case, please check back later.";
	next();
};
