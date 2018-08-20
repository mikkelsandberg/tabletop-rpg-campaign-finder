import React from 'react';

export default function Book(props) {
	const { book, includeIfExists } = props;

	return (
		<article>
			<h2>
				<a
					href={includeIfExists(book.volumeInfo.canonicalVolumeLink)}
					target="_blank"
					rel="noopener noreferrer"
				>
					{includeIfExists(book.volumeInfo.title)}
					{includeIfExists(book.volumeInfo.subtitle, ': ')}
				</a>
			</h2>
			<p>{includeIfExists(book.volumeInfo.description)}</p>
			<p>
				{book.volumeInfo.categories !== undefined &&
					`Categories:${book.volumeInfo.categories.map(category => category)}`}
			</p>
		</article>
	);
}
