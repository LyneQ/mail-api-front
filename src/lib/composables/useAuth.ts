import axios from 'axios';
import { config } from '$lib/stores/config';
import { get } from 'svelte/store';

axios.defaults.withCredentials = true;

async function useAuth() {
	try {
		const { apiUrl } = get(config);

		// Use axios instead of fetch to handle self-signed certificates
		const response = await axios.get(apiUrl + 'me');

		if (response.status >= 200 && response.status < 300) {
			return true;
		} else {
			return false;
		}
	} catch (error: any) {
		if (error.response && error.response.status === 401) {
			return false;
		}
		return false;
	}
}

export default useAuth;
