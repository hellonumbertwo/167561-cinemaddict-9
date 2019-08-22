import {createCardsListTemplate} from "./cardsList";
import {createShowMoreButtonTemplate} from "./show-more-button";
/* TODO: изначально выводится 5 карточек фильмов, затем выводим по 5 или оставгиеся, кнопка скрывается, когда фильмы закончились*/

export const createContentTemplate = (moviesList) => {
  /* TODO: topRated list не отображается, если у всех фильмов рейтинг равен нулю, если у всех фильмов одинаковый рейтинг, то берутся два случайных фильма */
  const topRatedMoviesList = moviesList
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 2);
  /* TODO: mostCommented list не отображается, если у всех фильмов нет комменариев, если у всех фильсмоы одинаковое количество комментариев, то берется два случайных */
  const mostCommentedMoviesList = moviesList
    .sort((a, b) => b.commentsAmount - a.commentsAmount)
    .slice(0, 2);

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
