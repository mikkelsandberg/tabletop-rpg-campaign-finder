import { API_KEY } from './apiKey';

export async function search(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex,
	maxResults
) {
	try {
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${rulesSystem}+campaign${
				searchTerm !== '' ? `+${searchTerm}` : ''
			}&startIndex=${startIndex}&maxResults=${maxResults}&key=${API_KEY}`
		);
		const jsonData = await response.json();

		if (jsonData.items === undefined) {
			throw new Error('no items fetched');
		}

		return jsonData.items;
	} catch (err) {
		console.log('fetch failed', err);
	}
}
