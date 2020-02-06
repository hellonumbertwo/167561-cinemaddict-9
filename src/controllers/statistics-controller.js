import { render } from "./../utils";
import Statistics from "./../components/statistics";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const CHART_BARS_COLOR = `#ffe800`;

export default class StatisticsController {
  constructor(container, movies) {
    this._movies = movies;
    this._container = container;
    this._statisticsData = {};
  }

  init() {
    this._statistics = new Statistics(
      this._watchedFilms().length,
      this._getTotalDuration(),
      this._getTopGenre()
    );
    render(this._container, this._statistics.getElement(), `beforeend`);

    this._renderHorizontalChard();
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

  _watchedFilms() {
    return this._movies.filter(({ isWatched }) => !!isWatched);
  }

  _getGenresData() {
    return this._watchedFilms().reduce((stat, { genresList }) => {
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
    return this._watchedFilms().reduce((totalDuration, { duration }) => {
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
      this._container.querySelector(`.statistic__chart`),
      genresList,
      numbersOfMovies
    );
    return horizontalBarChart;
  }

  _updateStatisticsData(movies) {
    this._movies = movies;
    this._statistics.removeElement();
    this.init();
  }
}
