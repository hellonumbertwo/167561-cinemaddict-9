import { moviesList } from "./movies-list";

const createFilters = movies => {
  return [
    {
      name: `All movies`,
      amount: null
    },
    {
      name: `Watchlist`,
      amount: movies.filter(movie => movie.isInWatchList).length
    },
    {
      name: `History`,
      amount: movies.filter(movie => movie.isWatched).length
    },
    {
      name: `Favorites`,
      amount: movies.filter(movie => movie.isFavorite).length
    }
  ];
};

const filtersList = createFilters(moviesList);

export { filtersList };
