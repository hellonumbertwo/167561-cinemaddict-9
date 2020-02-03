import AbstractComponent from "./abstract-component";

export default class NoSearchResults extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `<section class="films">
    <section class="films-list">
      <div class="no-result">
        There is no movies for your request.
      </div>
    </section>
    </section>`;
  }
}
