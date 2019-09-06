import {render} from "../utils";
import Content from "../components/content";
import ShowMoreButton from "../components/show-more-button";
import MovieController from "./movie-controller";
import FiltersPanel from "../components/filters-panel";
import Sorting from "../components/sorting";
import ExtraMoviesList from "../components/extra-movies-list";
import Statistics from "./../components/statistics";

export default class PageController {
  constructor(container, movies, showMoviesStep, filters, statistics) {
    this._container = container;
    this._movies = movies;
    this._showMoviesStep = showMoviesStep;
    this._numberOfShownMovies = 0;
    this._statistics = statistics;
    this._content = new Content();
    this._showMoreButton = new ShowMoreButton();
    this._filtersPanel = new FiltersPanel(filters);
    this._sorting = new Sorting();
    this._topRatedMoviesList = new ExtraMoviesList(`Top rated`);
    this._mostCommentedMoviesList = new ExtraMoviesList(`Most commented`);
    this._statistics = new Statistics(statistics);
  }
  init() {
    this._showMoreButton.getElement().addEventListener(
        `click`,
        () => {
          this._renderMoviesListByChunks();
          this._handleShowMoreButtonVisibility();
        },
        false
    );

    [
      this._statistics,
      this._filtersPanel,
      this._sorting,
      this._content
    ].forEach((component) =>
      render(this._container, component.getElement(), `beforeend`)
    );
    render(
        this._content.getElement().querySelector(`.films-list__container`),
        this._showMoreButton.getElement(),
        `afterend`
    );

    this._renderMoviesListByChunks();
    this._renderExtraMovies();
  }
  _renderMoviesListByChunks() {
    const prevNumberOfMovies = this._numberOfShownMovies;
    const numberMoviesToShow = prevNumberOfMovies + this._showMoviesStep;
    this._numberOfShownMovies = numberMoviesToShow;

    this._movies
      .slice(prevNumberOfMovies, numberMoviesToShow)
      .forEach((movie) => {
        const movieController = new MovieController(
            this._container.querySelector(`.films-list__container`),
            movie
        );
        movieController.init();
      });
  }

  _renderExtraMovies() {
    const topRatedMoviesList = this._movies
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);

    const mostCommentedMoviesList = this._movies
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);

    render(
        this._content.getElement(),
        this._topRatedMoviesList.getElement(),
        `beforeend`
    );
    render(
        this._content.getElement(),
        this._mostCommentedMoviesList.getElement(),
        `beforeend`
    );

    topRatedMoviesList.forEach((movie) => {
      const movieController = new MovieController(
          this._topRatedMoviesList
          .getElement()
          .querySelector(`.films-list__container`),
          movie
      );
      movieController.init();
    });

    mostCommentedMoviesList.forEach((movie) => {
      const movieController = new MovieController(
          this._mostCommentedMoviesList
          .getElement()
          .querySelector(`.films-list__container`),
          movie
      );
      movieController.init();
    });
  }

  _handleShowMoreButtonVisibility() {
    const isButtonNeedToBeShown =
      this._getIsMoreMoviesLeft(this._movies) &&
      this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    const isButtonNeedToBeHidden =
      !this._getIsMoreMoviesLeft(this._movies) &&
      !this._showMoreButton.getElement().classList.contains(`visually-hidden`);

    if (isButtonNeedToBeShown) {
      this._showMoreButton.getElement().classList.remove(`visually-hidden`);
    }

    if (isButtonNeedToBeHidden) {
      this._showMoreButton.getElement().classList.add(`visually-hidden`);
    }
  }

  _getIsMoreMoviesLeft(fullList) {
    return this._numberOfShownMovies < fullList.length;
  }
}
