import { render, Positioning, Statuses } from "./../utils/index";
import MovieDetails from "../components/movie-details";
import MovieInfo from "../components/movie-info";
import MovieStatusPanel from "../components/movie-status-panel";
import MovieRatingPanel from "../components/movie-rating-panel";
import CommentsListController from "./comments-list-controller";

/**
 * @module
 * @class
 * @name MovieController
 * @classdesc контроллер для работы с popup c подробной информацией о фильме: отрисовка, изменение и обновление данных.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Object} movie – объект фильма.
 * @param {Func} onDataChange – обработчик, который вызывается при изменении данных в списке по фильму.
 */
export default class MovieDetailsController {
  constructor(container, onDataChange) {
    this._container = container;
    this._movie = null;
    this._onDataChange = onDataChange;
    this._comments = [];
    this._onDataChangeSubscriptions = [];

    this.hide = this.hide.bind(this);
    this._onEscapeKeyDown = this._onEscapeKeyDown.bind(this);
    this._onCommentInputFocus = this._onCommentInputFocus.bind(this);
    this._onCommentInputBlur = this._onCommentInputBlur.bind(this);
  }

  /**
   * @method
   * @memberof MovieDetailsController
   * @public
   */
  init() {
    this._movieDetails = new MovieDetails(this._movie);
    this._movieInfo = new MovieInfo(this._movie);
    this._movieStatusPanel = new MovieStatusPanel(this._movie);
    this._movieRatingPanel = new MovieRatingPanel(this._movie);
    this._commentsListController = new CommentsListController(
      this._movieDetails.getElement(),
      this._movie,
      this._onDataChange,
      this._onCommentInputFocus,
      this._onCommentInputBlur
    );
    this._commentsListController.init();
    this._onDataChangeSubscriptions.push(
      this._commentsListController._updateData.bind(
        this._commentsListController
      )
    );
  }

  /**
   * отрисовывает в DOM popup с информацией о фильме
   * @method
   * @memberof MovieDetailsController
   * @public
   * @param {Object} movie - объект фильма
   */
  show(movie) {
    if (this._movieDetails) {
      this.hide();
    }
    this._movie = movie;
    this.init();
    this._renderMoviedDtails();
    this._addEventListeners();
  }

  /**
   * удаляет из DOM popup, если узел существует
   * @method
   * @memberof MovieDetailsController
   * @public
   */
  hide() {
    if (document.body.contains(this._movieDetails.getElement())) {
      this._movieDetails.removeElement();
    }
    this._onDataChangeSubscriptions = [];
    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._hide, false);
    document.removeEventListener(`keydown`, this._onEscapeKeyDown);
  }

  /**
   * отрисовывает содержимое popup
   * @method
   * @memberof MovieDetailsController
   * @private
   */
  _renderMoviedDtails() {
    render(
      document.getElementById(`main`),
      this._movieDetails.getElement(),
      Positioning.BEFOREEND
    );

    [this._movieInfo, this._movieStatusPanel, this._movieRatingPanel].forEach(
      component => {
        render(
          this._movieDetails
            .getElement()
            .querySelector(`.form-details__top-container`),
          component.getElement(),
          Positioning.BEFOREEND
        );
      }
    );
  }

  /**
   * устанавливает обработчики событий: закрытие popup, сменить категорию, сбросить/поставить рейтинг.
   * @method
   * @memberof MovieDetailsController
   * @private
   */
  _addEventListeners() {
    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this.hide, false);

    this._movieStatusPanel.getElement().addEventListener(`change`, e => {
      if (e.target.tagName !== `INPUT`) {
        return;
      }
      this._changeMovieStatus(e.target.name);
    });

    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__user-rating-score`)
      .addEventListener(`change`, e => {
        if (e.target.tagName !== `INPUT`) {
          return;
        }

        this._changePersonalRating(parseInt(e.target.value, 10));
      });

    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, () => {
        this._changePersonalRating(0);
      });

    document.addEventListener(`keydown`, this._onEscapeKeyDown);
  }

  /**
   * Обновляет категрию фильма: watchlist, watched, favorite
   * @method
   * @memberof MovieDetailsController
   * @private
   * @param {String} status
   */
  _changeMovieStatus(status) {
    const updatedProp = Statuses[status];
    this._onDataChange({
      ...this._movie,
      [updatedProp]: !this._movie[updatedProp]
    })
      .then(() => {
        this._updateRatingPanelInDOM();
      })
      .catch(() => {})
      .finally(() => {
        this._movieStatusPanel
          .getElement()
          .querySelectorAll(`input`)
          .forEach(input => {
            const prop = Statuses[input.name];
            input.checked = !!this._movie[prop];
          });
      });
  }

  /**
   * Изменить ценку (рейтинг) фильма
   * @method
   * @memberof MovieDetailsController
   * @param {Number} personalRate
   * @private
   */
  _changePersonalRating(personalRate) {
    this._setRatingPanelDisableStatus(true);
    this._onDataChange({
      ...this._movie,
      personalRate
    })
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        this._updateRatingPanelInDOM();
        this._setRatingPanelDisableStatus(false);
      });
  }

  /**
   * установить доступность формы рйтинга - disabled/enabled
   * @method
   * @memberof MovieDetailsController
   * @private
   * @param {Boolean} status - true -> disabled, false -> enabled
   */
  _setRatingPanelDisableStatus(status) {
    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelectorAll(`input`)
      .forEach(input => (input.disabled = status));
    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__watched-reset`).disabled = status;
  }

  /**
   * обновить панель рейтинга в DOM: показать/скрыть, отобразить актуальную оценку
   * @method
   * @memberof MovieDetailsController
   * @private
   */
  _updateRatingPanelInDOM() {
    const panelNode = this._movieRatingPanel.getElement();

    panelNode
      .querySelector(`.film-details__user-rating-score`)
      .querySelectorAll(`input`)
      .forEach(input => {
        if (this._movie.personalRate === parseInt(input.value, 10)) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });

    if (
      this._movie.isWatched &&
      panelNode.classList.contains(`visually-hidden`)
    ) {
      panelNode.classList.remove(`visually-hidden`);
    }
    if (
      !this._movie.isWatched &&
      !panelNode.classList.contains(`visually-hidden`)
    ) {
      panelNode.classList.add(`visually-hidden`);
    }
  }

  /**
   * Обновяляет данные фильма после успешной отправки на сервер
   * @method
   * @memberof MovieDetailsController
   * @private
   * @param {Array} movies – актуальный список фильмов
   */
  _updateMovieData(movies) {
    if (!this._movie) {
      return;
    }
    const movie = movies.find(({ id }) => id === this._movie.id);
    // const needToUpdateComments =
    //   movie.comments.length !== this._movie.comments.length;
    this._movie = { ...movie };

    // if (needToUpdateComments) {
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(this._movie);
    });
    // }
  }

  /**
   * удаляет обработчик собылия `Закрыть popup по Esc`, если после ввода комментария получило фокус.
   * @method
   * @memberof MovieDetailsController
   * @private
   */
  _onCommentInputFocus() {
    document.removeEventListener(`keydown`, this._onEscapeKeyDown);
  }

  /**
   * устанавливает обработчик собылия `Закрыть popup по Esc`, если после ввода комментария не в фокусе.
   * @method
   * @memberof MovieDetailsController
   * @private
   */
  _onCommentInputBlur() {
    document.addEventListener(`keydown`, this._onEscapeKeyDown);
  }

  /**
   * закрыть popup по нажатию Esc
   * @method
   * @memberof MovieDetailsController
   * @private
   * @param {Event} e
   */
  _onEscapeKeyDown(e) {
    // не выполняем код повторно, если событие уже запущено
    if (e.defaultPrevented) {
      document.removeEventListener(`keydown`, this._onEscapeKeyDown);
      return;
    }
    e.preventDefault();

    if (e.key === `esc` || e.key === `Escape`) {
      this.hide();
    }
    document.removeEventListener(`keydown`, this._onEscapeKeyDown);
  }
}
