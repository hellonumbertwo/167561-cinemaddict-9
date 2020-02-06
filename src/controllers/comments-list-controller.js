import { render, createElement, unrender } from "./../utils/index";
import api from "./../api/index";
import CommentController from "./comment-controller";
import CommentForm from "./../components/comment-form";

const Loader = createElement(
  `<p class="film-details__comment-text">Loading...</p>`
);

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

  init() {
    this._onDeleteRequestStartSubscriptions = [];
    this._onDeleteRequestEndSubscriptions = [];
    render(
      this._container.querySelector(`.form-details__bottom-container`),
      this._commentForm.getElement(),
      `beforeend`
    );

    this._setEventListeners();

    this._loadCommentsByMovieId().then(() => {
      this._renderComments();
    });
  }

  _loadCommentsByMovieId() {
    this._setLoadingStatus();
    return api.getComments(this._movie).then(comments => {
      this._comments = [...comments];
      this._setDefaultStatus();
    });
  }

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

  _renderComments() {
    this._comments.forEach(comment => {
      const commentInstanse = new CommentController(
        this._container.querySelector(`.film-details__comments-list`),
        comment,
        this._onRemoveComment
      );
      commentInstanse.init();
      this._onDeleteRequestStartSubscriptions.push(
        commentInstanse._onSetLoadingStatus.bind(commentInstanse)
      );
      this._onDeleteRequestEndSubscriptions.push(
        commentInstanse._onSetDefaultStatus.bind(commentInstanse)
      );
    });
  }

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
    api
      .createComment(id, comment)
      .then(() => {
        return this._onDataChange(this._movie);
      })
      .finally(() => {
        this._setCommentFormDisabledStatus(false);
      });
  }

  _onRemoveComment(comment) {
    this._onDeleteRequestStartSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(comment);
    });
    api
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

  _updateCommentsCounter() {
    this._container.querySelector(
      `.film-details__comments-count`
    ).innerHTML = `${this._comments.length}`;
  }

  _commentFormReset() {
    const newCommentForm = new CommentForm();
    this._commentForm.getElement().replaceWith(newCommentForm.getElement());
    this._commentForm = newCommentForm;
    this._setEventListeners();
  }

  _setLoadingStatus() {
    render(
      this._container.querySelector(`.film-details__comments-list`),
      Loader,
      `beforeend`
    );
  }

  _setDefaultStatus() {
    unrender(Loader);
  }

  _setCommentFormDisabledStatus(status = false) {
    const form = this._container.querySelector(`.film-details__inner`);
    form.querySelector(`.film-details__comment-input`).disabled = status;
    form.querySelectorAll(`.film-details__emoji-item`).forEach(input => {
      input.disabled = status;
    });
  }

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
}
