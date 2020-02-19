import AbstractComponent from "./abstract-component";

export default class MovieRatingPanel extends AbstractComponent {
  constructor({ poster, title, isWatched, personalRate }) {
    super();
    this._poster = poster;
    this._title = title;
    this._isWatched = isWatched;
    this._rate = personalRate;
  }
  getTemplate() {
    return `
<section class="film-details__user-rating-wrap ${
      !this._isWatched ? `visually-hidden` : ``
    }">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${
              this._poster
            }" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${this._renderRatingGrade()}
            </div>
          </section>
        </div>
      </section>
    `;
  }
  _renderRatingGrade() {
    const grade = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return grade
      .map(
        mark =>
          `
        <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${mark}" id="rating-${mark}" ${
            this._rate === mark ? `checked` : ``
          }><label class="film-details__user-rating-label" for="rating-${mark}">${mark}</label>
        `
      )
      .join(``);
  }
}
