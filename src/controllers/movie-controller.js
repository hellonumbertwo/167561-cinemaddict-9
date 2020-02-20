import { render, Positioning, Statuses } from "../utils";
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
    render(
      this._container,
      this._moviePreview.getElement(),
      Positioning.BEFOREEND
    );
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
          const prop = Statuses[e.target.dataset.status];
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
    const activeClass = `film-card__controls-item--active`;
    this._moviePreview
      .getElement()
      .querySelector(`.film-card__controls`)
      .querySelectorAll(`button`)
      .forEach(button => {
        const prop = Statuses[button.dataset.status];
        if (this._movie[prop] && !button.classList.contains(activeClass)) {
          button.classList.add(activeClass);
        }
        if (!this._movie[prop] && button.classList.contains(activeClass)) {
          button.classList.remove(activeClass);
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
    }
  }
}
