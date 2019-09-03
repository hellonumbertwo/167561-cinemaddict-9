import {formatDuration, createElement, unrender} from "./../../utils/index";

export default class Movie {
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
      <article class="film-card">
        <h3 class="film-card__title" id="movie-title">${this._title}</h3>
        <p class="film-card__rating">${this._rate}</p>
        <p class="film-card__info">
            <span class="film-card__year">${this._releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${
  formatDuration(this._duration).hours
}h ${formatDuration(this._duration).minutes}m</span>
            <span class="film-card__genre">${this._genresList.join(`, `)}</span>
        </p>
        <img src="./images/posters/${
  this._poster
}" alt="" class="film-card__poster" id="movie-poster">
        <p class="film-card__description">${this._getDescription(
      this._description
  )}</p>
        <a class="film-card__comments" id="movie-comments-title">${
  this._comments.length
} comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${
  this._isInWatchList ? `film-card__controls-item--active` : ``
}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${
  this._isWatched ? `film-card__controls-item--active` : ``
}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${
  this._isFavorite ? `film-card__controls-item--active` : ``
}">Mark as favorite</button>
        </form>
    </article>
    `;
  }

  _getDescription(string) {
    const maxStringLength = 140;
    if (string.length > maxStringLength) {
      return string.slice(0, maxStringLength) + `...`;
    }
    return string;
  }
}
