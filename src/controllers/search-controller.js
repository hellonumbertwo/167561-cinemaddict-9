import { render, Screens } from "./../utils/index";
import SearchLine from "../components/search-line";
import SearchResults from "../components/search-results";

export default class SearchController {
  constructor(container, movies, onScreenChange) {
    this._container = container;
    this._movies = movies;
    this._onScreenChange = onScreenChange;

    this._searchLine = new SearchLine();
    this._searchResults = new SearchResults();
  }

  init() {
    render(this._container, this._searchLine.getElement(), `beforeend`);
    render(
      document.querySelector(`.main`),
      this._searchResults.getElement(),
      `beforeend`
    );

    this._setEventListeners();
  }

  show() {
    [
      this._searchResults.getElement()
      // this._container.querySelector(`.films`)
    ].forEach(node => {
      if (node.classList.contains(`visually-hidden`)) {
        node.classList.remove(`visually-hidden`);
      }
    });
  }

  hide() {
    [
      this._searchResults.getElement()
      // this._container.querySelector(`.films`)
    ].forEach(node => {
      if (!node.classList.contains(`visually-hidden`)) {
        node.classList.add(`visually-hidden`);
      }
    });
  }

  _setEventListeners() {
    this._searchLine
      .getElement()
      .querySelector(`.search__field`)
      .addEventListener(`input`, e => {
        if (e.target.value.length >= 3) {
          this._onScreenChange(Screens.SEARCH);
        }
        if (e.target.value.length === 0) {
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
}
