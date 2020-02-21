import AbstractComponent from "./abstract-component";
import { formatDurationFromMinutes } from "./../utils/index";

export default class MoviePreview extends AbstractComponent {
  constructor({
    title,
    poster,
    rate,
    duration,
    description,
    genresList,
    isInWatchList,
    isWatched,
    isFavorite,
    comments,
    releaseDate
  }) {
    super();
    this._title = title;
    this._poster = poster;
    this._rate = rate;
    this._duration = duration;
    this._description = description;
    this._genresList = genresList;
    this._isInWatchList = isInWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
    this._comments = comments;
    this._releaseDate = releaseDate;
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
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${
              this._isInWatchList ? `film-card__controls-item--active` : ``
            }" data-status="watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${
              this._isWatched ? `film-card__controls-item--active` : ``
            }" data-status="watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${
              this._isFavorite ? `film-card__controls-item--active` : ``
            }" data-status="favorite">Mark as favorite</button>
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
