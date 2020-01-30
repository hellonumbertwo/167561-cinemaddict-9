import { render } from "./../utils";
import Statistics from "./../components/statistics";

export default class StatisticsController {
  consructor(container, movies) {
    this._container = container;
    this._movies = movies;
    this._statisticsData = {};
  }

  init() {
    this._statistics = new Statistics();
    render(
      document.querySelector(`.main`),
      this._statistics.getElement(),
      `beforeend`
    );
  }

  show() {
    if (this._statistics.getElement().classList.contains(`visually-hidden`)) {
      this._statistics.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    if (!this._statistics.getElement().classList.contains(`visually-hidden`)) {
      this._statistics.getElement().classList.add(`visually-hidden`);
    }
  }
}
