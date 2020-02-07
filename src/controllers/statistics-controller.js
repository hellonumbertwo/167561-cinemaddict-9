import moment from "moment";
import { render } from "./../utils";
import StatisticsContainer from "./../components/statistics-container";
import StatisticsBrief from "../components/statistics-brief";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const CHART_BARS_COLOR = `#ffe800`;

/**
 * Типы сиртировки списка фильмов.
 * @readonly
 * @enum {string}
 */
const StatsPeriods = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export default class StatisticsController {
  constructor(container, movies) {
    this._movies = movies;
    this._container = container;
    this._statisticsData = {};
    this._statistics = new StatisticsContainer();

    this._filteredMovies = [];
    this._activeFilter = StatsPeriods.ALL_TIME;
  }

  init() {
    render(this._container, this._statistics.getElement(), `beforeend`);
    this._setFilterByPeriodListeners();
    this._updateFiltersPanel();
    this._showStatsByPeriod(this._activeFilter);
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

  get _watchedMovies() {
    return this._movies.filter(({ isWatched }) => !!isWatched);
  }

  _getGenresData() {
    return this._filteredMovies.reduce((stat, { genresList }) => {
      genresList.forEach(genre => {
        if (stat[genre]) {
          stat[genre] += 1;
        } else {
          stat[genre] = 1;
        }
      });
      return stat;
    }, {});
  }

  _getTopGenre() {
    const genresStats = this._getGenresData();
    let topGenre = null;
    for (let key in genresStats) {
      if (!topGenre) {
        topGenre = key;
      } else if (genresStats[key] > genresStats[topGenre]) {
        topGenre = key;
      }
    }
    return topGenre;
  }

  _getTotalDuration() {
    return this._filteredMovies.reduce((totalDuration, { duration }) => {
      return totalDuration + duration;
    }, 0);
  }

  _initHorizontalBarChart(ctx, genresList, numbersOfMovies) {
    return new Chart(ctx, {
      type: `horizontalBar`,
      data: {
        datasets: [
          {
            label: `number of movies`,
            data: numbersOfMovies,
            backgroundColor: CHART_BARS_COLOR,
            borderColor: CHART_BARS_COLOR,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          fontSize: 14,
          xAxes: [
            {
              display: false,
              stacked: true
            }
          ],
          yAxes: [
            {
              type: `category`,
              labels: genresList,
              stacked: true
            }
          ]
        }
      }
    });
  }

  _renderHorizontalChard() {
    const genresList = Object.keys(this._getGenresData());
    const numbersOfMovies = genresList.map(
      genre => this._getGenresData()[genre]
    );
    const horizontalBarChart = this._initHorizontalBarChart(
      this._statistics.getElement().querySelector(`.statistic__chart`),
      genresList,
      numbersOfMovies
    );
    return horizontalBarChart;
  }

  _updateStatisticsData(movies) {
    this._movies = movies;
    this._showStatsByPeriod(this._activeFilter);
  }

  _showStatsByPeriod(period) {
    switch (period) {
      case StatsPeriods.TODAY:
        this._filteredMovies = this._watchedMovies.filter(({ watchingDate }) =>
          moment(watchingDate).isSame(Date.now(), `date`)
        );
        this._activeFilter = StatsPeriods.TODAY;
        break;
      case StatsPeriods.WEEK:
        this._filteredMovies = this._watchedMovies.filter(({ watchingDate }) =>
          moment(watchingDate).isSame(Date.now(), `week`)
        );
        break;
      case StatsPeriods.MONTH:
        this._filteredMovies = this._watchedMovies.filter(({ watchingDate }) =>
          moment(watchingDate).isSame(Date.now(), `month`)
        );
        this._activeFilter = StatsPeriods.MONTH;
        break;
      case StatsPeriods.YEAR:
        this._filteredMovies = this._watchedMovies.filter(({ watchingDate }) =>
          moment(watchingDate).isSame(Date.now(), `year`)
        );
        this._activeFilter = StatsPeriods.YEAR;
        break;
      default:
        this._filteredMovies = this._watchedMovies;
        this._activeFilter = StatsPeriods.ALL_TIME;
        break;
    }

    this._renderStatistics();
  }

  _renderStatistics() {
    if (this._statisticsBrief) {
      this._statisticsBrief.removeElement();
    }

    this._statisticsBrief = new StatisticsBrief(
      this._filteredMovies.length,
      this._getTotalDuration(),
      this._getTopGenre()
    );

    render(
      this._statistics.getElement().querySelector(`.statistic__text`),
      this._statisticsBrief.getElement(),
      `beforeend`
    );

    this._renderHorizontalChard();
  }

  _setFilterByPeriodListeners() {
    this._statistics
      .getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`change`, e => {
        if (e.target.tagName !== `INPUT`) {
          return;
        }
        this._showStatsByPeriod(e.target.value);
      });
  }

  _updateFiltersPanel() {
    this._statistics
      .getElement()
      .querySelectorAll(`.statistic__filters-input`)
      .forEach(input => {
        if (input.value === this._activeFilter) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });
  }
}
