import AbstractComponent from "./abstract-component";
import { formatDurationFromMinutes, Statuses } from "./../utils/index";

export default class MoviePreview extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
    this._title = movie.title;
    this._poster = movie.poster;
    this._rate = movie.rate;
    this._duration = movie.duration;
    this._description = movie.description;
    this._genresList = movie.genresList;
    this._comments = movie.comments;
    this._releaseDate = movie.releaseDate;
  }

  getTemplate() {
    return `
      <article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rate}</p>
        <p class="film-card__info">
            <span class="film-card__year">${this._releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${formatDurationFromMinutes(
              this._duration
            )}</span>
            <span class="film-card__genre">${this._genresList.join(`, `)}</span>
        </p>
        <img src="${this._poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._trimDescriptionString(
          this._description
        )}</p>
        <a class="film-card__comments">${this._comments.length} comments</a>
        <form class="film-card__controls">
        ${Object.keys(Statuses)
          .map(status => {
            const { name, text, prop } = Statuses[status];
            return `
          <button type="button" class="film-card__controls-item film-card__controls-item--${name} ${
              this._movie[prop] ? `film-card__controls-item--active` : ``
            }" data-status="${name}">${text}</button>
          `;
          })
          .join(``)}
        </form>
    </article>
    `;
  }

  _trimDescriptionString(string) {
    /** Если описание длиннее 140 символов, но оно обрезается с ...
     * @constant
     * @type {number}
     * @default
     */
    const MAX_DESCRIPTION_LENGTH = 140;
    if (string.length > MAX_DESCRIPTION_LENGTH) {
      return string.slice(0, MAX_DESCRIPTION_LENGTH) + `...`;
    }
    return string;
  }
}
