import {formatDuration} from "./../../utils/index";

const getDescription = (string) => {
  const maxStringLength = 140;
  if (string.length > maxStringLength) {
    return string.slice(0, maxStringLength) + `...`;
  }
  return string;
};

export const createMovieTemplate = ({
  title,
  poster,
  rate,
  duration,
  description,
  genresList,
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
            <span class="film-card__duration">${
  formatDuration(duration).hours
}h ${formatDuration(duration).minutes}m</span>
            <span class="film-card__genre">${genresList.join(`, `)}</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${getDescription(description)}</p>
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
