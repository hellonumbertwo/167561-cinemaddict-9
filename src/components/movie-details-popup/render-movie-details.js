import {render} from "../../utils";
import MovieDetailsPopup from "./movie-details-popup";
import MovieInfo from "./movie-info";
import ControlsPanel from "./controls-panel";
import {renderComment} from "./../comment/render-comment";
import CommentForm from "./comment-form";

export const renderMovieDetailsPopup = (containerId, movie) => {
  const movieDetailsPopup = new MovieDetailsPopup(movie);
  const movieInfo = new MovieInfo(movie);
  const controlsPanel = new ControlsPanel(movie);
  const commentForm = new CommentForm();

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
  render(`movie-info-top-container`, movieInfo.getElement(), `beforeend`);
  if (movie.isWatched) {
    render(`movie-info-top-container`, controlsPanel.getElement(), `beforeend`);
  }

  movie.comments.forEach((comment) => {
    renderComment(`movie-details-comments`, comment);
  });
  render(`movie-info-bottom-container`, commentForm.getElement(), `beforeend`);
};
