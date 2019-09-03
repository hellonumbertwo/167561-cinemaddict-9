import {createElement} from "./../utils/index";

export default class ShowMoreButton {
  constructor() {}
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
  getTemplate() {
    return `
      <button class="films-list__show-more" id="show-more">Show more</button>
    `;
  }
}
