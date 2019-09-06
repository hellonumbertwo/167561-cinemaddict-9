import AbstractComponent from "./abstract-component";

export default class ShowMoreButton extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `
      <button class="films-list__show-more" id="show-more">Show more</button>
    `;
  }
}
