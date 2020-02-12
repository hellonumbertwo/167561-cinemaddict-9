import { render, createElement, unrender } from "../utils";
import ShowMoreButton from "../components/show-more-button";
import MovieController from "./movie-controller";

/**
 * количество фильмов, которые добавляются в отображаемый список при нажатии на кноку 'show more'.
 * @constant {number}
 * @default
 * @memberof MoviesListController
 */
const SHOW_MOVIES_STEP = 5;

/**
 * типы сиртировки списка фильмов
 * @readonly
 * @enum {string}
 * @memberof MoviesListController
 */
const Sortings = {
  BY_DATE: `by-date`,
  BY_RATE: `by-rate`
};

/**
 *
 */
const Plug = createElement(`<p>There is nothing here yet</p>`);

/**
 * @module
 * @class
 * @name MoviesListController
 * @classdesc контроллер для отрисовки списка фильмов.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Func} onDataChange – обработчик, который вызывается при изменении данных в списке по фильму
 */
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
      this
    );
  }

  /**
   * @method
   * @memberof MoviesListController
   * @public
   */
  init() {
    this._onShowDetailsSubscriptions = [];
    this._onDataChangeSubscriptions = [];

    this._numberOfShownMovies = 0;
    this._onHandleSorting();

    if (this._initialMoviesList.length > SHOW_MOVIES_STEP) {
      render(this._container, this._showMoreButton.getElement(), `afterend`);
      this._setShowMoreEventListener();
    }

    // если список пуст, показываем заглушку
    if (this._initialMoviesList.length === 0) {
      render(this._container, Plug, `afterend`);
    } else if (document.contains(Plug)) {
      unrender(Plug);
    }
  }

  /**
   * проверяет, есть ли в списке ещё не отрендеренные фильмы
   * @method
   * @memberof MoviesListController
   * @private
   * @return {Boolean}
   */
  _isMoreMoviesLeft() {
    return this._numberOfShownMovies < this._initialMoviesList.length;
  }

  /**
   * рендерит фильмы из списка в дом по частям
   * @method
   * @memberof MoviesListController
   * @private
   */
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

  /**
   * скрывает/показывет кнопку "ahow more", в зависимости от того, есть ли не отрендеренные фильмы в списке
   * @method
   * @memberof MoviesListController
   * @private
   */
  _handleShowMoreButtonVisibility() {
    const isButtonNeedToBeShown =
      this._isMoreMoviesLeft() &&
      this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    const isButtonNeedToBeHidden =
      !this._isMoreMoviesLeft() &&
      !this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    if (isButtonNeedToBeShown) {
      this._showMoreButton.getElement().classList.remove(`visually-hidden`);
    }

    if (isButtonNeedToBeHidden) {
      this._showMoreButton.getElement().classList.add(`visually-hidden`);
    }
  }

  /**
   * для конкретного фильма инициализует контроллер, который упраляет его отриосвкой и изменением данных
   * @method
   * @memberof MoviesListController
   * @private
   * @param {Object} movie – объект с данными фильма
   */
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

  /**
   * установить событие для кнопки "show more" – показать очередную часть списка фильмов.
   * @method
   * @memberof MoviesListController
   * @private
   */
  _setShowMoreEventListener() {
    this._showMoreButton
      .getElement()
      .addEventListener(`click`, this._renderMoviesListByChuncks, false);
  }

  /**
    сортировка и рендинг в DOM отсортированного списка фильмов
   * @method
   * @memberof MoviesListController
   * @private
   * @param {String} sortType – тип сортировки
   */
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
    this._numberOfShownMovies = 0;
    this._renderMoviesListByChuncks(0);
  }

  /**
   * если открыт popup с деталями для какого-то конкретного фильма, то нужно закрыть все остальные, единовременно можно работать только с одним popup.
   * @method
   * @memberof MoviesListController
   * @private
   */
  _onShowDetails() {
    this._onShowDetailsSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription();
    });
  }

  /**
   * обновляет список фильмов на актуальный, если поменялись данные в списке фильмов
   * @method
   * @memberof MoviesListController
   * @private
   * @param {Array} movies – актуальный список фильмов
   */
  _onMoviesListDataChange(movies) {
    this._initialMoviesList = movies;
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._initialMoviesList);
    });
  }

  /**
   * обновляет и рендерит новый список фильмов, например, список по для другого фильтра или результаты поиска.
   * @method
   * @memberof MoviesListController
   * @private
   * @param {Array} movies – новый список фильмов
   */
  _onListChange(movies) {
    this._initialMoviesList = movies;
    this._onShowDetails();
    this.init();
  }
}
