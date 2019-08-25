import {moviesList} from "./movies-list";

const createFilters = () => {
  return [
    {
      name: `All movies`,
      amount: null
    },
    {
      name: `Watchlist`,
      amount: moviesList.filter((movie) => movie.isInWatchList).length
    },
    {
      name: `History`,
      amount: moviesList.filter((movie) => movie.isWatched).length
    },
    {
      name: `Favorites`,
      amount: moviesList.filter((movie) => movie.isFavorite).length
    }
  ];
};

export default createFilters();
