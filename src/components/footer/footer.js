import {createElement, unrender} from "../../utils/index";

export default class Footer {
  constructor(moviesList) {
    this._moviesList = moviesList;
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
      <section class="footer__logo logo logo--smaller">Cinemaddict</section>
      <section class="footer__statistics">
        <p>${this._moviesList.length} movies inside</p>
      </section>
    `;
  }
}
