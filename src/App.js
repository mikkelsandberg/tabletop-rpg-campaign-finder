import React, { Component } from 'react';
import { search, getMoreResults } from './util/GoogleBooks';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
    this.handleRulesSelectorChange = this.handleRulesSelectorChange.bind(this);
    this.handleFormSubmission = this.handleFormSubmission.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.includeIfExists = this.includeIfExists.bind(this);

    this.state = {
      books: null,
      rulesSystem: 'tabletop+rpg',
      searchTerm: '',
      startIndex: 0,
      maxResults: 10,
      moreResultsAvailable: true,
    };
  }

  componentDidMount() {
    search(
      this.state.rulesSystem,
      this.state.searchTerm,
      this.state.startIndex,
      this.state.maxResults
    )
      .then(data => {
        this.setState(prevState => ({
          ...this.state,
          books: data,
          startIndex: prevState.startIndex + this.state.maxResults,
        }));
      })
      .then(() => {
        this.setState({
          ...this.state,
          moreResultsAvailable:
            this.state.books.items.length % this.state.maxResults === 0,
        });
      });
  }

  handleSearchFieldChange(e) {
    this.setState({
      ...this.state,
      searchTerm: e.target.value,
    });
  }

  handleRulesSelectorChange(e) {
    this.setState({
      ...this.state,
      rulesSystem: e.target.value,
    });
  }

  handleFormSubmission(e) {
    e.preventDefault();

    search(
      this.state.rulesSystem,
      this.state.searchTerm,
      this.state.startIndex,
      this.state.maxResults
    )
      .then(data => {
        this.setState(prevState => ({
          ...this.state,
          books: data,
        }));
      })
      .then(() => {
        this.setState({
          ...this.state,
          moreResultsAvailable:
            this.state.books.items.length % this.state.maxResults === 0,
        });
      });
  }

  handleLoadMore() {
    getMoreResults(
      this.state.rulesSystem,
      this.state.searchTerm,
      this.state.startIndex,
      this.state.maxResults
    )
      .then(data => {
        this.setState(prevState => ({
          ...prevState,
          books: {
            ...prevState.books,
            items: prevState.books.items.concat(data.items),
          },
          startIndex: prevState.startIndex + this.state.maxResults,
        }));
      })
      .then(() => {
        this.setState({
          ...this.state,
          moreResultsAvailable:
            this.state.books.items.length % this.state.maxResults === 0,
        });
      });
  }

  includeIfExists(data, contentBefore, contentAfter) {
    return data !== undefined && data !== '' && data !== null
      ? `${contentBefore !== undefined ? `${contentBefore}` : ''}${data}${
          contentAfter !== undefined ? `${contentAfter}` : ''
        }`
      : null;
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <h1 className="app__header__text">Tabletop RPG Campaign Finder</h1>
        </header>
        <section className="app__body">
          <form onSubmit={this.handleFormSubmission}>
            <select
              id="rules-system-select"
              onChange={this.handleRulesSelectorChange}
            >
              <option value="tabletop+rpg">Tabletop RPG</option>
              <option value="dnd+rpg">DnD</option>
              <option value="pathfinder+rpg">Pathfinder</option>
            </select>
            <span>campaign, that has</span>
            <input
              type="text"
              onChange={this.handleSearchFieldChange}
              placeholder="keywords"
            />
          </form>

          {this.state.books !== null &&
            this.state.books.items.map(book => {
              return (
                <article key={book.etag}>
                  <h2>
                    <a
                      href={this.includeIfExists(
                        book.volumeInfo.canonicalVolumeLink
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.includeIfExists(book.volumeInfo.title)}
                      {this.includeIfExists(book.volumeInfo.subtitle, ': ')}
                    </a>
                  </h2>
                  <p>{this.includeIfExists(book.volumeInfo.description)}</p>
                  <p>
                    {book.volumeInfo.categories !== undefined &&
                      `Categories:${book.volumeInfo.categories.map(
                        category => category
                      )}`}
                  </p>
                </article>
              );
            })}

          <button
            onClick={this.handleLoadMore}
            disabled={!this.state.moreResultsAvailable}
          >
            Load More
          </button>
        </section>
      </div>
    );
  }
}

export default App;
