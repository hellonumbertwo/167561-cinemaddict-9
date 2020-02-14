import { render, Positioning } from "../utils";
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
    this._moviePreview = new MoviePreview(movie);
  }

  /**
   * @method
   * @memberof MovieController
   * @public
   */
  init() {
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
          this._showMovieDetails(this._movie);
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
    this._onShowDetails(this._movie);
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
