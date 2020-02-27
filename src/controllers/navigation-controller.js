import {
  render,
  getMoviesDataByFilters,
  Screens,
  Filters
} from "../utils/index";
import Navigation from "../components/navigation";

/**
 * класс для активной ссылки в навигации
 * @constant {number}
 * @default
 * @memberof NavigationController
 */
const ACTIVE_CLASS = `main-navigation__item--active`;

/**
 * @module
 * @class
 * @name NavigationController
 * @classdesc контроллер для управления навигацией – отрисовка, переключение экранов статистики и списка, выбор фильтров.
 * @param {String} containerId – id родительского контейнера для рендеринга.
 * @param {Array} movies – список фильмов.
 * @param {Func} onScreenChange - обратотчик,который вызывается при переключении на экран статистики и обратно.
 * @param {Func} onFilterChange – обработчик, который вызывается при выборе фильтра.
 */
export default class NavigationController {
  constructor(container, movies, onScreenChange, onFilterChange) {
    this._container = container;
    this._movies = movies;
    this._onScreenChange = onScreenChange;
    this._onFilterChange = onFilterChange;
    this._filters = [];
    this._currentScreen = Screens.FILMS;
    this._activeFilter = Filters.ALL;
  }

  /**
   * @method
   * @memberof NavigationController
   * @public
   */
  init() {
    this._processFiltersData();

    this._navigation = new Navigation(this._filters);
    if (this._currentScreen === Screens.SEARCH) {
      this._navigation.getElement().classList.add(`visually-hidden`);
    }
    render(this._container, this._navigation.getElement(), `afterbegin`);
    this._setEventListeners();
    this._setActiveFilter();
  }

  /**
   * показать панель навигации в DOM
   * @method
   * @memberof NavigationController
   * @public
   */
  show() {
    if (this._navigation.getElement().classList.contains(`visually-hidden`)) {
      this._navigation.getElement().classList.remove(`visually-hidden`);
    }
  }

  /**
   * скрыть панель навигации в DOM
   * @method
   * @memberof NavigationController
   * @public
   */
  hide() {
    if (!this._navigation.getElement().classList.contains(`visually-hidden`)) {
      this._navigation.getElement().classList.add(`visually-hidden`);
    }
  }

  /**
   * подсчёт количества фильмов по каждому фильтру
   * @method
   * @memberof NavigationController
   * @private
   */
  _processFiltersData() {
    const filtersData = getMoviesDataByFilters(this._movies);
    this._filters = Object.keys(filtersData).map(filter => ({
      filter,
      amount: filtersData[filter].length
    }));
  }

  /**
   * установить обработчики для событий: `переключение экрана статистики`, `выбор фильтра`
   * @method
   * @memberof NavigationController
   * @private
   */
  _setEventListeners() {
    this._navigation
      .getElement()
      .querySelector(`#statistics`)
      .addEventListener(`click`, e => {
        e.preventDefault();
        if (this._currentScreen === Screens.STATISTICS) {
          this._onScreenChange(Screens.FILMS);
        } else {
          this._onScreenChange(Screens.STATISTICS);
        }
      });

    this._navigation.getElement().addEventListener(`click`, e => {
      e.preventDefault();
      if (
        e.target.tagName !== `A` ||
        e.target.classList.contains(`main-navigation__item--additional`)
      ) {
        return;
      }
      this._onFilterChange(e.target.dataset.filter);
      this._activeFilter = e.target.dataset.filter;
      this._setActiveFilter();
    });
  }

  /**
   * обновить состояние ссылки на экран статистики в DOM
   * @method
   * @memberof NavigationController
   * @param {String} screen – текущий экран.
   * @private
   */
  _updateCurrentScreen(screen) {
    this._currentScreen = screen;
    const statsLink = this._navigation
      .getElement()
      .querySelector(`#statistics`);
    if (
      this._currentScreen !== Screens.STATISTICS &&
      statsLink.classList.contains(ACTIVE_CLASS)
    ) {
      statsLink.classList.remove(ACTIVE_CLASS);
    }
    if (
      this._currentScreen === Screens.STATISTICS &&
      !statsLink.classList.contains(ACTIVE_CLASS)
    ) {
      statsLink.classList.add(ACTIVE_CLASS);
    }
    this._setActiveFilter();
  }

  /**
   * обновить в DOM состояние панели фильтров - подсветить актиный, сбросить неактивные
   * @method
   * @memberof NavigationController
   * @private
   */
  _setActiveFilter() {
    this._navigation
      .getElement()
      .querySelectorAll(`.main-navigation__item`)
      .forEach(filter => {
        if (
          this._currentScreen === Screens.STATISTICS &&
          filter.classList.contains(ACTIVE_CLASS)
        ) {
          filter.classList.remove(ACTIVE_CLASS);
          return;
        }
        if (filter.dataset && filter.dataset.filter === this._activeFilter) {
          if (!filter.classList.contains(ACTIVE_CLASS)) {
            filter.classList.add(ACTIVE_CLASS);
          }
        } else {
          if (filter.classList.contains(ACTIVE_CLASS)) {
            filter.classList.remove(ACTIVE_CLASS);
          }
        }
      });
  }

  /**
   * обновить панель навигации в DOM, когда данные по фильмам изменились
   * @method
   * @memberof NavigationController
   * @param {Array} movies – список фильмов
   * @private
   */
  _updateFiltersData(movies) {
    this._movies = movies;
    this._navigation.removeElement();
    this.init();
  }
}
