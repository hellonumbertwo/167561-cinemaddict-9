import {
  render,
  Screens,
  Positioning,
  removePunctuation
} from "./../utils/index";
import SearchLine from "../components/search-line";
import SearchResults from "../components/search-results";
import MoviesListController from "./movies-list-controller";

/**
 * @module
 * @class
 * @name SearchController
 * @classdesc контроллер дя управления навигацией – отрисовка, переключение экранов статистики и списка, выбор фильтров.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Array} movies – список фильмов.
 * @param {Func} onScreenChange - обратотчик,который вызывается при переключении на экран статистики и обратно.
 * @param {Func} onDataChange – обработчик, который вызывается при изменении данных в списке фильмов.
 */
export default class SearchController {
  constructor(container, movies, onScreenChange, onDataChange, onShowDetails) {
    this._container = container;
    this._movies = movies;
    this._onScreenChange = onScreenChange;
    this._onDataChange = onDataChange;
    this._onShowDetails = onShowDetails;
    this._request = null;

    this._searchLine = new SearchLine();
    this._searchResults = new SearchResults(this._searchResultMovies.length);
  }

  get _searchResultMovies() {
    if (!this._request) {
      return [];
    }
    const regexp = new RegExp(`${removePunctuation(this._request)}`, `gi`);
    return this._movies.filter(({ title }) => {
      return regexp.test(removePunctuation(title));
    });
  }

  /**
   * @method
   * @memberof SearchController
   * @public
   */
  init() {
    this._onChangeResultsSubscriptions = [];
    this._onDataChangeSubscriptions = [];

    render(
      this._container,
      this._searchLine.getElement(),
      Positioning.BEFOREEND
    );
    render(
      document.querySelector(`.main`),
      this._searchResults.getElement(),
      Positioning.BEFOREEND
    );

    this._moviesListController = new MoviesListController(
      this._searchResults.getElement().querySelector(`.films-list__container`),
      this._searchResultMovies,
      this._onDataChange,
      this._onShowDetails
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

    this._setEventListeners();
  }

  /**
   * показать результаты поиска в DOM
   * @method
   * @memberof SearchController
   * @public
   */
  show() {
    const node = this._searchResults.getElement();
    if (node.classList.contains(`visually-hidden`)) {
      node.classList.remove(`visually-hidden`);
    }
  }

  /**
   * скрыть результаты поиска в DOM
   * @method
   * @memberof SearchController
   * @public
   */
  hide() {
    const node = this._searchResults.getElement();
    if (!node.classList.contains(`visually-hidden`)) {
      node.classList.add(`visually-hidden`);
    }
  }

  /**
   * установить обработчики для событий: `начать поиск от трёх символов`, `сбросить результаты поиска`
   * @method
   * @memberof SearchController
   * @private
   */
  _setEventListeners() {
    this._searchLine
      .getElement()
      .querySelector(`.search__field`)
      .addEventListener(`input`, e => {
        if (e.target.value.length >= 3) {
          this._request = e.target.value;

          this._onChangeResultsSubscriptions.forEach(subscription => {
            if (!(subscription instanceof Function)) {
              return;
            }
            subscription(this._searchResultMovies);
          });
          this._updateResultsCount();
          this._onScreenChange(Screens.SEARCH);
        }
        if (e.target.value.length === 0) {
          this._request = null;
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

  /**
   * обновить счётчик результатов в DOM
   * @method
   * @memberof SearchController
   * @private
   */
  _updateResultsCount() {
    this._searchResults
      .getElement()
      .querySelector(
        `.result__count`
      ).innerHTML = `${this._searchResultMovies.length}`;
  }

  /**
   * обносить список фильмов на актуальный, если данные изсенились.
   * @method
   * @memberof SearchController
   * @param {Array} movies – актуальный список фильмов.
   * @private
   */
  _updateMoviesListData(movies) {
    this._movies = movies;

    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._searchResultMovies);
    });
  }
}
