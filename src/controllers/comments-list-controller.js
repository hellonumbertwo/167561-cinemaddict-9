import { render, createElement, unrender, Positioning } from "./../utils/index";
import api from "./../api/index";
import CommentController from "./comment-controller";
import CommentForm from "./../components/comment-form";

const Loader = createElement(
  `<p class="film-details__comment-text">Loading...</p>`
);

/**
 * @module
 * @class
 * @name CommentsListController
 * @classdesc контроллер для отрисовки списка фильмов.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Func} onDataChange – обработчик, который вызывается при изменении данных в списке по фильму
 */
export default class CommentsListController {
  constructor(
    container,
    movie,
    onDataChange,
    onCommentInputFocus,
    onCommentInputBlur
  ) {
    this._container = container;
    this._movie = movie;
    this._comments = [];

    this._onDataChange = onDataChange;
    this._onCommentInputFocus = onCommentInputFocus;
    this._onCommentInputBlur = onCommentInputBlur;

    this._commentForm = new CommentForm();
    this._onRemoveComment = this._onRemoveComment.bind(this);
    this._onDeleteRequestStartSubscriptions = [];
    this._onDeleteRequestEndSubscriptions = [];
  }

  /**
   * @method
   * @memberof CommentsListController
   * @public
   */
  init() {
    this._onDeleteRequestStartSubscriptions = [];
    this._onDeleteRequestEndSubscriptions = [];
    render(
      this._container.querySelector(`.form-details__bottom-container`),
      this._commentForm.getElement(),
      Positioning.BEFOREEND
    );

    this._setEventListeners();

    this._loadCommentsByMovieId().then(() => {
      this._renderComments();
    });
  }

  /**
   * загрузка списка комментариев с сервера по id фильма
   * @method
   * @memberof CommentsListController
   * @private
   * @return {Promise}
   */
  _loadCommentsByMovieId() {
    this._setLoadingStatus(true);
    return api.getComments(this._movie).then(comments => {
      this._comments = [...comments];
      this._setLoadingStatus(false);
    });
  }

  /**
   * установить обработчики для событий: `отправка комментария`, `focus и blur для поля ввода` (пока поле в фокусе popup нельзя закрыть по Esc)
   * @method
   * @memberof CommentsListController
   * @private
   */
  _setEventListeners() {
    this._commentForm
      .getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, e => {
        if ((event.ctrlKey || event.metaKey) && e.code === `Enter`) {
          this._createComment();
        }
      });

    this._commentForm
      .getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, () => {
        this._onCommentInputFocus();
      });

    this._commentForm
      .getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, () => {
        this._onCommentInputBlur();
      });
  }

  /**
   * отрисова список комментариев в DOM
   * @method
   * @memberof CommentsListController
   * @private
   */
  _renderComments() {
    this._comments.forEach(comment => {
      const commentInstanse = new CommentController(
        this._container.querySelector(`.film-details__comments-list`),
        comment,
        this._onRemoveComment
      );
      commentInstanse.init();
      this._onDeleteRequestStartSubscriptions.push(
        commentInstanse._onSetLoadingStatus.bind(commentInstanse, true)
      );
      this._onDeleteRequestEndSubscriptions.push(
        commentInstanse._onSetLoadingStatus.bind(commentInstanse, false)
      );
    });
  }

  /**
   * создать комментарий
   * @method
   * @memberof CommentsListController
   * @private
   * @return {Promise}
   */
  _createComment() {
    const form = this._container.querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    const comment = {
      text: this._escapeUserInput(formData.get(`comment`)),
      emoji: formData.get(`comment-emoji`),
      date: new Date().toISOString()
    };
    const { id } = this._movie;

    this._setCommentFormDisabledStatus(true);
    return api
      .createComment(id, comment)
      .then(() => {
        return this._onDataChange(this._movie);
      })
      .finally(() => {
        this._setCommentFormDisabledStatus(false);
      });
  }

  /**
   * удалить комментарий
   * @method
   * @memberof CommentsListController
   * @private
   * @param {Object} comment - объект комментария
   * @return {Promise}
   */
  _onRemoveComment(comment) {
    this._onDeleteRequestStartSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(comment);
    });
    return api
      .deleteComment(comment)
      .then(() => {
        return this._onDataChange(this._movie);
      })
      .finally(() => {
        this._onDeleteRequestEndSubscriptions.forEach(subscription => {
          if (!(subscription instanceof Function)) {
            return;
          }
          subscription(comment);
        });
      });
  }

  /**
   * обновить список комментариев в DOM
   * @method
   * @memberof CommentsListController
   * @private
   * @return {Promise}
   */
  _updateCommentsList() {
    return this._loadCommentsByMovieId().then(() => {
      this._container.querySelector(
        `.film-details__comments-list`
      ).innerHTML = ``;
      this._renderComments();
      this._updateCommentsCounter();
      this._commentFormReset();
    });
  }

  /**
   * обновить счетчик комментариев в DOM
   * @method
   * @memberof CommentsListController
   * @private
   */
  _updateCommentsCounter() {
    this._container.querySelector(
      `.film-details__comments-count`
    ).innerHTML = `${this._comments.length}`;
  }

  /**
   * сбросить форму добавления комментария
   * @method
   * @memberof CommentsListController
   * @private
   */
  _commentFormReset() {
    const newCommentForm = new CommentForm();
    this._commentForm.getElement().replaceWith(newCommentForm.getElement());
    this._commentForm = newCommentForm;
    this._setEventListeners();
  }

  /**
   * установить доступность формы - disabled/enabled
   * @method
   * @memberof CommentsListController
   * @private
   * @param {Boolean} status - true -> disabled, false -> enabled
   */
  _setCommentFormDisabledStatus(status = false) {
    const form = this._container.querySelector(`.film-details__inner`);
    form.querySelector(`.film-details__comment-input`).disabled = status;
    form.querySelectorAll(`.film-details__emoji-item`).forEach(input => {
      input.disabled = status;
    });
  }

  /**
   * экранирование пользовательского ввода
   * @method
   * @memberof CommentsListController
   * @private
   * @param {String} string - значение поля
   * @return {String}
   */
  _escapeUserInput(string) {
    let signMap = {
      "&": `&amp;`,
      "<": `&lt;`,
      ">": `&gt;`,
      '"': `&quot;`,
      "'": `&#39;`,
      "/": `&#x2F;`,
      "`": `&#x60;`,
      "=": `&#x3D;`,
      "#": `&#35;`
    };
    return String(string).replace(/[&<>"'`=\/]/g, function(s) {
      return signMap[s];
    });
  }

  /**
   * показать/скрыть лоадер при загрузке
   * @method
   * @memberof CommentsListController
   * @private
   * @param {Boolean} status - true -> показать, false -> скрыть
   */
  _setLoadingStatus(status) {
    if (status) {
      render(
        this._container.querySelector(`.film-details__comments-list`),
        Loader,
        Positioning.BEFOREEND
      );
    } else if (document.contains(Loader)) {
      unrender(Loader);
    }
  }
}
