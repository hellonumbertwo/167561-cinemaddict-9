import { render } from "../utils";
import Content from "../components/content";
import FiltersPanel from "../components/filters-panel";
import Sorting from "../components/sorting";
import ExtraMoviesList from "../components/extra-movies-list";
import Statistics from "./../components/statistics";
import MoviesListController from "./movies-list-controller";

export default class PageController {
  constructor(container, movies, filters, statistics) {
    this._container = container;
    this._movies = movies;
    this._statistics = statistics;
    this._onDataChange = this._onDataChange.bind(this);

    this._content = new Content();
    this._filtersPanel = new FiltersPanel(filters);
    this._sorting = new Sorting();
    this._topRatedContainer = new ExtraMoviesList(`Top rated`);
    this._mostCommentedContainer = new ExtraMoviesList(`Most commented`);
    this._statistics = new Statistics(statistics);

    this._moviesListController = new MoviesListController(
      this._content.getElement().querySelector(`.films-list__container`),
      this._movies,
      this._onDataChange
    );
    this._topRatedMoviesListController = new MoviesListController(
      this._topRatedContainer
        .getElement()
        .querySelector(`.films-list__container`),
      this._topRatedMovies,
      this._onDataChange
    );
    this._mostCommentedMoviesListController = new MoviesListController(
      this._mostCommentedContainer
        .getElement()
        .querySelector(`.films-list__container`),
      this._mostCommentedMovies,
      this._onDataChange
    );
    this._onSortingChangeSubscriptions = [];
    this._onDataChangeSubscriptions = [];
  }

  get _mostCommentedMovies() {
    return [...this._movies]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);
  }

  get _topRatedMovies() {
    return [...this._movies].sort((a, b) => b.rate - a.rate).slice(0, 2);
  }

  init() {
    [
      // this._statistics,
      // this._filtersPanel,
      this._sorting,
      this._content
    ].forEach(component =>
      render(this._container, component.getElement(), `beforeend`)
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

    [this._mostCommentedContainer, this._topRatedContainer].forEach(component =>
      render(this._content.getElement(), component.getElement(), `beforeend`)
    );

    this._topRatedMoviesListController.init();
    this._onDataChangeSubscriptions.push(
      this._topRatedMoviesListController._onMoviesListDataChange.bind(
        this._topRatedMoviesListController
      )
    );

    this._mostCommentedMoviesListController.init();
    this._onDataChangeSubscriptions.push(
      this._mostCommentedMoviesListController._onMoviesListDataChange.bind(
        this._mostCommentedMoviesListController
      )
    );

    this._setSortingEventListeners();
  }

  _setSortingEventListeners() {
    this._sorting.getElement().addEventListener(`click`, e => {
      this._sortMoviesByLinkClick(e);
    });
  }

  _renderExtraMovies() {
    [this._topRatedMoviesList, this._mostCommentedMoviesList].forEach(
      component => {
        render(this._content.getElement(), component.getElement(), `beforeend`);
      }
    );

    this._topRatedMovies.forEach(movie => {
      this._initMovieController(
        this._topRatedMoviesList
          .getElement()
          .querySelector(`.films-list__container`),
        movie
      );
    });

    this._mostCommentedMovies.forEach(movie => {
      this._initMovieController(
        this._mostCommentedMoviesList
          .getElement()
          .querySelector(`.films-list__container`),
        movie
      );
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

  _onDataChange(updatedMovie) {
    this._movies[updatedMovie.id] = { ...updatedMovie };
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._movies);
    });
  }

  // _onDataChange(newMovieData, movieId, updateMovie) {
  //   this._mutateMovieDataInInitialList(this._movies[movieId], newMovieData);
  //   updateMovie();
  // }

  // _mutateMovieDataInInitialList(oldObjData, newObjData) {
  //   Object.keys(newObjData).forEach(function(key) {
  //     delete oldObjData[key];
  //   });

  //   Object.keys(newObjData).forEach(function(key) {
  //     oldObjData[key] = newObjData[key];
  //   });
  // }
}
