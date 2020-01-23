import AbstractComponent from "./abstract-component";

export default class MovieStatusPanel extends AbstractComponent {
  constructor({ isInWatchList, isWatched, isFavorite }) {
    super();
    this._isInWatchList = isInWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }
  getTemplate() {
    return `
      <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"
          ${this._isInWatchList ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"
          ${this._isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"
          ${this._isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    `;
  }
}
