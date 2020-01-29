import AbstractComponent from "./abstract-component";

export default class SearResults extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `
      <div class="result">
        <p class="result__text">Result <span class="result__count">1</span></p>
      </div>
    `;
  }
}
