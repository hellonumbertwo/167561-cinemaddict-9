import {moviesList} from "./movies-list";

const watchedMoviesNumber = (movies) =>
  movies.filter((movie) => movie.isWatched).length;

/** возращает самые популярные жанры пользователя (один или несколько жанров, если у них одинаковый счет).
 * @param {array} movies – список фильмов в сервисе
 * @return {string} – строка с перечнем жанров*/
const getFavoriteGenre = (movies) => {
  const genresStats = movies
    .filter((movie) => !!movie.isFavorite)
    .map(({genresList}) => genresList)
    .flat()
    .reduce((obj, genre) => {
      obj[genre] = obj[genre] ? ++obj[genre] : 1;
      return obj;
    }, {});

  const bestScore = Object.values(genresStats).reduce((max, num) =>
    max > num ? max : num
  );

  return Object.keys(genresStats)
    .reduce((list, genre) => {
      if (genresStats[genre] === bestScore) {
        list.push(genre);
      }
      return list;
    }, [])
    .join(`, `);
};

const getTotalDuration = (movies) =>
  movies.reduce((sum, {isWatched, duration}) => {
    if (isWatched) {
      sum += duration;
    }
    return sum;
  }, 0);

const getStatus = (movies) => {
  const score = watchedMoviesNumber(movies);
  switch (true) {
    case score === 0:
      return null;
    case score >= 1 && score <= 10:
      return `novice`;
    case score >= 11 && score <= 20:
      return `fan`;
    default:
      return `movie buff`;
  }
};

export const statistics = {
  watchedMoviesNumber: watchedMoviesNumber(moviesList),
  status: getStatus(moviesList),
  totalDuration: getTotalDuration(moviesList),
  favoriteGenre: getFavoriteGenre(moviesList)
};
