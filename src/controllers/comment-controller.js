import { render, Positioning } from "./../utils/index";
import Comment from "./../components/comment";

/**
 * @module
 * @class
 * @name CommentController
 * @classdesc контроллер для управления комментарием: отрисовка и удаление в DOM.
 * @param {String} containerId – id родительского контейнера для рендеринга.
 * @param {Object} comment – объект комментария.
 * @param {Func} onRemoveComment – обработчик, который вызывается при нажании на кнопку `Delete`.
 */
export default class CommentController {
  constructor(container, comment, onRemoveComment) {
    this._container = container;
    this._commentData = comment;
    this._onRemoveComment = onRemoveComment;

    this._comment = new Comment(comment);
  }

  /**
   * @method
   * @memberof CommentController
   * @public
   */
  init() {
    render(this._container, this._comment.getElement(), Positioning.BEFOREEND);
    this._setEventListeners();
  }

  /**
   * установить обработчик события `удалить комментарий`
   * @method
   * @memberof CommentController
   * @private
   */
  _setEventListeners() {
    this._comment
      .getElement()
      .querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, e => {
        e.preventDefault();
        this._onRemoveComment(this._commentData);
      });
  }

  /**
   * установить статус ожидания ответа сервера при удалении комментария
   * @method
   * @memberof CommentController
   * @param {Boolean} status – true -> loading, false - loading ended
   * @param {Object} movie
   * @private
   */
  _onSetLoadingStatus(status, { id }) {
    if (id !== this._commentData.id) {
      return;
    }
    const buttonElem = this._comment
      .getElement()
      .querySelector(`.film-details__comment-delete`);
    if (status) {
      buttonElem.innerHTML = `Deleting...`;
      buttonElem.disabled = true;
    } else {
      buttonElem.innerHTML = `Delete`;
      buttonElem.disabled = false;
    }
  }
}
