import { render } from "./../utils/index";
import api from "./../api/index";
import CommentController from "./comment-controller";
import CommentForm from "./../components/comment-form";

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
  }

  init() {
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
    return api.getComments(this._movie).then(comments => {
      this._comments = [...comments];
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
    });
  }

  _createComment() {
    const form = this._container.querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    const comment = {
      text: formData.get(`comment`),
      emoji: formData.get(`comment-emoji`),
      date: new Date().toISOString()
    };
    const { id } = this._movie;
    api.createComment(id, comment).then(() => {
      this._onDataChange(this._movie);
    });
  }

  _onRemoveComment(comment) {
    api.deleteComment(comment).then(() => {
      this._onDataChange(this._movie);
    });
  }

  _updateCommentsList() {
    this._loadCommentsByMovieId().then(() => {
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
}
