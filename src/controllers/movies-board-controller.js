import { render, getMoviesDataByFilters, Positioning } from "../utils";
import Content from "../components/content";
import Sorting from "../components/sorting";
import ExtraMoviesList from "../components/extra-movies-list";
import MoviesListController from "./movies-list-controller";

export default class MoviesBoardController {
  constructor(container, movies, onDataChange) {
    this._container = container;
    this._movies = movies;
    this._onDataChange = onDataChange;

    this._content = new Content();
    this._sorting = new Sorting();
    this._topRatedContainer = new ExtraMoviesList(`Top rated`);
    this._mostCommentedContainer = new ExtraMoviesList(`Most commented`);

    this._onSortingChangeSubscriptions = [];
    this._onDataChangeSubscriptions = [];
    this._onTopRatedDataChangeSubscriptions = [];
    this._onMostCommentedDataChangeSubscriptions = [];
    this._onFilterChangeSubscriptions = [];
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

  init() {
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
    this._updateExtraListsBoard();
    this._initCommonList();
    this._initMostCommentesList();
    this._initTopRatedList();
    this._setSortingEventListeners();
  }

  _initCommonList() {
    this._moviesListController = new MoviesListController(
      this._content.getElement().querySelector(`.films-list__container`),
      this._movies,
      this._onDataChange
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

  _initMostCommentesList() {
    this._mostCommentedMoviesListController = new MoviesListController(
      this._mostCommentedContainer
        .getElement()
        .querySelector(`.films-list__container`),
      this._mostCommentedMovies,
      this._onDataChange
    );
    this._mostCommentedMoviesListController.init();
    this._onMostCommentedDataChangeSubscriptions.push(
      this._mostCommentedMoviesListController._onListChange.bind(
        this._mostCommentedMoviesListController
      )
    );
  }

  _initTopRatedList() {
    this._topRatedMoviesListController = new MoviesListController(
      this._topRatedContainer
        .getElement()
        .querySelector(`.films-list__container`),
      this._topRatedMovies,
      this._onDataChange
    );
    this._topRatedMoviesListController.init();
    this._onTopRatedDataChangeSubscriptions.push(
      this._topRatedMoviesListController._onListChange.bind(
        this._topRatedMoviesListController
      )
    );
  }

  _setSortingEventListeners() {
    this._sorting.getElement().addEventListener(`click`, e => {
      this._sortMoviesByLinkClick(e);
    });
  }

  /**
   * отсортировать preview-карточки фильмов по клику на ссылку в панели sort controls
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

  _onFilterChange(filter) {
    const filteredMovies = getMoviesDataByFilters(this._movies)[filter];
    this._onFilterChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(filteredMovies);
    });
  }

  _updateMoviesListData(movies) {
    this._movies = movies;
    this._updateExtraListsBoard();
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._movies);
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
  }

  _updateExtraListsBoard() {
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
}
