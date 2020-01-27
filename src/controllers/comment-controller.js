import { render } from "./../utils/index";
import Comment from "./../components/comment";

export default class CommentController {
  constructor(container, comment, onRemoveComment) {
    this._container = container;
    this._commentData = comment;
    this._onRemoveComment = onRemoveComment;

    this._comment = new Comment(comment);
  }

  init() {
    render(this._container, this._comment.getElement(), `beforeend`);
    this._setEventListeners();
  }

  _setEventListeners() {
    this._comment
      .getElement()
      .querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, e => {
        e.preventDefault();
        this._onRemoveComment(this._commentData);
      });
  }
}
