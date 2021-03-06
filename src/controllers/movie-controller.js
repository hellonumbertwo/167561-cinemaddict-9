import { render, Positioning, getStatusDataByName } from "../utils";
import MoviePreview from "../components/movie-preview";

const activeControlsClass = `film-card__controls-item--active`;

/**
 * @module
 * @class
 * @name MovieController
 * @classdesc контроллер для работы с карточкой фильма – отрисовка, обновление данных.
 * @param {String} containerId – id родительского контейнера для рендеринга.
 * @param {Func} onShowDetails - обработчик, который вызывается при открытии popup (котролирует, что единовременно открыт только один popup).
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
   * отрисовывает DOM элемент для карточки фильма
   * @method
   * @memberof MovieController
   * @private
   */
  _renderCardPreview() {
    render(
      this._container,
      this._moviePreview.getElement(),
      Positioning.BEFOREEND
    );
  }

  /**
   * устанавливает событие - `открыть popup с информацией о фильме по клику на постер, комментарии или название`
   * @method
   * @memberof MovieController
   * @private
   */
  _setEventListenerForShowDetails() {
    this._moviePreview.getElement().addEventListener(
      `click`,
      e => {
        if (
          e.target.classList.contains(`film-card__poster`) ||
          e.target.classList.contains(`film-card__title`) ||
          e.target.classList.contains(`film-card__comments`)
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
   * устанавливет обработчик события – `снять/добавить категорию` (favorites, watchlist, watched) фильма из карточки preview
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
          const { prop } = getStatusDataByName(e.target.dataset.status);
          e.target.classList.toggle(activeControlsClass);
          this._onDataChange({
            ...this._movie,
            [prop]: !this._movie[prop]
          })
            .then(() => {})
            .catch(() => {
              this._updateControlsPanelInDOM();
            });
        },
        false
      );
  }

  /**
   * обновить панель со статусами фильма (watchlist, watched, favorite) в DOM
   * @method
   * @memberof MovieController
   * @private
   */
  _updateControlsPanelInDOM() {
    this._moviePreview
      .getElement()
      .querySelector(`.film-card__controls`)
      .querySelectorAll(`button`)
      .forEach(button => {
        const { prop } = getStatusDataByName(button.dataset.status);
        if (
          this._movie[prop] &&
          !button.classList.contains(activeControlsClass)
        ) {
          button.classList.add(activeControlsClass);
        }
        if (
          !this._movie[prop] &&
          button.classList.contains(activeControlsClass)
        ) {
          button.classList.remove(activeControlsClass);
        }
      });
  }

  /**
   * обновить счетчик комментариев в DOM
   * @method
   * @memberof MovieController
   * @private
   */
  _updateCommentsCounterInDOM() {
    this._moviePreview
      .getElement()
      .querySelector(
        `.film-card__comments`
      ).innerHTML = `${this._movie.comments.length} comments`;
  }

  /**
   * обновить данные и отображение в DOM фильма до актулаьных
   * @method
   * @memberof MovieController
   * @private
   * @param {Array} movies - актуальный список фильмов
   */
  _updateMovie(movies) {
    if (movies.find(({ id }) => id === this._movie.id)) {
      this._movie = movies.find(({ id }) => id === this._movie.id);
      this._updateControlsPanelInDOM();
      this._updateCommentsCounterInDOM();
    } else if (this._container.contains(this._moviePreview.getElement())) {
      this._moviePreview.getElement().classList.add(`film-card--removing`);
    }
  }
}
