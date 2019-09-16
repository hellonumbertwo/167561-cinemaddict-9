import AbstractComponent from "./abstract-component";

export default class Sorting extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `
      <ul class="sort">
        <li><a href="#" class="sort__button sort__button--active" data-sort-type="default">Sort by default</a></li>
        <li><a href="#" class="sort__button" data-sort-type="by-date">Sort by date</a></li>
        <li><a href="#" class="sort__button" data-sort-type="by-rate">Sort by rating</a></li>
      </ul>
    `;
  }
}
