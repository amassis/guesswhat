/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createType = async (data, parameters) => {
	const options = {
		method: 'POST',
		url: '/api/v1/types',
		data: data,
	};

	try {
		const res = await axios(options);
		if (res.data.status === 'success') {
			showAlert('success', parameters.msg);
			window.setTimeout(() => {
				location.assign(`/game/${data.language}`);
			}, 1500);
			return res.data.data.types._id;
		}
	} catch (err) {
		console.error(err);
		showAlert('error', err.response.data.message, 20);
	}
};
