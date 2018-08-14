import { API_KEY } from './apiKey';

function getApiEndpoint(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex = 0,
	maxResults = 10
) {
	return `https://www.googleapis.com/books/v1/volumes?q=${rulesSystem}+campaign${
		searchTerm !== '' ? `+${searchTerm}` : ''
	}&startIndex=${startIndex}&maxResults=${maxResults}&key=${API_KEY}`;
}

export async function search(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex = 0,
	maxResults = 10
) {
	try {
		const response = await fetch(getApiEndpoint(rulesSystem, searchTerm));
		const jsonData = await response.json();

		return jsonData;
	} catch (err) {
		console.log('fetch failed', err);
	}
}

export async function getMoreResults(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex = 0,
	maxResults = 10
) {
	try {
		const response = await fetch(
			getApiEndpoint(rulesSystem, searchTerm, startIndex, maxResults)
		);
		const jsonData = await response.json();

		return jsonData;
	} catch (err) {
		console.log('fetch failed', err);
	}
}
