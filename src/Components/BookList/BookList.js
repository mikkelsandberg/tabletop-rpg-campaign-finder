import React from 'react';
import Book from '../Book/Book';

export default function BookList(props) {
	const { bookList, includeIfExists } = props;

	return (
		bookList !== null &&
		bookList.map(book => {
			return (
				<Book key={book.id} book={book} includeIfExists={includeIfExists} />
			);
		})
	);
}
