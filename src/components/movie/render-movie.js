import Movie from "./movie";
import {render} from "../../utils";
import {renderMovieDetailsPopup} from "../movie-details-popup/render-movie-details";

export const renderMovie = (containerId, movie) => {
  const movieCard = new Movie(movie);

  /** Показать попап с доп информацией при клике на название, постер или кол-во комментариев
   * @param {event} e
   * @listens click
   */
  const showMovieDetails = (e) => {
    if (
      e.target.id === `movie-poster` ||
      e.target.id === `movie-title` ||
      e.target.id === `movie-comments-title`
    ) {
      renderMovieDetailsPopup(`main`, movie);
    }
  };

  movieCard.getElement().addEventListener(`click`, showMovieDetails, false);
  render(containerId, movieCard.getElement(), `beforeend`);
};
