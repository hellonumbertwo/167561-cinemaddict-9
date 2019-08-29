import {formatDuration} from "./../../../utils/index";

export const createFilmInfoTemplate = ({
  ageRestriction,
  title,
  rate,
  director,
  writters,
  starring,
  releaseDate,
  duration,
  country,
  description,
  genresList
}) => `
  <div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="./images/posters/the-great-flamarion.jpg" alt="">

      <p class="film-details__age">${ageRestriction}</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">Original: ${title}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${rate}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${writters}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${starring}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${releaseDate.toLocaleDateString()}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">
          ${formatDuration(duration).hours}h
          ${formatDuration(duration).minutes}m</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${country}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">
          ${genresList.length > 1 ? `Genres` : `Genre`}</td>
          <td class="film-details__cell">
            <span class="film-details__genre">${genresList.join(`, `)}</span>
          </td>
        </tr>
      </table>

      <p class="film-details__film-description">
        ${description}
      </p>
    </div>
  </div>
`;
