import { render, Screens } from "./../utils/index";
import NavigationController from "./navigation-controller";
import StatisticsController from "./statistics-controller";
import MoviesBoardController from "./movies-board-controller";
import SearchController from "./search-controller";
import Footer from "../components/footer";
import Profile from "../components/profile";

export default class PageController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;

    this._currentScreen = Screens.FILMS;
    this._updateScreen = this._updateScreen.bind(this);
    this._updateScreenSubscription = [];

    this._navigationController = new NavigationController(
      container,
      movies,
      this._updateScreen
    );
    this._statisticsController = new StatisticsController(container, movies);
    this._moviesBoardController = new MoviesBoardController(container, movies);
    this._searchController = new SearchController(
      document.getElementById(`header`),
      movies,
      this._updateScreen
    );
    this._footer = new Footer(movies);
    this._profile = new Profile();
  }

  init() {
    this._searchController.init();
    render(
      document.getElementById(`header`),
      this._profile.getElement(),
      `beforeend`
    );
    render(
      document.getElementById(`main`),
      this._footer.getElement(),
      `afterend`
    );
    this._navigationController.init();
    this._statisticsController.init();
    this._moviesBoardController.init();

    this._updateScreenSubscription.push(
      this._navigationController._updateCurrentScreen.bind(
        this._navigationController
      )
    );

    this._updateScreen(this._currentScreen);
  }

  _updateScreen(screen) {
    switch (screen) {
      case Screens.STATISTICS:
        this._navigationController.show();
        this._statisticsController.show();
        this._moviesBoardController.hide();
        this._searchController.hide();
        break;
      case Screens.FILMS:
        this._navigationController.show();
        this._statisticsController.hide();
        this._moviesBoardController.show();
        this._searchController.hide();
        break;
      case Screens.SEARCH:
        this._navigationController.hide();
        this._statisticsController.hide();
        this._moviesBoardController.hide();
        this._searchController.show();
        break;
    }
    this._currentScreen = screen;
    this._updateScreenSubscription.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(screen);
    });
  }
}
