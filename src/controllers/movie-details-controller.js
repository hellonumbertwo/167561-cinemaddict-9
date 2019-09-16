import {render, unrender} from "./../utils/index";
import MovieDetails from "../components/movie-details";
import MovieInfo from "../components/movie-info";
import MovieStatusPanel from "../components/movie-status-panel";
import MovieRatingPanel from "../components/movie-rating-panel";
import CommentForm from "../components/comment-form";
import Comment from "./../components/comment";

export default class movieDetailsController {
  constructor(container, movie, onDataChangeFromDetails) {
    this._container = container;
    this._movie = movie;
    this._onDataChange = onDataChangeFromDetails;

    this._movieDetails = new MovieDetails(movie);
    this._movieInfo = new MovieInfo(movie);
    this._movieStatusPanel = new MovieStatusPanel(movie);
    this._movieRatingPanel = new MovieRatingPanel(movie);
    this._commentForm = new CommentForm();

    this._toggleMovieRatingPanelElement();
  }

  init() {
    this._renderMovieDetails();
    this._setEventListeners();
    this._changeMovieStatusProcess();
    this._addCommentProcess();
  }

  setDefaultView() {
    if (document.body.contains(this._movieDetails.getElement())) {
      unrender(this._movieDetails.getElement());
      this._movieDetails.removeElement();
    }
  }

  _renderMovieDetails() {
    render(
        document.getElementById(`main`),
        this._movieDetails.getElement(),
        `beforeend`
    );

    [this._movieInfo, this._movieStatusPanel].forEach((component) => {
      render(
          this._movieDetails
          .getElement()
          .querySelector(`.form-details__top-container`),
          component.getElement(),
          `beforeend`
      );
    });

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

  _setEventListeners() {
    const closeMovieDetails = () => {
      this._movieDetails.removeElement();
    };

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
  }

  _toggleMovieRatingPanelElement() {
    const toggleHidingClass = (condition, element) => {
      if (condition && element.classList.contains(`visually-hidden`)) {
        element.classList.remove(`visually-hidden`);
        return;
      }
      if (!element.classList.contains(`visually-hidden`)) {
        element.classList.add(`visually-hidden`);
      }
    };

    const renderRatingPanel = () => {
      render(
          this._movieDetails
          .getElement()
          .querySelector(`.form-details__middle-container`),
          this._movieRatingPanel.getElement(),
          `beforeend`
      );
    };

    if (this._movie.isWatched) {
      renderRatingPanel();
    }

    this._movieStatusPanel
      .getElement()
      .querySelector(`#watched`)
      .addEventListener(
          `change`,
          (e) => {
            if (
              this._movieDetails
              .getElement()
              .contains(this._movieRatingPanel.getElement())
            ) {
              toggleHidingClass(
                  e.target.checked,
                  this._movieRatingPanel.getElement()
              );
              return;
            }
            renderRatingPanel();
          },
          false
      );
  }

  _addCommentProcess() {
    const commentTextarea = this._movieDetails
      .getElement()
      .querySelector(`textarea`);

    commentTextarea.addEventListener(`keydown`, (e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
        const formData = this._getFormData();
        const entry = {
          comments: [
            ...this._movie.comments,
            {
              emoji: `${formData.get(`comment-emoji`)}.png`,
              author: `User`,
              text: formData.get(`comment`),
              date: new Date()
            }
          ]
        };
        this._onDataChange(entry);
      }
    });
  }

  _changeMovieStatusProcess() {
    const statusPanel = this._movieDetails
      .getElement()
      .querySelector(`.film-details__controls`);

    statusPanel.addEventListener(`change`, () => {
      const formData = this._getFormData();
      const entry = {
        isWatched: !!formData.get(`watched`),
        isInWatchList: !!formData.get(`watchlist`),
        isFavorite: !!formData.get(`favorite`)
      };
      this._onDataChange(entry);
    });
  }

  _getFormData() {
    const form = this._movieDetails.getElement().querySelector(`form`);
    return new FormData(form);
  }
}
