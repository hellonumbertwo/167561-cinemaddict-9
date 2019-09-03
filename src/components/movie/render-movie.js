import Movie from "./movie";
import {render} from "../../utils";
import {renderMovieDetailsPopup} from "../movie-details-popup/render-movie-details";

export const renderMovie = (containerId, movie) => {
  const movieCard = new Movie(movie);

  movieCard.getElement().addEventListener(
      `click`,
      (e) => {
        if (
        // показать попап с доп информацией при клике на название, постер или кол-во комментаиев
          e.target.id === `movie-poster` ||
        e.target.id === `movie-title` ||
        e.target.id === `movie-comments-title`
        ) {
          renderMovieDetailsPopup(`main`, movie);
        }
      },
      false
  );
  render(containerId, movieCard.getElement(), `beforeend`);
};
