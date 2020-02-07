import AbstractComponent from "./abstract-component";

export default class StatisticsContainer extends AbstractComponent {
  constructor() {
    super();
  }

  get _formattedDuration() {
    return {
      hours: `${Math.trunc(this._totalDuration / 60)}`,
      minutes: `${this._totalDuration % 60}`
    };
  }

  getTemplate() {
    return `
      <section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">Sci-Fighter</span>
        </p>
      </section>
    `;
  }
}
