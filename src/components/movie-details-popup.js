import AbstractComponent from "./abstract-component";

export default class MovieDetailsPopup extends AbstractComponent {
  constructor({ comments }) {
    super();
    this._comments = comments;
  }
  getTemplate() {
    return `
      <section class="film-details">
        <form class="film-details__inner" action="" method="get">
          <div class="form-details__top-container">
            <div class="film-details__close">
              <button class="film-details__close-btn" type="button">close</button>
            </div>
          </div>
          <div class="form-details__middle-container"></div>
          <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
            <ul class="film-details__comments-list">
            </ul>
            </section>
          </div>
        </form>
      </section>
    `;
  }
}
