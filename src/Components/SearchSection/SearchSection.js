import React from 'react';
import RulesSystems from '../../util/RulesSystems';
import './SearchSection.css';

export default function SearchSection(props) {
	const {
		handleFormSubmission,
		handleFieldChange,
		rulesSystem,
		searchTerm,
		maxResults,
		books,
		resetSearch,
	} = props;

	const maxResultsOptions = [];
	for (let i = 10; i <= 50; i += 10) {
		maxResultsOptions.push(
			<option key={i} value={i}>
				{i}
			</option>
		);
	}

	return (
		<form className="searchSection" onSubmit={handleFormSubmission}>
			<section className="searchSection__inputFields">
				<select
					id="rules-system-select"
					className="searchSection__rulesSystem"
					onChange={e => handleFieldChange('rulesSystem', e.target.value)}
					value={rulesSystem}
				>
					{RulesSystems.map(rule => {
						return (
							<option key={rule.id} value={rule.value}>
								{rule.displayName}
							</option>
						);
					})}
				</select>
				<span className="searchSection__desc">campaign, that has</span>
				<input
					className="searchSection__keywords"
					type="text"
					onChange={e => handleFieldChange('searchTerm', e.target.value)}
					placeholder="keywords"
					value={searchTerm}
				/>
				<select
					id="maxResults"
					name="maxResults"
					value={parseInt(maxResults, 10)}
					onChange={e =>
						handleFieldChange('maxResults', parseInt(e.target.value, 10))
					}
				>
					{maxResultsOptions}
				</select>
			</section>
			<section className="searchSection__buttonWrapper">
				{books !== null && (
					<button
						className="searchSection__button searchSection__button--reset"
						type="reset"
						onClick={resetSearch}
					>
						Reset
					</button>
				)}
				<button
					className="searchSection__button searchSection__button--submit"
					type="submit"
					onClick={handleFormSubmission}
				>
					Search
				</button>
			</section>
		</form>
	);
}
