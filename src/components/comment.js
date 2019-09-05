import {createElement, unrender} from "./../utils/index";

export default class Comment {
  constructor({author, text, date, emoji}) {
    this._author = author;
    this._text = text;
    this._date = date;
    this._emoji = emoji;
    this._element = null;
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    unrender(this.getElement());
    this._element = null;
  }
  getTemplate() {
    return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${
  this._emoji
}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${this._text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${this._author}</span>
          <span class="film-details__comment-day">${this._date.toLocaleString()}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
    `;
  }
}
