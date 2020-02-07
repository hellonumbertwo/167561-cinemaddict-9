import { render, Screens } from "./../utils/index";
import SearchLine from "../components/search-line";
import SearchResults from "../components/search-results";
import MoviesListController from "./movies-list-controller";
import NoSearchResults from "./../components/no-search-results";

export default class SearchController {
  constructor(container, movies, onScreenChange, onDataChange) {
    this._container = container;
    this._movies = movies;
    this._onScreenChange = onScreenChange;
    this._onDataChange = onDataChange;
    this._searchResultMovies = movies;
    this._onChangeResultsSubscriptions = [];
    this._onDataChangeSubscriptions = [];

    this._searchLine = new SearchLine();
    this._searchResults = new SearchResults(this._searchResultMovies.length);
    this._noSearchResults = new NoSearchResults();
  }

  init() {
    render(this._container, this._searchLine.getElement(), `beforeend`);
    render(
      document.querySelector(`.main`),
      this._searchResults.getElement(),
      `beforeend`
    );
    render(
      this._searchResults.getElement(),
      this._noSearchResults.getElement(),
      `beforeend`
    );

    this._moviesListController = new MoviesListController(
      this._searchResults.getElement().querySelector(`.films-list__container`),
      this._searchResultMovies,
      this._onDataChange
    );
    this._moviesListController.init();
    this._onChangeResultsSubscriptions.push(
      this._moviesListController._onListChange.bind(this._moviesListController)
    );
    this._onDataChangeSubscriptions.push(
      this._moviesListController._onMoviesListDataChange.bind(
        this._moviesListController
      )
    );

    this._updateSearchResultsBoard();
    this._setEventListeners();
  }

  show() {
    const node = this._searchResults.getElement();
    if (node.classList.contains(`visually-hidden`)) {
      node.classList.remove(`visually-hidden`);
    }
  }

  hide() {
    const node = this._searchResults.getElement();
    if (!node.classList.contains(`visually-hidden`)) {
      node.classList.add(`visually-hidden`);
    }
  }

  _setEventListeners() {
    this._searchLine
      .getElement()
      .querySelector(`.search__field`)
      .addEventListener(`input`, e => {
        if (e.target.value.length >= 3) {
          this._searchResultMovies = this._movies.filter(({ title }) => {
            const regexp = new RegExp(`${e.target.value}`, `gi`);
            return regexp.test(title);
          });
          this._onChangeResultsSubscriptions.forEach(subscription => {
            if (!(subscription instanceof Function)) {
              return;
            }
            subscription(this._searchResultMovies);
          });
          this._updateSearchResultsBoard();
          this._updateResultsCount();
          this._onScreenChange(Screens.SEARCH);
        }
        if (e.target.value.length === 0) {
          this._searchResultMovies = [];
          this._onScreenChange(Screens.FILMS);
        }
      });

    this._searchLine
      .getElement()
      .querySelector(`.search__reset`)
      .addEventListener(`click`, () => {
        this._onScreenChange(Screens.FILMS);
      });
  }

  _updateResultsCount() {
    this._searchResults
      .getElement()
      .querySelector(
        `.result__count`
      ).innerHTML = `${this._searchResultMovies.length}`;
  }

  _updateSearchResultsBoard() {
    if (this._searchResultMovies.length === 0) {
      this._noSearchResults.getElement().classList.remove(`visually-hidden`);
    } else {
      this._noSearchResults.getElement().classList.add(`visually-hidden`);
    }
  }

  _updateMoviesListData(movies) {
    this._movies = movies;
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._movies);
    });
  }
}
