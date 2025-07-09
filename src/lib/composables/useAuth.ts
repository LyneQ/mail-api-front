import axios from 'axios';

async function useAuth() {
	try {
		const response = await fetch('http://localhost:1323/api/me', {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401) {
			return false;
		}

		if (response.status >= 200 && response.status < 300) {
			return true;
		} else {
			return false;
		}
	} catch (error: any) {
		if (error.response.status === 401) {
			return false;
		}
		return false;
	}
}

export default useAuth;
