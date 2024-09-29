import messages from '../../utils/messages';
import { getPlural } from '../../utils/plural';
import { createType } from './createType';
import { createElement } from './createElement';

// DOM for create type
const createTypeEl = document.getElementById('create-type');
const singularEl = document.getElementById('singular');
const pluralEl = document.getElementById('plural');
const exampleEl = document.getElementById('example');
const questionEl = document.getElementById('question');
const fieldsetEl = document.querySelector('fieldset');
const inputYesEl = document.getElementById('input-yes');
const inputNoEl = document.getElementById('input-no');
const buttonDoneEl = document.getElementById('done');
const buttonSendEl = document.getElementById('send');
const subtitleEl = document.querySelector('.page-subtitle');
const lblPluralEl = document.getElementById('lbl-plural');
const lblExampleEl = document.getElementById('lbl-example');
const lblQuestionEl = document.getElementById('lbl-question');
const lblAnswerEl = document.getElementById('lbl-answer');

const getLangFromURL = () => {
	const url = window.location.href;
	const game = url.indexOf('/game/');
	console.log(url, game);
	console.log(url.slice(game + 6, game + 11));
	return url.slice(game + 6, game + 11);
};

const replaceVariable = (element, value) => {
	let elementValue = element.innerText;
	element.innerText = elementValue.replace('{{VARIABLE}}', value);
	return elementValue;
};

window.addEventListener('load', (e) => {
	console.log('Listener for Cards after pageload');
	// DOM for all card__heading
	const cardHeadingAllEl = document.querySelectorAll('h3.card__footing, h3.card__heading');
	// If I have any card__heading elements, I'm at game page, need to work on cards
	if (cardHeadingAllEl.length > 0) {
		// for each of the card__heading elements
		cardHeadingAllEl.forEach((cardHeadingEl) => {
			// read colors from dataset
			const { bg1Color, bg2Color, fontColor } = cardHeadingEl.dataset;
			// set CSS properties accordingly
			cardHeadingEl.style.setProperty('--type-bgcolor1', `${bg1Color}`);
			cardHeadingEl.style.setProperty('--type-bgcolor2', `${bg2Color}`);
			cardHeadingEl.style.setProperty('--type-fontcolor', `${fontColor}`);
		});
	}

	//Initial focus for Create Type page
	if (createTypeEl) {
		singularEl.focus();
	}

	//Initial focus for Learn page
	if (runGameEl && exampleEl) {
		exampleEl.focus();
	}
});

// Check for the Create Type Page
if (createTypeEl) {
	console.log('Listener for Create Type Page');

	singularEl.addEventListener('focusout', (e) => {
		const singular = singularEl.value;
		if (singular) {
			// Find and show Plural
			const lang = getLangFromURL();
			const plural = getPlural(singular, lang);
			pluralEl.value = plural;
			pluralEl.classList.toggle('input__inactive');
			lblPluralEl.classList.toggle('input__inactive');
			// Show example
			exampleEl.classList.toggle('input__inactive');
			replaceVariable(lblExampleEl, singular);
			lblExampleEl.classList.toggle('input__inactive');
			// Set focus on Example
			exampleEl.focus();
		}
	});
}

// DOM for Run Game
const runGameEl = document.getElementById('run-game');
const buttonYesEl = document.getElementById('button-yes');
const buttonNoEl = document.getElementById('button-no');

// Check for the Run Game Page
if (runGameEl && buttonYesEl && buttonNoEl) {
	console.log('Listeners for Run Game Page');

	buttonYesEl.addEventListener('click', (e) => {
		const { typeId } = runGameEl.dataset;
	});

	buttonNoEl.addEventListener('click', (e) => {
		const { typeId } = runGameEl.dataset;
	});
}

// Elements that appear in both pages
if (runGameEl || createTypeEl) {
	console.log('Listeners for both pages');
	if (exampleEl)
		exampleEl.addEventListener('focusout', (e) => {
			// Learning a new Animal, either by runGameLearn or by createType
			const example = exampleEl.value;
			if (example) {
				// Example has been filled - Show question
				questionEl.classList.toggle('input__inactive');
				if (createTypeEl) {
					replaceVariable(lblQuestionEl, example);
				}
				lblQuestionEl.classList.toggle('input__inactive');
				// Set focus to question
				questionEl.focus();
			}
		});

	if (questionEl)
		questionEl.addEventListener('focusout', (e) => {
			const question = questionEl.value;
			if (question) {
				// Question has been filled - show Done or Send buttons
				const example = exampleEl.value;
				// answerEl.classList.toggle('input__inactive');
				// if (createTypeEl) {
				// 	if (!lblAnswerEl.innerText.endsWith(`${example}?`))
				// 		lblAnswerEl.innerText = lblAnswerEl.innerText.replace('?', `${example}?`);
				// }
				// lblAnswerEl.classList.toggle('input__inactive');
				// fieldsetEl.classList.toggle('input__inactive');
				if (createTypeEl) {
					const plural = pluralEl.value;
					replaceVariable(subtitleEl, `${plural}!`);
				}
				subtitleEl.classList.toggle('input__inactive');
				if (buttonDoneEl) {
					buttonDoneEl.classList.toggle('input__inactive');
					buttonDoneEl.classList.toggle('btn');
				}
				if (buttonSendEl) {
					buttonSendEl.classList.toggle('input__inactive');
					buttonSendEl.classList.toggle('btn');
				}
			}
		});

	// if (inputYesEl)
	// 	inputYesEl.addEventListener('change', (e) => {
	// 		const inputYes = inputYesEl.checked;
	// 		if (inputYes) {
	// 			let plural;
	// 			if (createTypeEl) plural = pluralEl.value;
	// 			inputNoEl.checked = false;
	// 			subtitleEl.classList.toggle('input__inactive');
	// 			buttonDoneEl.classList.toggle('input__inactive');
	// 			buttonDoneEl.classList.toggle('btn');
	// 			if (createTypeEl) {
	// 				let finalMsg = subtitleEl.innerText;
	// 				finalMsg = finalMsg.replace('!', `${plural}!`);
	// 				subtitleEl.innerText = finalMsg;
	// 			}
	// 		}
	// 	});

	// if (inputNoEl)
	// 	inputNoEl.addEventListener('change', (e) => {
	// 		const inputNo = inputNoEl.checked;
	// 		if (inputNo) {
	// 			const plural = pluralEl.value;
	// 			inputYesEl.checked = false;
	// 			subtitleEl.classList.toggle('input__inactive');
	// 			buttonDoneEl.classList.toggle('input__inactive');
	// 			buttonDoneEl.classList.toggle('btn');

	// 			let finalMsg = subtitleEl.innerText;
	// 			finalMsg = finalMsg.replace('!', `${plural}!`);
	// 			subtitleEl.innerText = finalMsg;
	// 		}
	// 	});

	if (buttonDoneEl)
		buttonDoneEl.addEventListener('click', async (e) => {
			e.preventDefault();
			const example = exampleEl.value;
			const question = questionEl.value;
			//const answer = inputNoEl.checked ? false : true;
			const language = getLangFromURL();
			const singular = singularEl.value;
			const plural = pluralEl.value;
			const { msg } = createTypeEl.dataset;
			const data = {
				type: { singular, plural },
				language,
				example,
				question,
				answer: true,
			};

			const typeId = await createType(data, { msg });
			const dataFirst = {
				name: example,
				type: typeId,
				question,
				leftNode: null,
				rightNode: null,
			};

			const parameters = {
				language,
				fromOperation: 'firstElement',
				msg,
			};
			console.log(dataFirst);
			console.log(parameters);
			const res = await createElement(dataFirst, parameters);
		});

	if (buttonSendEl)
		buttonSendEl.addEventListener('click', async (e) => {
			e.preventDefault();
			const example = exampleEl.value;
			const question = questionEl.value;
			let { fromElement, typeId, language, msg } = runGameEl.dataset;
			const { fromOperation, fromElementLeft, fromElementRight } = buttonSendEl.dataset;
			console.log('Before replace', msg);
			msg = msg.replace('{{VARIABLE}}', example);
			console.log('After replace', msg);
			const data = {
				name: example,
				type: typeId,
				question,
				leftNode: null,
				rightNode: null,
			};
			const parameters = {
				language,
				fromElement,
				fromOperation,
				fromElementLeft,
				fromElementRight,
				msg,
			};
			const res = await createElement(data, parameters);
		});
}
