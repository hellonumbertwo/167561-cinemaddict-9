import {createElement, unrender} from "../../utils/index";

export default class FiltersPanel {
  constructor(filtersList) {
    this._filtersList = filtersList;
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
      <nav class="main-navigation">
        ${this._filtersList
          .map(
              ({name, amount}) => `
          <a href="#watchlist" class="main-navigation__item">
          ${name}
          ${
  amount
    ? `<span class="main-navigation__item-count">${amount}</span>`
    : ``
}</a>
        `
          )
          .join(``)}
      </nav>
    `;
  }
}
