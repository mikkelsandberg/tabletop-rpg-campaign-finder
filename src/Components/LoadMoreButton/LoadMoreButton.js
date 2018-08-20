import React from 'react';

export default function LoadMoreButton(props) {
	const { handleLoadMore } = props;

	return <button onClick={handleLoadMore}>Load More</button>;
}
