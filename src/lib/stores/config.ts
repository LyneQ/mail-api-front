import { readable } from 'svelte/store';

export const config = readable({
	apiUrl: 'http://localhost:1323/api/',
	appName: 'Mail-Api',
	debug: true
});
