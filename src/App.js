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

    this.state = {
      books: null,
      rulesSystem: 'tabletop+rpg',
      searchTerm: '',
      startIndex: 0,
      maxResults: 10,
    };
  }

  componentDidMount() {
    search(
      this.state.rulesSystem,
      this.state.searchTerm,
      this.state.startIndex,
      this.state.maxResults
    ).then(data => {
      this.setState(prevState => ({
        ...this.state,
        books: data,
        startIndex: prevState.startIndex + this.state.maxResults,
      }));
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
    ).then(data => {
      this.setState(prevState => ({
        ...this.state,
        books: data,
      }));
    });
  }

  handleLoadMore() {
    getMoreResults(
      this.state.rulesSystem,
      this.state.searchTerm,
      this.state.startIndex,
      this.state.maxResults
    ).then(data => {
      this.setState(prevState => {
        return {
          ...prevState,
          books: {
            ...prevState.books,
            items: prevState.books.items.concat(data.items),
          },
          startIndex: prevState.startIndex + this.state.maxResults,
        };
      });
    });
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
              <option value="dnd">DnD</option>
            </select>
            <span>campaign, that has</span>
            <input
              type="text"
              onChange={this.handleSearchFieldChange}
              placeholder="keywords"
            />
          </form>

          {this.state.books !== null &&
            this.state.books.items.map((book, id = 0) => {
              return (
                <article key={id}>
                  <h2>{book.volumeInfo.title}</h2>
                  <p>{book.volumeInfo.description}</p>
                  <p>
                    {book.volumeInfo.categories !== undefined &&
                      `Categories:${book.volumeInfo.categories.map(
                        category => category
                      )}`}
                  </p>
                </article>
              );
            })}

          <button onClick={this.handleLoadMore}>Load More</button>
        </section>
      </div>
    );
  }
}

export default App;
