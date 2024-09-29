import axios from 'axios';
import { showAlert } from './alerts';

// export const loadHome = async (data) => {
// 	const api = '/api/v1/types';
// 	const options = {
// 		method: 'GET',
// 		url: `/${api}`,
// 	};
// 	try {
// 		const res = await axios(options);
// 		if (res.data.status === 'success') {
// 			//showAlert('success', message);
// 			// window.setTimeout(() => {
// 			// 	location.assign('/me');
// 			// }, 1500);
// 		}
// 	} catch (err) {
// 		console.error(err);
// 		showAlert('error', err.response.data.message);
// 	}
// };
