import {createMoviesListTemplate} from "./movies-list/movies-list";
import {createShowMoreButtonTemplate} from "./show-more-button";
import {moviesListToShow} from "./movies-list/handle-movies-list";

export const createContentTemplate = (moviesList) => {
  const topRatedMoviesList = moviesList
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 2);

  const mostCommentedMoviesList = moviesList
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 2);

  return `
    <section class="films">
        <section class="films-list">
            ${createMoviesListTemplate(moviesListToShow)}
            ${createShowMoreButtonTemplate()}
        </section>
        ${topRatedMoviesList.length ? `` : ``}
        <section class="films-list--extra"
        ${topRatedMoviesList.length ? `` : `style="display: none"`}>
            <h2 class="films-list__title">Top rated</h2>
            ${createMoviesListTemplate(topRatedMoviesList)}
        </section>
        <section class="films-list--extra"
        ${mostCommentedMoviesList.length ? `` : `style="display: none"`}>
            <h2 class="films-list__title">Most commented</h2>
            ${createMoviesListTemplate(mostCommentedMoviesList)}
        </section>
    </section>
  `;
};
