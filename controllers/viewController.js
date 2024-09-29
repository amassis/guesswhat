// const Tour = require('../models/tourModel');
// const Booking = require('../models/bookingModel');
// const Review = require('../models/reviewModel');
const Type = require('../models/TypeModel');
const Element = require('../models/ElementModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const messages = require('../utils/messages');
const elementController = require('./elementController');
const { DEBUG, debug, fctName } = require('../utils/debug');
const { chdir } = require('process');

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
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'resetType ';

	res.locals.type = '';
	if (DEBUG) debug(debugLevel, res.locals.type, 'Here is res.locals.type after reset ', debugMe, ++debugStep);
	next();
};

exports.setType = async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'setType ';

	const { typeId } = req.params;

	// Load type
	const type = await Type.findById({ _id: typeId });

	if (!type) return next(new AppError(`Type ${typeId} was not found`, 404));

	if (DEBUG) debug(debugLevel, type, 'Here is the type I found ', debugMe, ++debugStep);

	res.locals.type = type;
	if (DEBUG) debug(debugLevel, res.locals.type, 'Here is res.locals.type after set ', debugMe, ++debugStep);
	next();
};

// exports.loadFooterStrings = catchAsync(async (req, res, next) => {
// 	req.footer = {};
// 	req.footer.aboutUs = await messages('aboutUs', req.params.lang);
// 	req.footer.contact = await messages('contact', req.params.lang);
// 	req.footer.copyright = await messages('copyright', req.params.lang);
// 	next();
// });

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
		// footer,
	});
});

exports.goToGame = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'goToGame';

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
		// footer: req.footer,
	});
});

exports.addType = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'addType';

	if (DEBUG) debug(debugLevel, req.params, 'Parameters - should have lang', debugMe, ++debugStep);

	// Load gameStrings in correct Language
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

// const analyzeAnswerOLD = async (elementId, answer, validated = false) => {
// 	let debugStep = 0;
// 	const debugLevel = 1;
// 	const debugMe = 'analyzeAnswer';

// 	if (DEBUG) debug(debugLevel, { elementId, answer, validated }, 'Analyze results: ', debugMe, ++debugStep);

// 	elementId = elementId.toString();
// 	if (answer) {
// 		answer = answer.toString();
// 		if (DEBUG) debug(debugLevel, { elementId, answer, validated }, 'There is answer: ', debugMe, ++debugStep);
// 		if (answer === elementId) {
// 			if (DEBUG) debug(debugLevel, { elementId, answer, validated }, 'Equal: VALIDATE SUCCESS', debugMe, ++debugStep);
// 			if (validated) {
// 				if (DEBUG) debug(debugLevel, { elementId, answer, validated }, 'Validated: Success', debugMe, ++debugStep);
// 				const willReturn = { destiny: `${elementId}/success`, validate: false };
// 				if (DEBUG) debug(debugLevel, willReturn, 'Will Return', debugMe, ++debugStep);
// 				return willReturn;
// 			} else {
// 				if (DEBUG) debug(debugLevel, { elementId, answer, validated }, 'Not Validated: Validate', debugMe, ++debugStep);
// 				const willReturn = { destiny: `${elementId}/validate`, validate: true };
// 				if (DEBUG) debug(debugLevel, willReturn, 'Will Return', debugMe, ++debugStep);
// 				return willReturn;
// 				//return `${elementId}`; // NA VALIDATE, "JA SEI, É TAL CARA" ACERTOU!! ERROU !!! SE O USUARIO CONFIRMAR, aí é SUCCESS, SE NÃO, também é LEARN BUG
// 			}
// 		} else {
// 			if (DEBUG) debug(debugLevel, { elementId, answer, validated }, 'Not Equal: Jump to answer', debugMe, ++debugStep);
// 			const willReturn = { destiny: `${answer}`, validate: false };
// 			if (DEBUG) debug(debugLevel, willReturn, 'Will Return', debugMe, ++debugStep);
// 			return willReturn;
// 		}
// 	} else {
// 		if (DEBUG) debug(debugLevel, { elementId, answer, validated }, ' No answer: Jump to learn', debugMe, ++debugStep);
// 		const willReturn = { destiny: `${elementId}/learn`, validate: false };
// 		if (DEBUG) debug(debugLevel, willReturn, 'Will Return', debugMe, ++debugStep);
// 		return willReturn;
// 	}
// };

const prepareDestinations = async (prevElement, currentElement, operation) => {
	// BUG A chave do BUG está aqui
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

	if (operation.startsWith('guess')) {
		response.operationLeft = 'success';
		response.operationRight = `learn${operation.slice(5)}`;
		// response.operationRight = operation === 'guessLeft' ? 'learnRight' : 'learnLeft';
		response.nextnodeLeft = elementId;
		response.nextnodeRight = prevElement;
		response.prevElement = elementId;
	} else {
		if (left) {
			if (left === prevElement) {
				response.operationLeft = 'guessLeft';
				response.nextnodeLeft = left;
				response.prevElement = prevElement;
			} else if (left === elementId) {
				response.operationLeft = 'guessLeft';
				response.nextnodeLeft = left;
				response.prevElement = elementId;
			} else {
				response.operationLeft = 'ask';
				response.nextnodeLeft = left;
				response.prevElement = prevElement;
			}
		} else {
			response.operationLeft = 'learnLeft';
			response.nextnodeLeft = elementId;
			response.prevElement = prevElement;
		}

		if (right) {
			if (right === prevElement) {
				response.operationRight = 'guessRight';
				response.nextnodeRight = right;
				response.prevElement = prevElement;
			} else if (right === elementId) {
				response.operationRight = 'guessRight';
				response.nextnodeRight = right;
				response.prevElement = elementId;
			} else {
				response.operationRight = 'ask';
				response.nextnodeRight = right;
				response.prevElement = prevElement;
			}
		} else {
			response.operationRight = 'learnRight';
			response.nextnodeRight = elementId;
			response.prevElement = prevElement;
		}
	}
	// const leftNode = element.leftNode?.toString();
	// const rightNode = element.rightNode?.toString();
	// const destination = {};
	// // Prepare Destination Left (Yes)
	// if (leftNode) {
	// 	// There is a path for Yes
	// 	destination.nextnodeYes = leftNode;
	// 	destination.operation = 'askLeft';
	// } else {
	// 	destination.nextnodeYes = element._id;
	// 	destination.operation = 'guessLeft';
	// }

	// let guessOrSuccess = 'guess';
	// let askOrLearn = 'ask';
	// let side = 'Right';
	// if (operation === 'guess') {
	// 	// Guess is done, equality means success
	// 	guessOrSuccess = 'success';
	// 	askOrLearn = 'learn';
	// 	side = 'Left';
	// }
	// if (DEBUG) debug(debugLevel, { guessOrSuccess, side, askOrLearn }, 'G/S side A/L', debugMe, ++debugStep);
	// if (!(currentElement.leftNode || currentElement.rightNode)) {
	// 	response.nextnodeYes = currentElement._id.toString();
	// 	response.operationLeft = guessOrSuccess;
	// 	response.nextnodeNo = currentElement._id.toString();
	// 	if (operation !== 'guess') response.operationRight = 'learnRight';
	// 	else response.operationRight = 'learnLeft';
	// }

	// if (currentElement.leftNode && !currentElement.rightNode) {
	// 	// BUG Tá batendo aqui e indo pra guess quando deveria ir pra cachorro.
	// 	if (currentElement._id.toString() !== nextElement) {
	// 		response.nextnodeYes = currentElement.leftNode.toString();
	// 		response.operationLeft = 'askLeft';
	// 		response.nextnodeNo = currentElement._id.toString();
	// 		response.operationRight = 'learnRight';
	// 	} else {
	// 		response.nextnodeYes = operation === 'guess' ? currentElement._id.toString() : currentElement.leftNode.toString();
	// 		response.operationLeft = `${askOrLearn}${side}`;
	// 		response.nextnodeNo = currentElement._id.toString();
	// 		response.operationRight = guessOrSuccess;
	// 	}
	// }

	// if (currentElement.rightNode && !currentElement.leftNode) {
	// 	if (currentElement._id.toString() !== nextElement) {
	// 		response.nextnodeYes = currentElement._id.toString();
	// 		response.operationLeft = 'learnLeft';
	// 		response.nextnodeNo = currentElement.rightNode.toString();
	// 		response.operationRight = 'askRight';
	// 	} else {
	// 		response.nextnodeYes = currentElement._id.toString();
	// 		response.operationLeft = guessOrSuccess;
	// 		response.nextnodeNo = operation === 'guess' ? currentElement._id.toString() : currentElement.rightNode.toString();
	// 		response.operationRight = `${askOrLearn}${side}`; //ERA RIGHT
	// 	}
	// }
	// if (currentElement.rightNode && currentElement.leftNode) {
	// 	response.nextnodeYes = currentElement.leftNode.toString();
	// 	response.operationLeft = 'askLeft';
	// 	response.nextnodeNo = currentElement.rightNode.toString();
	// 	response.operationRight = 'askRight';
	// }
	// response.prevNode = prevElement;

	return response;
};

exports.runGame = catchAsync(async (req, res, next) => {
	let debugStep = 0;
	const debugLevel = 1;
	const debugMe = 'runGame';
	// BUG
	// Quando eu disse que late e criei a foca, em vez de a foca se relacionar com o left do dog, ficou com o right e sobrepôs Lion.
	// assim, o "From" que eu estou passando está errado. No Guess tem que manter a o Left/Right da operação anterior e não do próprio Guess.
	if (DEBUG) debug(debugLevel, req.params, 'INIT - Parameters received', debugMe, ++debugStep);
	let { typeId, elementId, prevElement, operation, nextElement } = req.params;

	let page = 'runGame';
	if (operation && operation.startsWith('learn')) page = 'runGameLearn';
	if (operation && operation === 'success') page = `runGameSuccess`;
	//if (!operation.startsWith('guess')) {
	prevElement = elementId;
	//}
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
		type = await Type.findById({ _id: typeId });

		if (!type) return next(new AppError(`Type ${typeId} was not found`, 404));

		if (DEBUG) debug(debugLevel, type, 'Here is the type I found ', debugMe, ++debugStep);
		res.locals.type = type;
	} else {
		type = res.locals.type;
	}

	if (!elementId) {
		elementId = type.elements[0];
	}

	// Load element
	const element = await Element.findById({ _id: elementId });

	if (!element) return next(new AppError(`Element ${elementId} was not found`, 404));
	if (DEBUG) debug(debugLevel, element, 'Here is the element I found ', debugMe, ++debugStep);

	//if (res.locals.fromElement) fromElement = res.locals.fromElement;

	const destination = await prepareDestinations(prevElement, element, operation);

	//res.locals.fromElement = element; // BUG não funciona porque é a última etapa do pipeline de middleware - não guarda depois disso. Acho que teria que usar um cookie no index.js pra guardar o elemento anterior ???

	// Load runStrings in correct Language
	const language = type.language;
	const runStrings = {};
	if (operation) {
		if (operation === 'success') {
			runStrings.title = await messages('success_ELEMENT', language, element.name);
			runStrings.subtitle = await messages('gameWins', language);
		}
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
		if (operation.startsWith('guess')) runStrings.guess = await messages('validate_ELEMENT', language, element.name);
	}
	runStrings.title = await messages('letsPlayGuess', language);
	runStrings.subtitle = await messages('thinkAboutElement_SINGULAR', language, type.type.singular);
	runStrings.yesString = await messages('yes', language);
	runStrings.noString = await messages('no', language);
	const isGuess = operation.startsWith('guess');

	if (DEBUG) debug(debugLevel, destination, 'Destinations for page', debugMe, ++debugStep);
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
	});
});

// exports.runGameOLD = catchAsync(async (req, res, next) => {
// 	let debugStep = 0;
// 	const debugLevel = 1;
// 	const debugMe = 'runGame';

// 	//
// 	//
// 	// BUG
// 	// Furo de lógica: Falta a pergunta final. "É tal elemento?" e aí precisa mais um sim ou não, para depois decidir se houve sucesso
// 	//
// 	//

// 	if (DEBUG)
// 		debug(
// 			debugLevel,
// 			req.params,
// 			'Parameters - should have type; might have element and/or result',
// 			debugMe,
// 			++debugStep,
// 		);

// 	// get type and result from params. Result can be either success, learn or non-existent
// 	let { typeId, elementId, result, btn } = req.params;
// 	let validated;

// 	let page = 'runGame';
// 	if (result && result !== 'validate') page = `runGame${result}`;

// 	if (result === 'validate') validated = true;

// 	if (DEBUG) debug(debugLevel, { result, page }, 'Here are result and page', debugMe, ++debugStep);

// 	// Load type
// 	const type = await Type.findById({ _id: typeId });

// 	if (!type) return next(new AppError(`Type ${typeId} was not found`, 404));

// 	if (DEBUG) debug(debugLevel, type, 'Here is the type I found ', debugMe, ++debugStep);

// 	if (!elementId) {
// 		elementId = type.elements[0];
// 	}

// 	// Load element
// 	const element = await Element.findById({ _id: elementId });

// 	if (!element) return next(new AppError(`Element ${elementId} was not found`, 404));

// 	if (DEBUG) debug(debugLevel, element, 'Here is the element I found ', debugMe, ++debugStep);

// 	const { destiny: destinyTrue, validate: validateTrue } = await analyzeAnswer(
// 		element._id,
// 		element.leftNode,
// 		validated,
// 	);
// 	let destinyFalse;
// 	if (result !== 'validate') {
// 		({ destiny: destinyFalse } = await analyzeAnswer(element._id, element.rightNode, validated));
// 	}
// 	if (result === 'validate') {
// 		({ destiny: destinyFalse } = await analyzeAnswer(element._id, null, validated));
// 	}

// 	//const validate = validateTrue || validateFalse;

// 	if (DEBUG) debug(debugLevel, { destinyTrue, destinyFalse }, 'True, False  after analyze', debugMe, ++debugStep);
// 	// Load runStrings in correct Language
// 	const language = type.language;
// 	const runStrings = {};
// 	if (result) {
// 		if (result === 'success') {
// 			runStrings.title = await messages('success_ELEMENT', language, element.name);
// 			runStrings.subtitle = await messages('gameWins', language);
// 		}
// 		if (result === 'learn') {
// 			runStrings.title = await messages('playerWins', language);
// 			runStrings.subtitle = await messages('timeToLearnNew_SINGULAR', language, type.type.singular);
// 			runStrings.yourElement = await messages('whichElementDidYouThinkAbout_SINGULAR', language, type.type.singular);
// 			runStrings.question = await messages('tellMeYesNoQuestionToIdentify_SINGULAR', language, type.type.singular);
// 			runStrings.newAnswer = await messages('whatIsTheAnswerFor_SINGULAR', language, type.type.singular);
// 			runStrings.send = await messages('send', language);
// 			runStrings.thanks = await messages('iLoveLearningNewThings', language);
// 			runStrings.newElement = await messages('newElementInserted_ELEMENT', language);
// 		}
// 		if (result === 'validate') runStrings.validate = await messages('validate_ELEMENT', language, element.name);
// 	}
// 	runStrings.title = await messages('letsPlayGuess', language);
// 	runStrings.subtitle = await messages('thinkAboutElement_SINGULAR', language, type.type.singular);
// 	runStrings.yesString = await messages('yes', language);
// 	runStrings.noString = await messages('no', language);

// 	if (DEBUG) debug(debugLevel, { destinyTrue, destinyFalse }, 'True, False & Validate into page', debugMe, ++debugStep);
// 	// Render runGame page
// 	res.status(200).render(page, {
// 		title: 'GuessWhat?',
// 		home: `game/${language}`,
// 		runStrings,
// 		type,
// 		element,
// 		destinyTrue,
// 		destinyFalse,
// 		result,
// 		btn,
// 	});
// });

// exports.getTour = catchAsync(async (req, res, next) => {
// 	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
// 		path: 'reviews',
// 		fields: 'review, rating, user',
// 	});

// 	if (!tour) return next(new AppError('There is no tour with that name', 404));

// 	//If logged in, get user id and check for booking
// 	let hasBooking = false;
// 	let hasReview = false;

// 	if (res.locals.user) {
// 		const booking = await Booking.findOne({
// 			tour: tour.id,
// 			user: res.locals.user.id,
// 		});

// 		const review = await Review.findOne({
// 			tour: tour.id,
// 			user: res.locals.user.id,
// 		});
// 		if (booking) hasBooking = true;
// 		if (review) hasReview = true;
// 	}

// 	res.status(200).render('tour', {
// 		title: `${tour.name} Tour`,
// 		tour: tour,
// 		myReviews: false,
// 		hasBooking,
// 		hasReview,
// 	});
// });

// exports.getLoginForm = (req, res) => {
// 	res.status(200).render('login', { title: 'Log into your account' });
// };

// exports.getSignupForm = (req, res) => {
// 	res.status(200).render('signup', { title: 'Sign up to a new account' });
// };

// exports.getAccountForm = (req, res) => {
// 	// console.log(res.locals.user);
// 	res.status(200).render('account', { title: 'Your account' });
// };

// exports.passwordReset = (req, res, next) => {
// 	// console.log(req.params.token);
// 	res.status(200).render('resetPassword', {
// 		title: 'Reset your Password',
// 		token: req.params.token,
// 	});
// };

// exports.getMyTours = catchAsync(async (req, res, next) => {
// 	// console.log(req.user);
// 	const bookings = await Booking.find({ user: req.user.id });

// 	if (!bookings || bookings.length < 1)
// 		return next(new AppError("You don't have any bookings", 404));

// 	const myToursIds = bookings.map((bk) => bk.tour);
// 	const myTours = await Tour.find({ _id: { $in: myToursIds } });

// 	res.status(200).render('overview', {
// 		title: `My Bookings`,
// 		tours: myTours,
// 	});
// });

// exports.getMyReviews = catchAsync(async (req, res, next) => {
// 	// console.log(req.user);
// 	const reviews = await Review.find({ user: req.user.id }).populate('tour');

// 	if (!reviews || reviews.length < 1)
// 		return next(new AppError("You don't have any reviews", 404));

// 	// console.log(reviews);

// 	res.status(200).render('myreviews', {
// 		title: `My Reviews`,
// 		reviews: reviews,
// 		myReviews: true,
// 	});
// });

exports.alerts = (req, res, next) => {
	const { alert } = req.query;
	if (alert === 'booking')
		res.locals.alert =
			"Your booking was successful and a confirmation was sent to your email. Please notice, it may take a few minutes for your account to reflect the new booking. If that's the case, please check back later.";
	next();
};
