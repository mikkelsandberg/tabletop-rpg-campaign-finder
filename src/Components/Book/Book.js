import React from 'react';
import Parser from 'html-react-parser';

export default function Book(props) {
	const { book, includeIfExists } = props;

	return (
		<article>
			<h2>
				<a
					href={includeIfExists(book.link)}
					target="_blank"
					rel="noopener noreferrer"
				>
					{includeIfExists(book.title)}
					{includeIfExists(book.subtitle, ': ')}
				</a>
			</h2>
			{book.description !== undefined && (
				<p>{Parser(includeIfExists(book.description))}</p>
			)}
			{book.categories !== undefined && (
				<p>
					{`Categories: `}
					{book.categories.map(category => {
						return <span>{`${category}`}</span>;
					})}
				</p>
			)}
		</article>
	);
}
