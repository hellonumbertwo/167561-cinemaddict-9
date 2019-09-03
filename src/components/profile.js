import {createElement, unrender} from "./../utils/index";

export default class Profile {
  constructor({status}) {
    this._status = status;
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
      <section class="header__profile profile">
        ${this._status ? `<p class="profile__rating">${this._status}</p>` : ``}
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>
    `;
  }
}
