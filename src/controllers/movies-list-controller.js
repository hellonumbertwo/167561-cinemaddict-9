import { render } from "../utils";
import ShowMoreButton from "../components/show-more-button";
import MovieController from "./movie-controller";

/**
 * количество фильмов, которые добавляются в отобращаемый список при нажатии на кноку 'show more'.
 * @constant {number}
 * @default
 */
const SHOW_MOVIES_STEP = 5;

/**
 * Типы сиртировки списка фильмов.
 * @readonly
 * @enum {string}
 */
const Sortings = {
  BY_DATE: `by-date`,
  BY_RATE: `by-rate`
};

export default class MoviesListController {
  constructor(container, movies, onDataChange) {
    this._container = container;
    this._initialMoviesList = movies;
    this._sortedMoviesList = movies;

    this._numberOfShownMovies = 0;
    this._showMoreButton = new ShowMoreButton();

    this._onShowDetailsSubscriptions = [];
    this._onShowDetails = this._onShowDetails.bind(this);

    this._onDataChange = onDataChange;
    this._onDataChangeSubscriptions = [];

    this._renderMoviesListByChuncks = this._renderMoviesListByChuncks.bind(
      this,
      SHOW_MOVIES_STEP
    );
  }

  get _isMoreMoviesLeft() {
    return this._numberOfShownMovies < this._initialMoviesList.length;
  }

  init() {
    this._onShowDetailsSubscriptions = [];
    this._onDataChangeSubscriptions = [];

    if (this._initialMoviesList.length > SHOW_MOVIES_STEP) {
      render(this._container, this._showMoreButton.getElement(), `afterend`);
    }

    this._numberOfShownMovies = 0;
    this._onHandleSorting();
    this._setShowMoreEventListener();
  }

  _renderMoviesListByChuncks() {
    const prevNumberOfShownMovies = this._numberOfShownMovies;
    this._numberOfShownMovies += SHOW_MOVIES_STEP;
    this._sortedMoviesList
      .slice(prevNumberOfShownMovies, this._numberOfShownMovies)
      .forEach(movie => {
        this._renderMovie(movie);
      });

    this._handleShowMoreButtonVisibility();
  }

  _handleShowMoreButtonVisibility() {
    const isButtonNeedToBeShown =
      this._isMoreMoviesLeft &&
      this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    const isButtonNeedToBeHidden =
      !this._isMoreMoviesLeft &&
      !this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    if (isButtonNeedToBeShown) {
      this._showMoreButton.getElement().classList.remove(`visually-hidden`);
    }

    if (isButtonNeedToBeHidden) {
      this._showMoreButton.getElement().classList.add(`visually-hidden`);
    }
  }

  _renderMovie(movie) {
    const movieController = new MovieController(
      this._container,
      movie,
      this._onShowDetails,
      this._onDataChange
    );
    movieController.init();
    this._onShowDetailsSubscriptions.push(
      movieController._hideMovieDetails.bind(movieController)
    );
    this._onDataChangeSubscriptions.push(
      movieController._updateMovie.bind(movieController)
    );
  }

  _setShowMoreEventListener() {
    this._showMoreButton
      .getElement()
      .addEventListener(`click`, this._renderMoviesListByChuncks, false);
  }

  _onHandleSorting(sortType) {
    this._container.innerHTML = ``;

    switch (sortType) {
      case Sortings.BY_DATE:
        this._sortedMoviesList = this._initialMoviesList
          .slice()
          .sort((a, b) => a.releaseDate - b.releaseDate);
        break;
      case Sortings.BY_RATE:
        this._sortedMoviesList = this._initialMoviesList.sort(
          (a, b) => a.rate - b.rate
        );
        break;
      default:
        this._sortedMoviesList = this._initialMoviesList.slice();
        break;
    }

    this._renderMoviesListByChuncks(null);
  }

  _onShowDetails() {
    this._onShowDetailsSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription();
    });
  }

  // менются данные в списке фильмов
  _onMoviesListDataChange(movies) {
    this._initialMoviesList = movies;
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._initialMoviesList);
    });
  }

  // меняется список фильмов
  _onListChange(movies) {
    this._initialMoviesList = movies;
    this._onShowDetails();
    this.init();
  }
}
