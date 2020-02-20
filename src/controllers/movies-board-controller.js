import { render, getMoviesDataByFilters, Positioning, Filters } from "../utils";
import Content from "../components/content";
import Sorting from "../components/sorting";
import ExtraMoviesList from "../components/extra-movies-list";
import MoviesListController from "./movies-list-controller";
import MovieDetailsController from "./movie-details-controller";

/**
 * @module
 * @class
 * @name MoviesBoardController
 * @classdesc контроллер для управления доской со списком фильмов: отрисовка, фильтрация, сортировка, обновление данных.
 * @param {String} container – id родительского контенйера для рендеринга.
 * @param {Object} movies – список фильмов.
 * @param {Func} onDataChange – обработчик, который вызывается при изменении данных в списке фильмов.
 */

export default class MoviesBoardController {
  constructor(container, movies, onDataChange) {
    this._container = container;
    this._movies = movies;
    this._onDataChange = onDataChange;
    this._currentFilter = Filters.ALL;

    this._content = new Content();
    this._sorting = new Sorting();
    this._topRatedContainer = new ExtraMoviesList(`Top rated`);
    this._mostCommentedContainer = new ExtraMoviesList(`Most commented`);

    this._onShowDetails = this._onShowDetails.bind(this);
  }

  get _mostCommentedMovies() {
    return [...this._movies]
      .filter(({ comments }) => !!comments && comments.length > 0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);
  }

  get _topRatedMovies() {
    return [...this._movies]
      .filter(({ rate }) => rate > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);
  }

  /**
   * @method
   * @memberof MoviesBoardController
   * @public
   */
  init() {
    this._onSortingChangeSubscriptions = [];
    this._onDataChangeSubscriptions = [];
    this._onTopRatedDataChangeSubscriptions = [];
    this._onMostCommentedDataChangeSubscriptions = [];
    this._onFilterChangeSubscriptions = [];
    this._onDetailsDataChangeSubscriptions = [];

    [this._sorting, this._content].forEach(component =>
      render(this._container, component.getElement(), Positioning.BEFOREEND)
    );
    [this._mostCommentedContainer, this._topRatedContainer].forEach(component =>
      render(
        this._content.getElement(),
        component.getElement(),
        Positioning.BEFOREEND
      )
    );

    this._initCommonList();
    this._initMostCommentesList();
    this._initTopRatedList();
    this._initMovieDetails();

    this._updateExtraListsBoardInDOM();
    this._setSortingEventListeners();
  }

  /**
   * показать доску со списком фильмов
   * @method
   * @memberof MoviesBoardController
   * @public
   */
  show() {
    [
      this._sorting.getElement(),
      this._container.querySelector(`#main-films-list`)
    ].forEach(node => {
      if (node.classList.contains(`visually-hidden`)) {
        node.classList.remove(`visually-hidden`);
      }
    });
  }

  /**
   * скрыть доску со списком фильмов
   * @method
   * @memberof MoviesBoardController
   * @public
   */
  hide() {
    [
      this._sorting.getElement(),
      this._container.querySelector(`#main-films-list`)
    ].forEach(node => {
      if (!node.classList.contains(`visually-hidden`)) {
        node.classList.add(`visually-hidden`);
      }
    });
  }

  /**
   * инициализировать контроллер для общего списка фильмов, который будет управлять его отрисовкой и изменением данных
   * @method
   * @memberof MoviesBoardController
   * @private
   */
  _initCommonList() {
    this._moviesListController = new MoviesListController(
      this._content.getElement().querySelector(`.films-list__container`),
      this._movies,
      this._onDataChange,
      this._onShowDetails
    );
    this._moviesListController.init();
    this._onSortingChangeSubscriptions.push(
      this._moviesListController._onHandleSorting.bind(
        this._moviesListController
      )
    );
    this._onDataChangeSubscriptions.push(
      this._moviesListController._onMoviesListDataChange.bind(
        this._moviesListController
      )
    );
    this._onFilterChangeSubscriptions.push(
      this._moviesListController._onListChange.bind(this._moviesListController)
    );
  }

  /**
   * инициализировать контроллер для 'Most Commented' фильмов, который будет управлять его отрисовкой и изменением данных
   * @method
   * @memberof MoviesBoardController
   * @private
   */
  _initMostCommentesList() {
    this._mostCommentedMoviesListController = new MoviesListController(
      this._mostCommentedContainer
        .getElement()
        .querySelector(`.films-list__container`),
      this._mostCommentedMovies,
      this._onDataChange,
      this._onShowDetails
    );
    this._mostCommentedMoviesListController.init();
    this._onMostCommentedDataChangeSubscriptions.push(
      this._mostCommentedMoviesListController._onListChange.bind(
        this._mostCommentedMoviesListController
      )
    );
  }

  /**
   * инициализировать контроллер для 'Top Rated' фильмов, который будет управлять его отрисовкой и изменением данных
   * @method
   * @memberof MoviesBoardController
   * @private
   */
  _initTopRatedList() {
    this._topRatedMoviesListController = new MoviesListController(
      this._topRatedContainer
        .getElement()
        .querySelector(`.films-list__container`),
      this._topRatedMovies,
      this._onDataChange,
      this._onShowDetails
    );
    this._topRatedMoviesListController.init();
    this._onTopRatedDataChangeSubscriptions.push(
      this._topRatedMoviesListController._onListChange.bind(
        this._topRatedMoviesListController
      )
    );
  }

  /**
   * инициализировать контроллер для popup с полезной информацией, который будет управлять его отрисовкой и изменением данных
   * @method
   * @memberof MoviesBoardController
   * @private
   */
  _initMovieDetails() {
    this._movieDetailsController = new MovieDetailsController(
      document.getElementById(`main`),
      this._onDataChange
    );

    this._onDetailsDataChangeSubscriptions.push(
      this._movieDetailsController._updateMovieData.bind(
        this._movieDetailsController
      )
    );
  }

  /**
   * установить событие для панели с сортировками – сортировать список при клике на тип сортировки
   * @method
   * @memberof MoviesBoardController
   * @private
   */
  _setSortingEventListeners() {
    this._sorting.getElement().addEventListener(`click`, e => {
      this._sortMoviesByLinkClick(e);
    });
  }

  /**
   * отсортировать карточки фильмов по клику на ссылку в панели sort controls, обновить панель сортировки в DOM
   * @method
   * @memberof MoviesBoardController
   * @private
   * @param {event} e – событие `click`
   */
  _sortMoviesByLinkClick(e) {
    e.preventDefault();

    if (e.target.tagName !== `A`) {
      return;
    }

    this._onSortingChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      this._sorting
        .getElement()
        .querySelectorAll(`.sort__button`)
        .forEach(control => {
          if (
            control !== e.target &&
            control.classList.contains(`sort__button--active`)
          ) {
            control.classList.remove(`sort__button--active`);
          }
          if (
            control === e.target &&
            !control.classList.contains(`sort__button--active`)
          ) {
            control.classList.add(`sort__button--active`);
          }
        });
      subscription(e.target.dataset.sortType);
    });
  }

  /**
   * отфильтровать список фильмов
   * @method
   * @memberof MoviesBoardController
   * @private
   * @param {String} filter – тип фильтра
   */
  _onFilterChange(filter) {
    this._currentFilter = filter;
    this._onFilterChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._getMoviesByFilter());
    });
  }

  /**
   * обновить список фильмов до актуального
   * @method
   * @memberof MoviesBoardController
   * @private
   * @param {Array} movies – список фильмов с актуальными данными
   */
  _updateMoviesListData(movies) {
    this._movies = movies;

    this._onDetailsDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(movies);
    });

    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._getMoviesByFilter());
    });

    this._onMostCommentedDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._mostCommentedMovies);
    });

    this._onTopRatedDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._topRatedMovies);
    });

    this._updateExtraListsBoardInDOM();
  }

  /**
   * Обновить панель с extra списками: `Top Rated` и `Most Commented`
   * @method
   * @memberof MoviesBoardController
   * @private
   * @param {Array} movies – список фильмов с актуальными данными
   */
  _updateExtraListsBoardInDOM() {
    if (this._topRatedMovies.length === 0) {
      this._topRatedContainer.getElement().classList.add(`visually-hidden`);
    } else {
      this._topRatedContainer.getElement().classList.remove(`visually-hidden`);
    }
    if (this._mostCommentedMovies.length === 0) {
      this._mostCommentedContainer
        .getElement()
        .classList.add(`visually-hidden`);
    } else {
      this._mostCommentedContainer
        .getElement()
        .classList.remove(`visually-hidden`);
    }
  }

  /**
   * показать popup с подробной информацией по выбранному фильму
   * @method
   * @memberof MoviesBoardController
   * @private
   * @param {Object} movie – объект фильма
   */
  _onShowDetails({ id }) {
    const currentMovie = this._movies.find(movie => movie.id === id);
    this._movieDetailsController.show(currentMovie);
  }

  /**
   * получить отфильтрованный список фильмов
   * @method
   * @memberof MoviesBoardController
   * @private
   * @return {Array}
   */
  _getMoviesByFilter() {
    return getMoviesDataByFilters(this._movies)[this._currentFilter];
  }
}
