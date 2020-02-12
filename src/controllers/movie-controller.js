import { render, Positioning } from "../utils";
import MovieDetailsController from "./movie-details-controller";
import MoviePreview from "../components/movie-preview";

/**
 * @module
 * @class
 * @name MovieController
 * @classdesc контроллер для работы с карточкой фильма – отрисовка, обновление данных.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Func} onShowDetails - обработчик, который вызывает при открытии popup (котролирует, что единовременно открыт только один popup).
 * @param {Func} onDataChange – обработчик, который вызывается при изменении данных в списке по фильму.
 */
export default class MovieController {
  constructor(container, movie, onShowDetails, onDataChange) {
    this._container = container;
    this._movie = movie;
    this._onShowDetails = onShowDetails;
    this._onDataChange = onDataChange;
    this._elementToBeUpdated = null;
    this._movieDetailsToBeUpdated = null;

    this._showMovieDetails = this._showMovieDetails.bind(this);
    this._hideMovieDetails = this._hideMovieDetails.bind(this);
    this._onDataChangeSubscriptions = [];
  }

  /**
   * @method
   * @memberof MovieController
   * @public
   */
  init() {
    this._moviePreview = new MoviePreview(this._movie);
    this._movieDetailsController = new MovieDetailsController(
      document.getElementById(`main`),
      this._movie,
      this._onDataChange
    );
    this._onDataChangeSubscriptions.push(
      this._movieDetailsController._updateMovieData.bind(
        this._movieDetailsController
      )
    );
    this._movieDetailsController.init();

    this._renderCardPreview();
    this._setEventListenerForShowDetails();
    this._changeCategoryFromPreview();
  }

  /**
   * отрисовывает и обноляет DOM элемент для карточки фильма
   * @method
   * @memberof MovieController
   * @private
   */
  _renderCardPreview() {
    if (
      this._elementToBeUpdated &&
      document.body.contains(this._elementToBeUpdated)
    ) {
      this._container.replaceChild(
        this._moviePreview.getElement(),
        this._elementToBeUpdated
      );
    } else {
      render(
        this._container,
        this._moviePreview.getElement(),
        Positioning.BEFOREEND
      );
    }
    this._elementToBeUpdated = null;
  }

  /**
   * устанавливает событие - открыть popup с информацией о фильме по клику на постер, комментарии или название
   * @method
   * @memberof MovieController
   * @private
   */
  _setEventListenerForShowDetails() {
    this._moviePreview.getElement().addEventListener(
      `click`,
      e => {
        if (
          e.target.id === `movie-poster` ||
          e.target.id === `movie-title` ||
          e.target.id === `movie-comments-title`
        ) {
          this._showMovieDetails();
        }
      },
      false
    );
  }

  /**
   * показать popup с информацией о фильме
   * @method
   * @memberof MovieController
   * @private
   */
  _showMovieDetails() {
    this._onShowDetails();
    this._movieDetailsController.show();
  }

  /**
   * скрыть popup с информацией о фильме
   * @method
   * @memberof MovieController
   * @private
   */
  _hideMovieDetails() {
    this._movieDetailsController.hide();
  }

  /**
   * обновить данные о фильме и элемент в DOM
   * @method
   * @memberof MovieController
   * @private
   * @param {Object} movies – список фильмов с актуальными данными
   */
  _updateMovie(movies) {
    if (this._movie === movies[this._movie.id]) {
      return;
    }
    this._movie = movies[this._movie.id];
    this._elementToBeUpdated = this._moviePreview.getElement();
    this.init();

    // обновляем popup
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._movie);
    });
  }

  /**
   * устанавливет обработчик события – снять/добавить категорию (favorites, watchlist, watched) фильмы из карточки preview
   * @method
   * @memberof MovieController
   * @private
   */
  _changeCategoryFromPreview() {
    this._moviePreview
      .getElement()
      .querySelector(`.film-card__controls`)
      .addEventListener(
        `click`,
        e => {
          e.preventDefault();
          const status = [e.target.dataset.status];
          this._onDataChange({
            ...this._movie,
            [status]: !this._movie[e.target.dataset.status]
          });
        },
        false
      );
  }
}
