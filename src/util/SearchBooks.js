import decode from 'decode-html';
import { API_KEYS } from './ApiKeys';

async function searchGoogleBooks(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex,
	maxResults
) {
	try {
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${rulesSystem}+campaign${
				searchTerm !== '' ? `+${searchTerm}` : ''
			}&startIndex=${startIndex}&maxResults=${maxResults}&key=${
				API_KEYS.googleBooks
			}`
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

async function searchWalmart(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex,
	maxResults
) {
	try {
		const response = await fetch(
			`https://cors-anywhere.herokuapp.com/http://api.walmartlabs.com/v1/search?apiKey=${
				API_KEYS.walmart
			}&query=${rulesSystem}+campaign${
				searchTerm !== '' ? `+${searchTerm}` : ''
			}&start=${startIndex + 1}&numItems=${
				maxResults > 25 ? 25 : maxResults
			}&categoryId=3920`
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

export async function getBooks(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex,
	maxResults
) {
	try {
		const queryGoogleBooks = await searchGoogleBooks(
			rulesSystem,
			searchTerm,
			startIndex,
			maxResults
		);
		const collectGoogleBooks = await queryGoogleBooks;
		let organizeGoogleBooks = [];
		if (collectGoogleBooks !== undefined) {
			organizeGoogleBooks = await collectGoogleBooks.map(data => {
				return {
					id: data.etag,
					title: data.volumeInfo.title,
					subtitle: data.volumeInfo.subtitle,
					description:
						data.volumeInfo.description !== undefined
							? decode(data.volumeInfo.description)
							: undefined,
					link: data.volumeInfo.canonicalVolumeLink,
					categories: data.volumeInfo.categories,
				};
			});
		}

		const queryWalmart = await searchWalmart(
			rulesSystem,
			searchTerm,
			startIndex,
			maxResults
		);
		const collectWalmart = await queryWalmart;
		let organizeWalmart = [];
		if (collectWalmart !== undefined) {
			organizeWalmart = await collectWalmart.map(data => {
				return {
					id: data.itemId,
					title: data.name,
					subtitle: undefined,
					description:
						data.longDescription !== undefined
							? decode(data.longDescription)
							: undefined,
					link: data.productUrl,
					categories: data.categoryPath.split('/'),
				};
			});
		}

		const collectAll = [];

		for (let i = 0; i < Math.floor(maxResults / 2); i++) {
			if (organizeGoogleBooks[i] !== undefined) {
				collectAll.push(organizeGoogleBooks[i]);
			}
			if (organizeWalmart[i] !== undefined) {
				collectAll.push(organizeWalmart[i]);
			}
		}

		if (collectAll.length < maxResults) {
			for (let i = Math.floor(maxResults / 2); i < maxResults; i++) {
				if (
					organizeGoogleBooks[i] !== undefined &&
					collectAll.length < maxResults
				) {
					collectAll.push(organizeGoogleBooks[i]);
				}
				if (
					organizeWalmart[i] !== undefined &&
					collectAll.length < maxResults
				) {
					collectAll.push(organizeWalmart[i]);
				}
			}
		}

		return collectAll;
	} catch (err) {
		console.log('fetch failed', err);
	}
}
