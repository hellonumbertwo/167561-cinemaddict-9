export const createCardTemplate = ({
  title,
  poster,
  rate,
  runtime,
  description,
  genre,
  isInWatchList,
  isWatched,
  isFavorite,
  comments,
  releaseDate
}) => `
    <article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rate}</p>
        <p class="film-card__info">
            <span class="film-card__year">${releaseDate.getFullYear()}</span>
            <span class="film-card__duration">${runtime}</span>
            <span class="film-card__genre">${genre}</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${
  isInWatchList ? `film-card__controls-item--active` : ``
}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${
  isWatched ? `film-card__controls-item--active` : ``
}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${
  isFavorite ? `film-card__controls-item--active` : ``
}">Mark as favorite</button>
        </form>
    </article>
`;
