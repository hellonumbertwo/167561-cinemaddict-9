import AbstractComponent from "./abstract-component";

export default class Statistics extends AbstractComponent {
  constructor(watchedMovies, totalDuration, topGenre) {
    super();
    this._totalDuration = totalDuration;
    this._watchedMovies = watchedMovies;
    this._topGenre = topGenre;
  }

  get _formattedDuration() {
    return {
      hours: `${Math.trunc(this._totalDuration / 60)}`,
      minutes: `${this._totalDuration % 60}`
    };
  }

  getTemplate() {
    return `
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
  <p class="statistic__item-text">${
    this._watchedMovies
  }<span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">
          ${
            this._formattedDuration.hours
          } <span class="statistic__item-description">h</span>
          ${this._formattedDuration.minutes}
          <span class="statistic__item-description">m</span></p>
        </li>
        ${
          this._topGenre
            ? `
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${this._topGenre}</p>
              </li>
          `
            : ``
        }
      </ul>
    `;
  }
}
