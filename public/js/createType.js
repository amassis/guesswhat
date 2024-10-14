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

		console.log('Will translate types');
		let originalLang = '';
		const type = res.data.data.types;

		console.log('Starting Type');
		console.log(type);

		const langsToCreate = [];
		if (type.language !== 'en_US') {
			langsToCreate.push('en_US');
		} else {
			originalLang = 'en';
		}
		if (type.language !== 'pt_BR') {
			langsToCreate.push('pt_BR');
		} else {
			originalLang = 'pt';
		}
		if (type.language !== 'es_ES') {
			langsToCreate.push('es_ES');
		} else {
			originalLang = 'es';
		}

		langsToCreate.forEach(async (lang) => {
			const url = `/api/v1/types/${type._id}/${originalLang}/${lang}`;
			const optionsXlat = {
				method: 'POST',
				url,
				data: type,
			};
			const resXlat = await axios(optionsXlat);
		});

		if (res.data.status === 'success') {
			showAlert('success', parameters.msg, 2);
			window.setTimeout(() => {
				location.assign(`/game/${data.language}`);
			}, 3000);
			return type._id;
		}
	} catch (err) {
		console.error(err);
		showAlert('error', err.response.data.message, 5);
	}
};
