import { render } from "./../utils/index";
import MovieDetails from "../components/movie-details";
import MovieInfo from "../components/movie-info";
import MovieStatusPanel from "../components/movie-status-panel";
import MovieRatingPanel from "../components/movie-rating-panel";
import CommentForm from "../components/comment-form";
import CommentController from "./comment-controller";

export default class MovieDetailsController {
  constructor(container, movie, onDataChange) {
    this._container = container;
    this._movie = movie;
    this._onDataChange = onDataChange;

    this._commentForm = new CommentForm();

    this.hide = this.hide.bind(this);
    this._onRemoveComment = this._onRemoveComment.bind(this);
    this._onEscapeKeyDown = this._onEscapeKeyDown.bind(this);
  }

  init() {
    this._movieDetails = new MovieDetails(this._movie);
    this._movieInfo = new MovieInfo(this._movie);
    this._movieStatusPanel = new MovieStatusPanel(this._movie);
    this._movieRatingPanel = new MovieRatingPanel(this._movie);
    this._commentForm = new CommentForm();
  }

  show() {
    this._renderMoviedDtails();
    this._addEventListeners();
  }

  hide() {
    if (document.body.contains(this._movieDetails.getElement())) {
      this._movieDetails.removeElement();
    }
    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .removeEventListener(`click`, this._hide, false);
    document.removeEventListener(`keydown`, this._onEscapeKeyDown);
  }

  _renderMoviedDtails() {
    render(
      document.getElementById(`main`),
      this._movieDetails.getElement(),
      `beforeend`
    );

    [this._movieInfo, this._movieStatusPanel, this._movieRatingPanel].forEach(
      component => {
        render(
          this._movieDetails
            .getElement()
            .querySelector(`.form-details__top-container`),
          component.getElement(),
          `beforeend`
        );
      }
    );

    this._movie.comments.forEach(comment => {
      this._addComment(comment);
    });

    render(
      this._movieDetails
        .getElement()
        .querySelector(`.form-details__bottom-container`),
      this._commentForm.getElement(),
      `beforeend`
    );
  }

  _changeData(payload = null) {
    const form = this._movieDetails
      .getElement()
      .querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    const entry = {
      isInWatchList: formData.get(`watchlist`),
      isWatched: formData.get(`watched`),
      isFavorite: formData.get(`favorite`),
      personalRating: formData.get(`score`),
      comments: [...this._movie.comments]
    };

    if (payload) {
      entry = { ...entry, ...payload };
    }

    if (formData.get(`comment`) && formData.get(`comment-emoji`)) {
      entry.comments.push({
        text: formData.get(`comment`),
        emoji: formData.get(`comment-emoji`),
        data: Date.now(),
        author: `Random author`
      });
    }

    this._onDataChange({ ...this._movie, ...entry });
  }

  _addEventListeners() {
    this._movieDetails
      .getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this.hide, false);

    this._movieStatusPanel.getElement().addEventListener(`change`, e => {
      if (e.target.tagName !== `INPUT`) {
        return;
      }
      this._changeData();
    });

    this._movieDetails
      .getElement()
      .querySelector(`.film-details__inner`)
      .addEventListener(`keydown`, e => {
        if ((event.ctrlKey || event.metaKey) && e.code === `Enter`) {
          this._changeData();
        }
      });

    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__user-rating-score`)
      .addEventListener(`click`, e => {
        if (e.target.tagName !== `INPUT`) {
          return;
        }
        this._changeData();
      });

    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, () => {
        this._resetPersonalRating();
        this._changeData();
      });

    document.addEventListener(`keydown`, this._onEscapeKeyDown);
  }

  _updateMovieData(movie) {
    if (movie === this._movie) {
      return;
    }
    this._movie = movie;

    this._updateRatingPanel();
    this._updateCommentsList();
    this._commentFormReset();
  }

  _addComment(comment) {
    const commentInstanse = new CommentController(
      this._movieDetails
        .getElement()
        .querySelector(`.film-details__comments-list`),
      comment,
      this._onRemoveComment
    );
    commentInstanse.init();
  }

  _commentFormReset() {
    const newCommentForm = new CommentForm();
    this._commentForm.getElement().replaceWith(newCommentForm.getElement());
    this._commentForm = newCommentForm;
  }

  _onRemoveComment(comment) {
    this._movie.comments = this._movie.comments.filter(
      ({ id }) => comment.id !== id
    );
    this._changeData();
  }

  _updateCommentsList() {
    this._movieDetails
      .getElement()
      .querySelector(`.film-details__comments-list`).innerHTML = ``;
    this._movie.comments.forEach(comment => {
      this._addComment(comment);
    });
    this._movieDetails
      .getElement()
      .querySelector(
        `.film-details__comments-count`
      ).innerHTML = `${this._movie.comments.length}`;
  }

  _updateRatingPanel() {
    const panelNode = this._movieRatingPanel.getElement();
    if (
      this._movie.isWatched &&
      panelNode.classList.contains(`visually-hidden`)
    ) {
      panelNode.classList.remove(`visually-hidden`);
    }
    if (
      !this._movie.isWatched &&
      !panelNode.classList.contains(`visually-hidden`)
    ) {
      panelNode.classList.add(`visually-hidden`);
    }
    if (!this._movie.isWatched) {
      this._resetPersonalRating();
    }
  }

  _resetPersonalRating() {
    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelectorAll(`input`)
      .forEach(input => (input.checked = false));
  }

  _onEscapeKeyDown(e) {
    // не выполняем код повторно, если событие уже запущено
    if (e.defaultPrevented) {
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      return;
    }
    e.preventDefault();

    if (e.key === `esc` || e.key === `Escape`) {
      this.hide();
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
