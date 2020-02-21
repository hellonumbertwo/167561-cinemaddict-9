import {
  render,
  Screens,
  createElement,
  Positioning,
  getUserRank
} from "./../utils/index";
import NavigationController from "./navigation-controller";
import StatisticsController from "./statistics-controller";
import MoviesBoardController from "./movies-board-controller";
import SearchController from "./search-controller";
import MovieDetailsController from "./movie-details-controller";
import Footer from "../components/footer";
import Profile from "../components/profile";
import api from "./../api/index";
import moment from "moment";

const Plug = createElement(`<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">All movies. Upcoming</h2>
    <div class="no-result">
    There are no movies in our database.
    </div>
  </section>
</section>`);

/**
 * @module
 * @class
 * @name PageController
 * @classdesc контроллер - отдает контроллерам актуальные данные, управляет переключением экранов и popup.
 * @param {String} containerId – id родительского контенйера для рендеринга.
 * @param {Array} movies – список фильмов.
 */
export default class PageController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;

    this._currentScreen = Screens.FILMS;
    this._rank = null;
    this._profile = null;
    this._footer = new Footer(movies);

    this._updateScreen = this._updateScreen.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onShowDetails = this._onShowDetails.bind(this);

    this._updateScreenSubscriptions = [];
    this._onFilterChangeSubscriptions = [];
    this._onDataChangeSubscriptions = [];

    this._navigationController = new NavigationController(
      this._container,
      this._movies,
      this._updateScreen,
      this._onFilterChange
    );
    this._moviesBoardController = new MoviesBoardController(
      this._container,
      this._movies,
      this._onDataChange,
      this._onShowDetails
    );
    this._statisticsController = new StatisticsController(
      this._container,
      this._movies
    );
    this._searchController = new SearchController(
      document.getElementById(`header`),
      this._movies,
      this._updateScreen,
      this._onDataChange,
      this._onShowDetails
    );
  }

  /**
   * @method
   * @memberof PageController
   * @public
   */
  init() {
    render(
      document.getElementById(`main`),
      this._footer.getElement(),
      Positioning.AFTEREND
    );
    if (this._movies.length === 0) {
      render(this._container, Plug, Positioning.AFTEREND);
      return;
    }

    this._searchController.init();
    this._navigationController.init();
    this._statisticsController.init();
    this._moviesBoardController.init();

    this._manageUserRank();
    this._initMovieDetails();
    this._setEventsSubscriptions();
    this._updateScreen(this._currentScreen);
  }

  /**
   * установить подписчики на события: `переключение экранов`, `изменение фильтра`, `изменение данных в списке фильмов`
   * @method
   * @memberof PageController
   * @private
   */
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
      this._searchController._updateMoviesListData.bind(this._searchController),
      this._navigationController._updateFiltersData.bind(
        this._navigationController
      ),
      this._statisticsController._updateStatisticsData.bind(
        this._statisticsController
      )
    );
  }

  /**
   * показать актуальный экран, скрыть не актуальные
   * @method
   * @memberof PageController
   * @private
   * @param {String} screen
   */
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

  /**
   * вызывает прослушивальщики для события `смена фильтра` (доска со списком фильмов)
   * @method
   * @memberof PageController
   * @private
   * @param {String} filter
   */
  _onFilterChange(filter) {
    this._onFilterChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription(filter);
    });
    this._updateScreen(Screens.FILMS);
  }

  /**
   * обновляет данные в списке фильмов (отправялет на сервер)
   * @method
   * @memberof PageController
   * @private
   * @param {Object} updatedMovie
   * @return {Promise}
   */
  _onDataChange(updatedMovie) {
    const { id, isWatched } = updatedMovie;
    if (!this._movies[id].isWatched && isWatched) {
      updatedMovie.watchingDate = moment().toISOString();
    }
    return api
      .updateMovie(updatedMovie)
      .then(movie => {
        this._movies[id] = { ...movie };
        this._onDataChangeSubscriptions.forEach(subscription => {
          if (!(subscription instanceof Function)) {
            return;
          }
          subscription(this._movies);
        });
        this._updateScreenSubscriptions.forEach(subscription => {
          if (!(subscription instanceof Function)) {
            return;
          }
          subscription(this._currentScreen);
        });
        this._manageUserRank();
      })
      .catch(error => {
        throw error;
      });
  }

  /**
   * отобращение актуального ранга пользователя в DOM (render + update)
   * @method
   * @memberof PageController
   * @private
   */
  _manageUserRank() {
    const rank = getUserRank(this._movies);
    if (!this._profile) {
      this._profile = new Profile(rank);
      render(
        document.getElementById(`header`),
        this._profile.getElement(),
        Positioning.BEFOREEND
      );
    } else if (
      rank !== this._rank &&
      document.contains(this._profile.getElement())
    ) {
      const prevProfileElement = this._profile.getElement();
      this._profile = new Profile(rank);
      prevProfileElement.replaceWith(this._profile.getElement());
    }
    this._rank = rank;
  }

  /**
   * инициализировать контроллер для popup с полезной информацией, который будет управлять его отрисовкой и изменением данных
   * @method
   * @memberof MoviesBoardController
   * @private
   */
  _initMovieDetails() {
    this._movieDetailsController = new MovieDetailsController(
      document.getElementById(`main`),
      this._onDataChange
    );

    this._onDataChangeSubscriptions.push(
      this._movieDetailsController._updateMovieData.bind(
        this._movieDetailsController
      )
    );
  }

  /**
   * показать popup с подробной информацией по выбранному фильму
   * @method
   * @memberof MoviesBoardController
   * @private
   * @param {Object} movie – объект фильма
   */
  _onShowDetails({ id }) {
    const currentMovie = this._movies.find(movie => movie.id === id);
    this._movieDetailsController.show(currentMovie);
  }
}
