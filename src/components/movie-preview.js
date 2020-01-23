import { formatDuration } from "../utils/index";
import AbstractComponent from "./abstract-component";

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

    this._setEventListeners();
  }

  get _formattedDuration() {
    return formatDuration(this._duration);
  }

  getTemplate() {
    return `
      <article class="film-card">
        <h3 class="film-card__title" id="movie-title">${this._title}</h3>
        <p class="film-card__rating">${this._rate}</p>
        <p class="film-card__info">
            <span class="film-card__year">${this._releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${this._formattedDuration}</span>
            <span class="film-card__genre">${this._genresList.join(`, `)}</span>
        </p>
        <img src="./images/posters/${
          this._poster
        }" alt="" class="film-card__poster" id="movie-poster">
        <p class="film-card__description">${this._trimDescriptionString(
          this._description
        )}</p>
        <a class="film-card__comments" id="movie-comments-title">${
          this._comments.length
        } comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${
              this._isInWatchList ? `film-card__controls-item--active` : ``
            }" data-status="isInWatchList">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${
              this._isWatched ? `film-card__controls-item--active` : ``
            }" data-status="isWatched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${
              this._isFavorite ? `film-card__controls-item--active` : ``
            }" data-status="isFavorite">Mark as favorite</button>
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

  _setEventListeners() {
    this.getElement().addEventListener(
      `mouseover`,
      () => {
        if (!this.getElement().classList.contains(`hover`)) {
          this.getElement().classList.add(`hover`);
        }
      },
      false
    );
    this.getElement().addEventListener(
      `mouseout`,
      () => {
        if (this.getElement().classList.contains(`hover`)) {
          this.getElement().classList.remove(`hover`);
        }
      },
      false
    );
  }
}
