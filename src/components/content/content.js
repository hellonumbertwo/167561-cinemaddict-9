import {createElement, unrender} from "./../../utils/index";

export default class Content {
  constructor() {
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
      <section class="films">
          <section class="films-list">
            <div class="films-list__container" id="movies-list"></div>
          </section>
          <section class="films-list--extra">
              <h2 class="films-list__title">Top rated</h2>
              <div class="films-list__container" id="most-rated-movies-list"></div>
          </section>
          <section class="films-list--extra">
              <h2 class="films-list__title">Most commented</h2>
              <div class="films-list__container" id="most-commented-movies-list"></div>
          </section>
      </section>
    `;
  }
}
