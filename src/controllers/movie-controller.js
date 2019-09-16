import {render} from "../utils";
import MoviePreview from "../components/movie-preview";
import MovieDetailsController from "./movie-details-controller";

export default class MovieController {
  constructor(container, movie, onDataChange) {
    this._container = container;
    this._movie = movie;
    this._onDataChange = onDataChange;
    this._elementToBeUpdated = null;
    this._subscriptions = [];
  }
  init() {
    this._moviePreview = new MoviePreview(this._movie);

    /** Показать попап с доп информацией при клике на название, постер или кол-во комментариев
     * @param {event} e
     */
    const showMovieDetails = (e) => {
      if (
        e.target.id === `movie-poster` ||
        e.target.id === `movie-title` ||
        e.target.id === `movie-comments-title`
      ) {
        this._onChangeView();
        const movieDetailsController = new MovieDetailsController(
            this._container,
            this._movie,
            this._onDataChangeFromDetails.bind(this)
        );
        movieDetailsController.init();
        this._subscriptions.push(
            movieDetailsController.setDefaultView.bind(movieDetailsController)
        );
      }
    };

    this._moviePreview
      .getElement()
      .addEventListener(`click`, showMovieDetails, false);

    // либо обновляем карточку либо рендерим новую
    if (this._elementToBeUpdated) {
      this._updateMovieNode();
    } else {
      render(this._container, this._moviePreview.getElement(), `beforeend`);
    }
    this._changeMovieDataFromPreview();
  }

  _updateMovieData() {
    this._elementToBeUpdated = this._moviePreview.getElement();
    // TODO: может сделать отдельный метод для обновления node
    this.init();
  }

  // обновляем карточку фильма в DOM
  _updateMovieNode() {
    this._moviePreview.getElement().className = this._elementToBeUpdated.classList.toString();
    this._container.replaceChild(
        this._moviePreview.getElement(),
        this._elementToBeUpdated
    );
  }

  _changeMovieDataFromPreview() {
    const formElement = this._moviePreview
      .getElement()
      .querySelector(`.film-card__controls`);

    formElement.addEventListener(
        `click`,
        (e) => {
          e.preventDefault();
          const status = [e.target.dataset.status];
          this._onDataChange(
              {[status]: !this._movie[e.target.dataset.status]},
              this._movie.id,
              this._updateMovieData.bind(this)
          );
        },
        false
    );
  }

  _onDataChangeFromDetails(entry) {
    this._onDataChange(entry, this._movie.id, this._updateMovieData.bind(this));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
