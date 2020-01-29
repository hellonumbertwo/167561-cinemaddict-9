import { render, getMoviesDataByFilters, Screens } from "../utils/index";
import Navigation from "../components/navigation";

const ACTIVE_CLASS = `main-navigation__item--active`;

export default class NavigationController {
  constructor(container, movies, onScreenChange) {
    this._container = container;
    this._movies = movies;
    this._onScreenChange = onScreenChange;
    this._filters = [];
    this._currentScreen = Screens.FILM;
  }

  init() {
    this._processData();
    this._navigation = new Navigation(this._filters);
    render(this._container, this._navigation.getElement(), `beforeend`);
    this._setEventListeners();
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
          if (e.target.classList.contains(ACTIVE_CLASS)) {
            e.target.classList.remove(ACTIVE_CLASS);
          }
        } else {
          this._onScreenChange(Screens.STATISTICS);
          if (!e.target.classList.contains(ACTIVE_CLASS)) {
            e.target.classList.add(ACTIVE_CLASS);
          }
        }
      });
  }

  _updateCurrentScreen(screen) {
    this._currentScreen = screen;
  }
}