import {render} from "../utils";
import Content from "../components/content";
import ShowMoreButton from "../components/show-more-button";
import MovieController from "./movie-controller";
import FiltersPanel from "../components/filters-panel";
import Sorting from "../components/sorting";
import ExtraMoviesList from "../components/extra-movies-list";
import Statistics from "./../components/statistics";

export default class PageController {
  constructor(container, movies, showMoviesStep, filters, statistics) {
    this._container = container;
    this._movies = [...movies];
    this._defaultOrderedMovies = [...movies];
    this._showMoviesStep = showMoviesStep;
    this._numberOfShownMovies = 0;
    this._statistics = statistics;
    this._content = new Content();
    this._showMoreButton = new ShowMoreButton();
    this._filtersPanel = new FiltersPanel(filters);
    this._sorting = new Sorting();
    this._topRatedMoviesList = new ExtraMoviesList(`Top rated`);
    this._mostCommentedMoviesList = new ExtraMoviesList(`Most commented`);
    this._statistics = new Statistics(statistics);
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
      this._statistics,
      this._filtersPanel,
      this._sorting,
      this._content
    ].forEach((component) =>
      render(this._container, component.getElement(), `beforeend`)
    );

    render(
        this._content.getElement().querySelector(`.films-list__container`),
        this._showMoreButton.getElement(),
        `afterend`
    );

    this._renderMoviesListByChunks();

    this._renderExtraMovies();

    this._setEventListeners();
  }

  _setEventListeners() {
    this._showMoreButton.getElement().addEventListener(
        `click`,
        () => {
          this._renderMoviesListByChunks();
        },
        false
    );

    this._sorting.getElement().addEventListener(`click`, (e) => {
      this._sortMoviesByLinkClick(e);
    });
  }

  // TODO: комментарий
  _renderMoviesListByChunks() {
    const prevNumberOfMovies = this._numberOfShownMovies;
    const numberMoviesToShow = prevNumberOfMovies + this._showMoviesStep;
    this._numberOfShownMovies = numberMoviesToShow;

    for (let i = prevNumberOfMovies; i < numberMoviesToShow; i++) {
      this._initMovieController(
          this._container.querySelector(`.films-list__container`),
          this._movies[i]
      );
    }

    this._handleShowMoreButtonVisibility();
  }

  // TODO: комментарий
  _initMovieController(container, movie) {
    const movieController = new MovieController(
        container,
        movie,
        this._onDataChange.bind(this)
    );
    movieController.init();
  }

  // TODO: комментарий
  _renderExtraMovies() {
    [this._topRatedMoviesList, this._mostCommentedMoviesList].forEach(
        (component) => {
          render(this._content.getElement(), component.getElement(), `beforeend`);
        }
    );

    this._topRatedMovies.forEach((movie) => {
      this._initMovieController(
          this._topRatedMoviesList
          .getElement()
          .querySelector(`.films-list__container`),
          movie
      );
    });

    this._mostCommentedMovies.forEach((movie) => {
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

    this._numberOfShownMovies = 0;
    this._container.querySelector(`.films-list__container`).innerHTML = ``;

    switch (e.target.dataset.sortType) {
      case `by-date`:
        this._movies.slice().sort((a, b) => a.releaseDate - b.releaseDate);
        break;
      case `by-rate`:
        this._movies.sort((a, b) => a.rate - b.rate);
        break;
      default:
        this._movies = [...this._defaultOrdered];
        break;
    }

    this._renderMoviesListByChunks();
  }

  // TODO: комментарий
  _handleShowMoreButtonVisibility() {
    const isButtonNeedToBeShown =
      this._getIsMoreMoviesLeft(this._movies) &&
      this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    const isButtonNeedToBeHidden =
      !this._getIsMoreMoviesLeft(this._movies) &&
      !this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    if (isButtonNeedToBeShown) {
      this._showMoreButton.getElement().classList.remove(`visually-hidden`);
    }

    if (isButtonNeedToBeHidden) {
      this._showMoreButton.getElement().classList.add(`visually-hidden`);
    }
  }

  // TODO: комментарий
  _getIsMoreMoviesLeft(fullList) {
    return this._numberOfShownMovies < fullList.length;
  }

  _onDataChange(newMovieData, movieId, updateMovie) {
    this._mutateMovieDataInInitialList(this._movies[movieId], newMovieData);
    updateMovie();
  }

  // TODO: оставить комментарий
  _mutateMovieDataInInitialList(oldObjData, newObjData) {
    Object.keys(newObjData).forEach(function (key) {
      delete oldObjData[key];
    });

    Object.keys(newObjData).forEach(function (key) {
      oldObjData[key] = newObjData[key];
    });
  }
}
