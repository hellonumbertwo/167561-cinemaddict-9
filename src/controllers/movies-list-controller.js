import { render, createElement } from "../utils";
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
  }

  init() {
    if (this._initialMoviesList.length === 0) {
      const plug = createElement(`
      <div class="no-result">
        There are no movies in our database.
      </div>
      `);
      render(this._container, plug, `afterend`);
      return;
    }

    this._renderMoviesListByChuncks(SHOW_MOVIES_STEP);

    if (this._initialMoviesList.length > SHOW_MOVIES_STEP) {
      render(this._container, this._showMoreButton.getElement(), `afterend`);
    }

    this._setShowMoreEventListener();
  }

  get _isMoreMoviesLeft() {
    return this._numberOfShownMovies < this._initialMoviesList.length;
  }

  _renderMoviesListByChuncks(step = null) {
    if (step) {
      const prevNumberOfShownMovies = this._numberOfShownMovies;
      this._numberOfShownMovies += step;
      this._sortedMoviesList
        .slice(prevNumberOfShownMovies, this._numberOfShownMovies)
        .forEach(movie => {
          this._renderMovie(movie);
        });
    } else {
      this._sortedMoviesList
        .slice(0, this._numberOfShownMovies)
        .forEach(movie => {
          this._renderMovie(movie);
        });
    }

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
    this._movieController = new MovieController(
      this._container,
      movie,
      this._onShowDetails,
      this._onDataChange
    );
    this._movieController.init();
    this._onShowDetailsSubscriptions.push(
      this._movieController._hideMovieDetails.bind(this._movieController)
    );
    this._onDataChangeSubscriptions.push(
      this._movieController._updateMovie.bind(this._movieController)
    );
  }

  _setShowMoreEventListener() {
    this._showMoreButton.getElement().addEventListener(
      `click`,
      () => {
        this._renderMoviesListByChuncks(SHOW_MOVIES_STEP);
      },
      false
    );
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

    this._renderMoviesListByChuncks();
  }

  _onShowDetails() {
    this._onShowDetailsSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription();
    });
  }

  _onMoviesListDataChange(movies) {
    this._initialMoviesList = movies;
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._initialMoviesList);
    });
  }
}
