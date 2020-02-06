import AbstractComponent from "./abstract-component";

export default class SearResults extends AbstractComponent {
  constructor(count) {
    super();
    this._count = count;
  }
  getTemplate() {
    return `
    <section>
      <div class="result">
        <p class="result__text">Result <span class="result__count">${this._count}</span></p>
      </div>
      <section class="films">
        <section class="films-list">
          <div class="films-list__container">
          </div>
        </section>
      </section>
    </section>
    `;
  }
}
