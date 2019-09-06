import Movie from "../components/movie";
import MovieInfo from "../components/movie-info";
import {render} from "../utils";
import MovieDetailsPopup from "../components/movie-details-popup";
import ControlsPanel from "../components/controls-panel";
import RatePanel from "../components/rate-panel";
import Comment from "./../components/comment";
import CommentForm from "../components/comment-form";

export default class MovieController {
  constructor(container, movie) {
    this._container = container;
    this._movie = movie;
    this._moviePreview = new Movie(movie);
    this._movieDetails = new MovieDetailsPopup(movie);
    this._movieInfo = new MovieInfo(movie);
    this._controlsPanel = new ControlsPanel(movie);
    this._ratePanel = new RatePanel(movie);
    this._commentForm = new CommentForm();
  }
  init() {
    /** Показать попап с доп информацией при клике на название, постер или кол-во комментариев
     * @param {event} e
     */
    const showMovieDetails = function (e) {
      if (
        e.target.id === `movie-poster` ||
        e.target.id === `movie-title` ||
        e.target.id === `movie-comments-title`
      ) {
        this._renderMovieDetails();
      }
    }.bind(this);

    this._moviePreview
      .getElement()
      .addEventListener(`click`, showMovieDetails, false);

    render(this._container, this._moviePreview.getElement(), `beforeend`);
  }
  _renderMovieDetails() {
    const closeMovieDetails = function () {
      this._movieDetails.removeElement();
    }.bind(this);

    const onEscKeyDown = (e) => {
      if (e.key === `esc` || e.key === `Escape`) {
        closeMovieDetails();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    document.addEventListener(`keydown`, onEscKeyDown);

    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, closeMovieDetails, false);

    render(
        document.getElementById(`main`),
        this._movieDetails.getElement(),
        `beforeend`
    );

    [this._movieInfo, this._controlsPanel].forEach((component) => {
      render(
          this._movieDetails
          .getElement()
          .querySelector(`.form-details__top-container`),
          component.getElement(),
          `beforeend`
      );
    });
    if (this._movie.isWatched) {
      render(
          this._movieDetails
          .getElement()
          .querySelector(`.form-details__middle-container`),
          this._ratePanel.getElement(),
          `beforeend`
      );
    }

    this._movie.comments.forEach((comment) => {
      const commentBlock = new Comment(comment);
      render(
          this._movieDetails
          .getElement()
          .querySelector(`.film-details__comments-list`),
          commentBlock.getElement(),
          `beforeend`
      );
    });

    render(
        this._movieDetails
        .getElement()
        .querySelector(`.form-details__bottom-container`),
        this._commentForm.getElement(),
        `beforeend`
    );
  }
}
