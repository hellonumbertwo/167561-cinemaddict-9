import {createElement, unrender} from "../../utils/index";
const createPopupTemplate = (movie) => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button" id="close-details-button">close</button>
      </div>
        ${createFilmInfoTemplate(movie)}
        ${createControlsTemplate(movie)}
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap" id="film-detail-comments">
        ${createCommentsListTemplate(movie)}
        ${createCommentFormTemplate(movie)}
      </section>
    </div>
  </form>
</section>
`;

export default class MovieDetailsPopup {
  constructor({comments}) {
    this._comments = comments;
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
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container" id="movie-info-top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button" id="close-details-button">close</button>
            </div>
          </div>
          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap" id="movie-info-bottom-container">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
            <ul class="film-details__comments-list" id="movie-details-comments">
            </ul>
            </section>
          </div>
        </form>
      </section>
    `;
  }
}
