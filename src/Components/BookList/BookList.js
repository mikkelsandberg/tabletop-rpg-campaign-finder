import React from 'react';
import Book from '../Book/Book';

export default function BookList(props) {
	const { books, includeIfExists } = props;

	return (
		books !== null &&
		books.map(book => {
			return (
				<Book key={book.etag} book={book} includeIfExists={includeIfExists} />
			);
		})
	);
}
