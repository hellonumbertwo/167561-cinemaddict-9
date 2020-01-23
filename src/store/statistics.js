/** возращает самые популярные жанры пользователя (один или несколько жанров, если у них одинаковый счет).
 * @param {array} movies – список фильмов в сервисе
 * @return {string} – строка с перечнем жанров*/
const getFavoriteGenre = movies => {
  const genresStats = movies
    .filter(movie => !!movie.isFavorite)
    .map(({ genresList }) => genresList)
    .flat()
    .reduce((obj, genre) => {
      obj[genre] = obj[genre] ? obj[genre] + 1 : 1;
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

const getStatus = watchedMoviesNumber => {
  switch (true) {
    case watchedMoviesNumber === 0:
      return null;
    case watchedMoviesNumber >= 1 && watchedMoviesNumber <= 10:
      return `novice`;
    case watchedMoviesNumber >= 11 && watchedMoviesNumber <= 20:
      return `fan`;
    default:
      return `movie buff`;
  }
};

export const calculateStatistics = movies => {
  const watchedMoviesNumber = movies.filter(movie => movie.isWatched).length;
  const status = getStatus(watchedMoviesNumber);
  const totalDuration = movies.reduce((sum, { isWatched, duration }) => {
    if (isWatched) {
      sum += duration;
    }
    return sum;
  }, 0);
  const favoriteGenre = getFavoriteGenre(movies);

  return {
    watchedMoviesNumber,
    status,
    totalDuration,
    favoriteGenre
  };
};
