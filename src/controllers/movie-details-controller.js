import { render } from "./../utils/index";
import MovieDetails from "../components/movie-details";
import MovieInfo from "../components/movie-info";
import MovieStatusPanel from "../components/movie-status-panel";
import MovieRatingPanel from "../components/movie-rating-panel";
import CommentsListController from "./comments-list-controller";

export default class MovieDetailsController {
  constructor(container, movie, onDataChange) {
    this._container = container;
    this._movie = movie;
    this._onDataChange = onDataChange;
    this._comments = [];
    this._onDataChangeSubscriptions = [];

    this.hide = this.hide.bind(this);
    this._onEscapeKeyDown = this._onEscapeKeyDown.bind(this);
    this._onCommentInputFocus = this._onCommentInputFocus.bind(this);
    this._onCommentInputBlur = this._onCommentInputBlur.bind(this);
  }

  init() {
    this._movieDetails = new MovieDetails(this._movie);
    this._movieInfo = new MovieInfo(this._movie);
    this._movieStatusPanel = new MovieStatusPanel(this._movie);
    this._movieRatingPanel = new MovieRatingPanel(this._movie);
    this._commentsListController = new CommentsListController(
      this._movieDetails.getElement(),
      this._movie,
      this._onDataChange,
      this._onCommentInputFocus,
      this._onCommentInputBlur
    );
    this._onDataChangeSubscriptions = [];
  }

  show() {
    this._renderMoviedDtails();
    this._addEventListeners();
    this._commentsListController.init();
    this._onDataChangeSubscriptions.push(
      this._commentsListController._updateCommentsList.bind(
        this._commentsListController
      )
    );
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
  }

  _changeData() {
    const form = this._movieDetails
      .getElement()
      .querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    const entry = {
      isInWatchList: Boolean(formData.get(`watchlist`)),
      isWatched: Boolean(formData.get(`watched`)),
      isFavorite: Boolean(formData.get(`favorite`)),
      personalRate: parseInt(formData.get(`score`), 10) || 0
    };

    return this._onDataChange({ ...this._movie, ...entry });
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
      if (e.target.name === `watched`) {
        this._changePersonalRating();
      } else {
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
        this._changePersonalRating();
      });

    document.addEventListener(`keydown`, this._onEscapeKeyDown);
  }

  _updateMovieData(movie) {
    if (movie === this._movie) {
      return;
    }
    this._movie = movie;

    this._updateRatingPanel();
    this._onDataChangeSubscriptions.forEach(subscription => {
      if (!(subscription instanceof Function)) {
        return;
      }
      subscription();
    });
  }

  _setRatingPanelDisableStatus(status) {
    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelectorAll(`input`)
      .forEach(input => (input.disabled = status));
    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__watched-reset`).disabled = status;
  }

  _changePersonalRating() {
    this._setRatingPanelDisableStatus(true);
    this._changeData()
      .then(() => {
        this._resetPersonalRateForm();
      })
      .finally(() => {
        this._setRatingPanelDisableStatus(false);
      });
  }

  _resetPersonalRateForm() {
    this._movieRatingPanel
      .getElement()
      .querySelector(`.film-details__user-rating-score`)
      .querySelectorAll(`input`)
      .forEach(input => (input.checked = false));
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
      this._resetPersonalRateForm();
    }
  }

  _onCommentInputFocus() {
    document.removeEventListener(`keydown`, this._onEscapeKeyDown);
  }

  _onCommentInputBlur() {
    document.addEventListener(`keydown`, this._onEscapeKeyDown);
  }

  _onEscapeKeyDown(e) {
    // не выполняем код повторно, если событие уже запущено
    if (e.defaultPrevented) {
      document.removeEventListener(`keydown`, this._onEscapeKeyDown);
      return;
    }
    e.preventDefault();

    if (e.key === `esc` || e.key === `Escape`) {
      this.hide();
    }
    document.removeEventListener(`keydown`, this._onEscapeKeyDown);
  }
}
