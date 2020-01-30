import AbstractComponent from "./abstract-component";

export default class Navigation extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }
  getTemplate() {
    return `
      <nav class="main-navigation">
        ${this._filters
          .map(
            ({ filter, amount }) => `
          <a href="#watchlist" class="main-navigation__item">
          ${filter}
          ${
            amount
              ? `<span class="main-navigation__item-count">${amount}</span>`
              : ``
          }</a>
        `
          )
          .join(``)}
          <a href="#stats" class="main-navigation__item main-navigation__item--additional" id="statistics">Stats</a>
      </nav>
    `;
  }
}
