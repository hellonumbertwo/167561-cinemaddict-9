import {render} from "../../utils";
import MovieDetailsPopup from "./movie-details-popup";
import MovieInfo from "./movie-info";
import ControlsPanel from "./controls-panel";
import CommentForm from "./comment-form";
import Comment from "../comment";
import RatePanel from "./rate-panel";

export const renderMovieDetailsPopup = (containerId, movie) => {
  const movieDetailsPopup = new MovieDetailsPopup(movie);
  const movieInfo = new MovieInfo(movie);
  const controlsPanel = new ControlsPanel(movie);
  const commentForm = new CommentForm();
  const ratePanel = new RatePanel(movie);

  const onEscKeyDown = (e) => {
    if (e.key === `esc` || e.key === `Escape`) {
      movieDetailsPopup.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  movieDetailsPopup
    .getElement()
    .querySelector(`#close-details-button`)
    .addEventListener(
        `click`,
        () => {
          movieDetailsPopup.removeElement();
        },
        false
    );

  document.addEventListener(`keydown`, onEscKeyDown);

  render(containerId, movieDetailsPopup.getElement(), `beforeend`);

  [movieInfo, controlsPanel].forEach((component) => {
    render(`film-details-top-container`, component.getElement(), `beforeend`);
  });
  if (movie.isWatched) {
    render(
        `film-details-middle-container`,
        ratePanel.getElement(),
        `beforeend`
    );
  }

  movie.comments.forEach((comment) => {
    const commentBlock = new Comment(comment);
    render(`film-details-comments`, commentBlock.getElement(), `beforeend`);
  });
  render(
      `film-details-bottom-container`,
      commentForm.getElement(),
      `beforeend`
  );
};
