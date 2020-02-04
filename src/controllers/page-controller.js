import { render, Screens, createElement } from "./../utils/index";
import NavigationController from "./navigation-controller";
import StatisticsController from "./statistics-controller";
import MoviesBoardController from "./movies-board-controller";
import SearchController from "./search-controller";
import Footer from "../components/footer";
import Profile from "../components/profile";
import api from "./../api/index";

export default class PageController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;

    this._currentScreen = Screens.FILMS;
    this._updateScreen = this._updateScreen.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._updateScreenSubscriptions = [];
    this._onFilterChangeSubscriptions = [];
    this._onDataChangeSubscriptions = [];
    this._onDataChange = this._onDataChange.bind(this);

    this._navigationController = new NavigationController(
      container,
      movies,
      this._updateScreen,
      this._onFilterChange
    );
    this._moviesBoardController = new MoviesBoardController(
      container,
      movies,
      this._onDataChange
    );
    this._statisticsController = new StatisticsController(container, movies);
    this._searchController = new SearchController(
      document.getElementById(`header`),
      movies,
      this._updateScreen,
      this._onDataChange
    );
    this._footer = new Footer(movies);
    this._profile = new Profile();
  }

  init() {
    render(
      document.getElementById(`main`),
      this._footer.getElement(),
      `afterend`
    );
    if (this._movies.length === 0) {
      this._renderPlug();
      return;
    }

    this._searchController.init();
    this._navigationController.init();
    this._statisticsController.init();
    this._moviesBoardController.init();

    render(
      document.getElementById(`header`),
      this._profile.getElement(),
      `beforeend`
    );

    this._setEventsSubscriptions();
    this._updateScreen(this._currentScreen);
  }

  _renderPlug() {
    const plug = createElement(`
    <section class="films">
      <section class="films-list">
        <h2 class="films-list__title">All movies. Upcoming</h2>

        <div class="no-result">
        There are no movies in our database.
        </div>
      </section>
    </section>
  `);
    render(this._container, plug, `afterend`);
  }

  _setEventsSubscriptions() {
    this._updateScreenSubscriptions.push(
      this._navigationController._updateCurrentScreen.bind(
        this._navigationController
      )
    );

    this._onFilterChangeSubscriptions.push(
      this._moviesBoardController._onFilterChange.bind(
        this._moviesBoardController
      )
    );

    this._onDataChangeSubscriptions.push(
      this._moviesBoardController._updateMoviesListData.bind(
        this._moviesBoardController
      ),
      this._searchController._updateMoviesListData.bind(this._searchController)
    );
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
    this._updateScreenSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(screen);
    });
  }

  _onFilterChange(filter) {
    this._onFilterChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(filter);
    });
  }

  _onDataChange(updatedMovie) {
    api.updateMovie(updatedMovie).then(movie => {
      this._movies[updatedMovie.id] = { ...movie };
      this._onDataChangeSubscriptions.forEach(subscription => {
        if (!(subscription instanceof Function)) {
          return;
        }
        subscription(this._movies);
      });
    });
  }
}
