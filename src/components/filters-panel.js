import AbstractComponent from "./abstract-component";

export default class FiltersPanel extends AbstractComponent {
  constructor(filtersList) {
    super();
    this._filtersList = filtersList;
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
