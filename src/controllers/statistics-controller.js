import moment from "moment";
import { render, Positioning } from "./../utils";
import StatisticsContainer from "./../components/statistics-container";
import StatisticsBrief from "../components/statistics-brief";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

/**
 * цвета диаграммы
 * @enum {String}
 * @memberof StatisticsController
 * @readonly
 */
const ChartColors = {
  BARS: `#ffe800`,
  FONT: `#ffffff`
};

/**
 * Фильтры статистики просмотренных фильмов по периодам.
 * @memberof StatisticsController
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

/**
 * @module
 * @class
 * @name StatisticsController
 * @classdesc контроллер для управления навигацией – отрисовка, переключение экранов статистики и списка, выбор фильтров.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Array} movies – список фильмов.
 */
export default class StatisticsController {
  constructor(container, movies) {
    this._movies = movies;
    this._container = container;
    this._statisticsData = {};
    this._statistics = new StatisticsContainer();
    this._chart = null;

    this._filteredMovies = [];
    this._activeFilter = StatsPeriods.ALL_TIME;
  }

  /**
   * @method
   * @memberof StatisticsController
   * @public
   */
  init() {
    render(
      this._container,
      this._statistics.getElement(),
      Positioning.BEFOREEND
    );
    this._setFilterByPeriodListeners();
    this._updateFiltersPanel();

    this._showStatsByPeriod(this._activeFilter);
  }

  get _watchedMovies() {
    return this._movies.filter(({ isWatched }) => !!isWatched);
  }

  /**
   * показать экран статистики в DOM
   * @method
   * @memberof StatisticsController
   * @public
   */
  show() {
    if (this._statistics.getElement().classList.contains(`visually-hidden`)) {
      this._statistics.getElement().classList.remove(`visually-hidden`);
    }
  }

  /**
   * скрыть экран статистики в DOM
   * @method
   * @memberof StatisticsController
   * @public
   */
  hide() {
    if (!this._statistics.getElement().classList.contains(`visually-hidden`)) {
      this._statistics.getElement().classList.add(`visually-hidden`);
    }
  }

  /**
   * посчитать количество фильмов по жанрам
   * @method
   * @memberof StatisticsController
   * @private
   * @return {Object} - {genreName: number}
   */
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

  /**
   * выбрать самый популярный жанр среди просмотренных фильмов
   * @method
   * @memberof StatisticsController
   * @private
   * @return {String}
   */
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

  /**
   * посчитать общее время просмотренных фильмов
   * @method
   * @memberof StatisticsController
   * @private
   * @return {Number} - минуты
   */
  _getTotalDuration() {
    return this._filteredMovies.reduce((totalDuration, { duration }) => {
      return totalDuration + duration;
    }, 0);
  }

  /**
   * обновить список фильмов до актуального
   * @method
   * @memberof StatisticsController
   * @private
   * @param {Array} movies – список фильмов
   */
  _updateStatisticsData(movies) {
    this._movies = movies;
    this._showStatsByPeriod(this._activeFilter);
  }

  /**
   * покзаать статистику за выбранный период времени
   * @method
   * @memberof StatisticsController
   * @private
   * @param {String} period
   */
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
    this._processChart();
  }

  /**
   * отрисовать содержимое экрана в DOM: диаграмма + brief
   * @method
   * @memberof StatisticsController
   * @private
   */
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
      Positioning.BEFOREEND
    );
  }

  /**
   * установить обработчик для события - `выбрать период`
   * @method
   * @memberof StatisticsController
   * @private
   */
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

  /**
   * обновить фильтры в DOM - подсветить активный, сбросить не активные
   * @method
   * @memberof StatisticsController
   * @private
   */
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

  /**
   * построить или обновить диаграмму
   * @method
   * @memberof StatisticsController
   * @private
   */
  _processChart() {
    const genresList = Object.keys(this._getGenresData());
    const numbersOfMovies = genresList.map(
      genre => this._getGenresData()[genre]
    );
    if (this._chart === null) {
      this._chart = new Chart(
        this._statistics.getElement().querySelector(`.statistic__chart`),
        this._getChartConfigure(genresList, numbersOfMovies)
      );
    } else {
      this._chart.data.datasets.forEach(dataset => {
        dataset.data = numbersOfMovies;
      });
      this._chart.options.scales.yAxes[0].labels = genresList;
      this._chart.update();
    }
  }

  /**
   * генерирует настройки диаграммы
   * @method
   * @memberof StatisticsController
   * @private
   * @param {Array} labels
   * @param {Array} data
   * @return {Object}
   */
  _getChartConfigure(labels, data) {
    return {
      type: `horizontalBar`,
      data: {
        datasets: [
          {
            data,
            backgroundColor: ChartColors.BARS,
            borderColor: ChartColors.BARS,
            borderWidth: 1
          }
        ]
      },
      plugins: [ChartDataLabels],
      options: {
        legend: {
          display: false
        },
        plugins: {
          datalabels: {
            align: `start`,
            offset: 16,
            color: ChartColors.FONT,
            clamp: true,
            anchor: `start`,
            font: {
              size: 14,
              weight: `500`
            }
          }
        },
        scales: {
          xAxes: [
            {
              display: false,
              stacked: true
            }
          ],
          yAxes: [
            {
              labels,
              stacked: true,
              type: `category`,
              ticks: {
                fontColor: ChartColors.FONT,
                fontSize: 14,
                fontStyle: `500`,
                padding: 56
              }
            }
          ]
        }
      }
    };
  }
}
