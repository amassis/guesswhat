/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const updateElement = async (elementId, leftNode, rightNode) => {
	console.log('Here is UPDATE');
	console.log(elementId, leftNode, rightNode);

	// if (leftNode !== null) leftNode = leftNode.toString();
	// if (rightNode) rightNode = rightNode.toString();
	const api = `/api/v1/elements/${elementId}`;
	const data = {
		leftNode,
		rightNode,
	};

	console.log('HERE is UPDATE DATA');
	console.log(data);

	const options = {
		method: 'PATCH',
		url: api,
		data: data,
	};

	try {
		// update element
		const res = await axios(options);
		// successfull
		if (res.data.status === 'success') return true;
		else return false;
	} catch (err) {
		console.error(err);

		showAlert('error', err.response.data.message, 5);
		return false;
	}
};

export const createElement = async (data, parameters = {}) => {
	// save extra attributes and sanitize data object
	const { language, fromElement, fromElementLeft, fromElementRight, fromOperation, msg } = parameters;

	console.log('Here is CREATE');
	console.log(parameters);
	console.log(data);
	const options = {
		method: 'POST',
		url: '/api/v1/elements',
		data: data,
	};

	try {
		// create new element
		const res = await axios(options);

		// successfull
		if (res.data.status === 'success') {
			if (fromOperation !== 'firstElement') {
				const newElementId = res.data.data.elements._id;

				let leftNode, rightNode, newLeftNode, newRightNode;

				if (fromOperation === 'learnLeft') {
					// from Element new leftNode is the new element;
					leftNode = newElementId;
					// from Element rightNode is kept as is;
					rightNode = fromElementRight === 'null' ? null : fromElementRight;
					// new Element leftNode is itself
					newLeftNode = newElementId;
					// new Element rightNode is from Element;
					newRightNode = fromElementLeft === 'null' ? null : fromElement;
				} else {
					// from Element new rightNode is the new element;
					rightNode = newElementId;
					// from Element leftNode is kept as is
					leftNode = fromElementLeft === 'null' ? null : fromElementLeft;
					// new element leftNode is itself ;
					newLeftNode = newElementId;
					// new Element rightNode is fronElement;
					newRightNode = fromElementRight === 'null' ? null : fromElement;
				}

				// Update the from Element binary tree data with a pointer to the new element
				console.log(fromElement);
				console.log('Will update FROM Element', fromElement);
				await updateElement(fromElement, leftNode, rightNode);
				await updateElement(newElementId, newLeftNode, newRightNode);
			}
			showAlert('success', msg, 50);
			window.setTimeout(() => {
				location.assign(`/game/${language}`);
			}, 50000);
		}
	} catch (err) {
		console.error(err);
		showAlert('error', err.response.data.message, 10);
	}
};
