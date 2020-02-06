import AbstractComponent from "./abstract-component";

export default class Content extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `
      <section class="films" id="main-films-list">
          <section class="films-list">
            <div class="films-list__container"></div>
          </section>
      </section>
    `;
  }
}
