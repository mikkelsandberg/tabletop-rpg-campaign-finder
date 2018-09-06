import { API_KEYS } from './ApiKeys';
import decode from 'decode-html';

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
			}&startIndex=${startIndex}&maxResults=${maxResults / 2}&key=${
				API_KEYS.googleBooks
			}`
		);
		const jsonData = await response.json();

		if (jsonData.items === undefined) {
			throw new Error('no items fetched');
		}

		console.log('google books raw', jsonData.items);

		return jsonData.items;
	} catch (err) {
		console.log('fetch failed', err);
	}
}

async function organizeGoogleBooks(
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

		let googleBooksCollection = [];

		if (queryGoogleBooks !== undefined) {
			googleBooksCollection = await queryGoogleBooks.map(data => {
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
		} else {
			throw new Error('no items to organize');
		}

		console.log('googleBooksCollection', googleBooksCollection);

		return googleBooksCollection;
	} catch (err) {
		console.log('organize failed', err);
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
				maxResults / 2 > 25 ? 25 : maxResults / 2
			}&categoryId=3920`
		);
		const jsonData = await response.json();

		if (jsonData.items === undefined) {
			throw new Error('no items fetched');
		}

		console.log('walmart books raw', jsonData.items);

		return jsonData.items;
	} catch (err) {
		console.log('fetch failed', err);
	}
}

async function organizeWalmart(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex,
	maxResults
) {
	try {
		const queryWalmart = await searchWalmart(
			rulesSystem,
			searchTerm,
			startIndex,
			maxResults
		);

		let walmartCollection = [];

		if (queryWalmart !== undefined) {
			walmartCollection = await queryWalmart.map(data => {
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
		} else {
			throw new Error('no items to organize');
		}

		console.log('walmartCollection', walmartCollection);

		return walmartCollection;
	} catch (err) {
		console.log('organize failed', err);
	}
}

export async function getBooks(
	rulesSystem = 'tabletop+rpg',
	searchTerm = '',
	startIndex,
	maxResults
) {
	try {
		console.log(
			'organizeGoogleBooks',
			await organizeGoogleBooks(rulesSystem, searchTerm, startIndex, maxResults)
		);

		console.log(
			'organizeWalmart',
			await organizeWalmart(rulesSystem, searchTerm, startIndex, maxResults)
		);

		const collectAll = [];

		// for (let i = 0; i < maxResults; i++) {
		// 	if (organizeGoogleBooks[i] !== undefined) {
		// 		collectAll.push(organizeGoogleBooks[i]);
		// 	}
		// 	if (organizeWalmart[i] !== undefined) {
		// 		collectAll.push(organizeWalmart[i]);
		// 	}
		// }

		// if (collectAll.length < maxResults) {
		// 	for (let i = maxResults; i < maxResults; i++) {
		// 		if (
		// 			organizeGoogleBooks[i] !== undefined &&
		// 			collectAll.length < maxResults
		// 		) {
		// 			collectAll.push(organizeGoogleBooks[i]);
		// 		}
		// 		if (
		// 			organizeWalmart[i] !== undefined &&
		// 			collectAll.length < maxResults
		// 		) {
		// 			collectAll.push(organizeWalmart[i]);
		// 		}
		// 	}
		// }

		return collectAll;
	} catch (err) {
		console.log('fetch failed', err);
	}
}
