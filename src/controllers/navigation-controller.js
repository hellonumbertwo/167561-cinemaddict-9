import { render, getMoviesDataByFilters } from "../utils/index";
import Navigation from "../components/navigation";

export default class NavigationController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;
    this._filters = [];
  }

  init() {
    this._processData();
    this._navigation = new Navigation(this._filters);
    render(this._container, this._navigation.getElement(), `beforeend`);
  }

  _processData() {
    const filtersData = getMoviesDataByFilters(this._movies);
    this._filters = Object.keys(filtersData).map(filter => ({
      filter,
      amount: filtersData[filter].length
    }));
  }
}
