import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class Comment extends AbstractComponent {
  constructor({ author, text, date, emoji }) {
    super();
    this._author = author;
    this._text = text;
    this._date = date;
    this._emoji = emoji;
  }

  get _formattedDate() {
    return moment(this._date).format(`YY/MM/DD HH:MM`);
  }

  getTemplate() {
    return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${this._emoji}.png" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${this._text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${this._author}</span>
          <span class="film-details__comment-day">${this._formattedDate}</span>
          <button type="button" class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
    `;
  }
}
