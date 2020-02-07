import {
  render,
  getMoviesDataByFilters,
  Screens,
  Filters
} from "../utils/index";
import Navigation from "../components/navigation";

const ACTIVE_CLASS = `main-navigation__item--active`;

export default class NavigationController {
  constructor(container, movies, onScreenChange, onFilterChange) {
    this._container = container;
    this._movies = movies;
    this._onScreenChange = onScreenChange;
    this._onFilterChange = onFilterChange;
    this._filters = [];
    this._currentScreen = Screens.FILM;
    this._activeFilter = Filters.ALL;
  }

  init() {
    this._processData();
    this._navigation = new Navigation(this._filters);
    this._setFiltersPanel();
    render(this._container, this._navigation.getElement(), `afterbegin`);
    this._setEventListeners();
  }

  show() {
    if (this._navigation.getElement().classList.contains(`visually-hidden`)) {
      this._navigation.getElement().classList.remove(`visually-hidden`);
    }
  }

  hide() {
    if (!this._navigation.getElement().classList.contains(`visually-hidden`)) {
      this._navigation.getElement().classList.add(`visually-hidden`);
    }
  }

  _processData() {
    const filtersData = getMoviesDataByFilters(this._movies);
    this._filters = Object.keys(filtersData).map(filter => ({
      filter,
      amount: filtersData[filter].length
    }));
  }

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
      this._setFiltersPanel();
    });
  }

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
  }

  _setFiltersPanel() {
    this._navigation
      .getElement()
      .querySelectorAll(`.main-navigation__item`)
      .forEach(filter => {
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

  _updateFiltersData(movies) {
    this._movies = movies;
    this._navigation.removeElement();
    this.init();
  }
}
