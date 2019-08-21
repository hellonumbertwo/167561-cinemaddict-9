import {createCardsListTemplate} from "./cardsList";
import {createShowMoreButtonTemplate} from "./show-more-button";

export const createContentTemplate = (moviesList) => {
  const topRatedMoviesList = moviesList
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 2);

  const mostCommentedMoviesList = moviesList.sort(
      (a, b) => b.commentsAmount - a.commentsAmount
  );

  return `
    <section class="films">
        <section class="films-list">
            ${createCardsListTemplate(moviesList)}
            ${createShowMoreButtonTemplate()}
        </section>
        <section class="films-list--extra">
            <h2 class="films-list__title">Top rated</h2>
            ${createCardsListTemplate(topRatedMoviesList)}
        </section>
        <section class="films-list--extra">
            <h2 class="films-list__title">Most commented</h2>
            ${createCardsListTemplate(mostCommentedMoviesList)}
        </section>
    </section>
  `;
};
