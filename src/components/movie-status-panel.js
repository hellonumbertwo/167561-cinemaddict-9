import AbstractComponent from "./abstract-component";
import { Statuses } from "./../utils/index";

export default class MovieStatusPanel extends AbstractComponent {
  constructor(movie) {
    super();
    this._movie = movie;
  }
  getTemplate() {
    return `
      <section class="film-details__controls">
      ${Object.keys(Statuses)
        .map(status => {
          const { name, text, prop } = Statuses[status];
          return `
          <input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}"
          ${this._movie[prop] ? `checked` : ``}>
          <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${text}</label>
        `;
        })
        .join(``)}
      </section>
    `;
  }
}
