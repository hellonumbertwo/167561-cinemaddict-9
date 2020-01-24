import { render } from "../utils";
import MoviePreview from "../components/movie-preview";
import MovieDetails from "../components/movie-details";
import MovieInfo from "../components/movie-info";
import MovieStatusPanel from "../components/movie-status-panel";
import MovieRatingPanel from "../components/movie-rating-panel";
import CommentForm from "../components/comment-form";
import Comment from "./../components/comment";

export default class MovieController {
  constructor(container, movie, onShowDetails, onDataChange) {
    this._container = container;
    this._movie = movie;
    this._onShowDetails = onShowDetails;
    this._onDataChange = onDataChange;
    this._elementToBeUpdated = null;
    this._commentForm = new CommentForm();

    this._showMovieDetails = this._showMovieDetails.bind(this);
    this._hideMovieDetails = this._hideMovieDetails.bind(this);
  }
  init() {
    this._moviePreview = new MoviePreview(this._movie);
    this._movieDetails = new MovieDetails(this._movie);
    this._movieInfo = new MovieInfo(this._movie);
    this._movieStatusPanel = new MovieStatusPanel(this._movie);
    this._movieRatingPanel = new MovieRatingPanel(this._movie);

    if (this._elementToBeUpdated) {
      this._container.replaceChild(
        this._moviePreview.getElement(),
        this._elementToBeUpdated
      );
      this._elementToBeUpdated = null;
    } else {
      render(this._container, this._moviePreview.getElement(), `beforeend`);
    }
    this._setEventListenerForShowDetails();
    this._changeCategoryFromPreview();
  }

  _setEventListenerForShowDetails() {
    this._moviePreview.getElement().addEventListener(
      `click`,
      e => {
        if (
          e.target.id === `movie-poster` ||
          e.target.id === `movie-title` ||
          e.target.id === `movie-comments-title`
        ) {
          this._showMovieDetails();
        }
      },
      false
    );
  }

  _showMovieDetails() {
    this._onShowDetails();

    this._renderMoviedDtails();

    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._hideMovieDetails, false);
  }

  _hideMovieDetails() {
    if (document.body.contains(this._movieDetails.getElement())) {
      this._movieDetails.removeElement();
    }
    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._hideMovieDetails, false);
  }

  _renderMoviedDtails() {
    render(
      document.getElementById(`main`),
      this._movieDetails.getElement(),
      `beforeend`
    );

    [this._movieInfo, this._movieStatusPanel].forEach(component => {
      render(
        this._movieDetails
          .getElement()
          .querySelector(`.form-details__top-container`),
        component.getElement(),
        `beforeend`
      );
    });

    this._movie.comments.forEach(comment => {
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

  _updateMovie(movies) {
    if (this._movie === movies[this._movie.id]) {
      return;
    }
    this._movie = movies[this._movie.id];
    this._elementToBeUpdated = this._moviePreview.getElement();
    this.init();
  }

  _changeCategoryFromPreview() {
    this._moviePreview
      .getElement()
      .querySelector(`.film-card__controls`)
      .addEventListener(
        `click`,
        e => {
          e.preventDefault();
          const status = [e.target.dataset.status];
          this._onDataChange({
            ...this._movie,
            [status]: !this._movie[e.target.dataset.status]
          });
        },
        false
      );
  }
}
