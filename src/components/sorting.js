import AbstractComponent from "./abstract-component";

export default class Sorting extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `
      <ul class="sort">
        <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
        <li><a href="#" class="sort__button">Sort by date</a></li>
        <li><a href="#" class="sort__button">Sort by rating</a></li>
      </ul>
    `;
  }
}
