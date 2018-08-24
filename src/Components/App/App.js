import React, { Component } from 'react';
import { getBooks } from '../../util/SearchBooks';
import SearchSection from '../SearchSection/SearchSection';
import BookList from '../BookList/BookList';
import LoadMoreButton from '../LoadMoreButton/LoadMoreButton';
import './reset.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmission = this.handleFormSubmission.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.includeIfExists = this.includeIfExists.bind(this);

    this.state = {
      books: null,
      rulesSystem: 'tabletop+rpg',
      searchTerm: '',
      startIndex: 0,
      maxResults: 10,
      moreResultsAvailable: false,
      error: false,
      loading: false,
    };
  }

  handleFieldChange(state, value) {
    this.setState({
      [state]: value,
    });
  }

  handleFormSubmission(e) {
    e.preventDefault();

    this.setState(
      {
        books: null,
        startIndex: 0,
        loading: true,
      },
      () => {
        getBooks(
          this.state.rulesSystem,
          this.state.searchTerm,
          this.state.startIndex,
          this.state.maxResults
        )
          .then(data => {
            if (data === undefined) {
              this.setState({
                error: true,
                moreResultsAvailable: false,
              });
            } else {
              this.setState({
                books: data,
                startIndex: this.state.startIndex + this.state.maxResults,
                error: false,
                loading: false,
              });
            }
          })
          .then(() => {
            if (this.state.books !== null) {
              this.setState({
                moreResultsAvailable:
                  this.state.books.length % this.state.maxResults === 0,
              });
            }
            return;
          });
      }
    );
  }

  handleLoadMore() {
    getBooks(
      this.state.rulesSystem,
      this.state.searchTerm,
      this.state.startIndex,
      this.state.maxResults
    )
      .then(data => {
        this.setState({
          books: this.state.books.concat(data),
          startIndex: this.state.startIndex + this.state.maxResults,
        });
      })
      .then(() => {
        this.setState({
          moreResultsAvailable:
            this.state.books.length % this.state.maxResults === 0,
        });
      });
  }

  resetSearch(e) {
    e.preventDefault();

    this.setState(
      {
        books: null,
        rulesSystem: 'tabletop+rpg',
        searchTerm: '',
        startIndex: 0,
        maxResults: 10,
        loading: true,
      },
      () => {
        getBooks(
          this.state.rulesSystem,
          this.state.searchTerm,
          this.state.startIndex,
          this.state.maxResults
        )
          .then(data => {
            this.setState({
              books: data,
              startIndex: this.state.startIndex + this.state.maxResults,
              loading: false,
            });
          })
          .then(() => {
            this.setState({
              moreResultsAvailable:
                this.state.books.length % this.state.maxResults === 0,
            });
          });
      }
    );
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
          <SearchSection
            handleFormSubmission={this.handleFormSubmission}
            handleFieldChange={this.handleFieldChange}
            rulesSystem={this.state.rulesSystem}
            searchTerm={this.state.searchTerm}
            maxResults={this.state.maxResults}
            books={this.state.books}
            resetSearch={this.resetSearch}
          />
        </header>
        <section className="app__body">
          <section className="app__body__results">
            {this.state.books === null ? (
              this.state.loading ? (
                <section className="app__body__loading">
                  <h2 className="app__body__loading__text">Loading&hellip;</h2>
                </section>
              ) : this.state.error ? (
                <section className="app__body__error">
                  <h2 className="app__body__error__text">
                    Uh oh! Looks like there was an error. Please try a different
                    search.
                  </h2>
                </section>
              ) : (
                <section className="app__body__blank">
                  <h2 className="app__body__blank__text">
                    Enter some search terms and hit the "search" button.
                  </h2>
                </section>
              )
            ) : (
              <BookList
                books={this.state.books}
                includeIfExists={this.includeIfExists}
              />
            )}
          </section>
        </section>
        <footer className="app__footer">
          {this.state.moreResultsAvailable &&
            !this.state.error && (
              <LoadMoreButton handleLoadMore={this.handleLoadMore} />
            )}
        </footer>
      </div>
    );
  }
}

export default App;
