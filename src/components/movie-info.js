import {formatDuration} from "./../utils/index";
import AbstractComponent from "./abstract-component";
import moment from "moment";

export default class MovieInfo extends AbstractComponent {
  constructor({
    ageRestriction,
    title,
    poster,
    rate,
    director,
    writters,
    starring,
    releaseDate,
    duration,
    country,
    description,
    genresList
  }) {
    super();
    this._ageRestriction = ageRestriction;
    this._title = title;
    this._poster = poster;
    this._rate = rate;
    this._director = director;
    this._writters = writters;
    this._starring = starring;
    this._releaseDate = releaseDate;
    this._duration = duration;
    this._country = country;
    this._description = description;
    this._genresList = genresList;
  }

  get _formettedDuration() {
    return formatDuration(this._duration);
  }

  get _formattedReleaseDate() {
    return moment(this._releaseDate).format(`DD MMMM YYYY`);
  }

  getTemplate() {
    return `
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${
  this._poster
}" alt="">

          <p class="film-details__age">${this._ageRestriction}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">Original: ${
  this._title
}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._rate}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${this._director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${this._writters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${this._starring}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${this._formattedReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${this._formettedDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">
              ${this._genresList.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${this._genresList.join(
      `, `
  )}</span>
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${this._description}
          </p>
        </div>
      </div>
    `;
  }
}
