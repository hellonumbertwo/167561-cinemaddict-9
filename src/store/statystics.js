import moviesList from "./movies";

const getFavoriteGenre = () => {
  const genresStats = moviesList
    .filter((movie) => !!movie.isFavorite)
    .map(({genre}) => genre)
    .reduce((obj, genre) => {
      obj[genre] = obj[genre] + 1 || 1;
      return obj;
    }, {});

  const bestScore = Object.values(genresStats).reduce((max, num) =>
    max > num ? max : num
  );

  // возвращает несколько жанров, если у них одинаковый счет
  return Object.keys(genresStats)
    .reduce((list, genre) => {
      if (genresStats[genre] === bestScore) {
        list.push(genre);
      }
      return list;
    }, [])
    .join(`, `);
};

const getTotalDuration = () =>
  moviesList.reduce((sum, {isWatched, runtime}) => {
    if (isWatched) {
      sum += runtime;
    }
    return sum;
  }, 0);

export const statystics = {
  watchedMoviesNumber: moviesList.filter((movie) => movie.isWatched).length,
  get status() {
    switch (true) {
      case this.watchedMoviesNumber === 0:
        return null;
      case this.watchedMoviesNumber >= 1 && this.watchedMoviesNumber <= 10:
        return `novice`;
      case this.watchedMoviesNumber >= 11 && this.watchedMoviesNumber <= 20:
        return `fan`;
      default:
        return `movie buff`;
    }
  },
  totalDuration: getTotalDuration(),
  favoriteGenre: getFavoriteGenre()
};
