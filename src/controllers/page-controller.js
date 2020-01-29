import { Screens } from "./../utils/index";
import NavigationController from "./navigation-controller";
import StatisticsController from "./statistics-controller";
import MoviesBoardController from "./movies-board-controller";

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
  }

  init() {
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
        this._statisticsController.show();
        this._moviesBoardController.hide();
        break;
      case Screens.FILMS:
        this._statisticsController.hide();
        this._moviesBoardController.show();
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
