import {SHOW_MOVIES_STEP, moviesList} from "./../../store/movies-list";
import {render} from "./../../utils/index";
import {createMovieTemplate} from "./../movie/movie";

const moviesListToShow = moviesList.slice(0, SHOW_MOVIES_STEP);

const updateMoviesList = () => {
  const moviesListContainer = document.getElementById(`movies-list`);
  const list = moviesListToShow.slice(moviesListContainer.children.length);
  render(
      `movies-list`,
      list.map((movie) => createMovieTemplate(movie)).join(``)
  );
  const loadButton = document.getElementById(`show-more`);
  if (!isMoreMoviesLeft() && loadButton) {
    loadButton.style.display = `none`;
  }
};

const showMoreMovies = () => {
  const moviesNumber = moviesListToShow.length + SHOW_MOVIES_STEP;
  moviesListToShow.push(
      ...moviesList.slice(moviesListToShow.length, moviesNumber)
  );
  updateMoviesList();
};

const isMoreMoviesLeft = () => {
  return moviesListToShow.length < moviesList.length;
};

export {moviesListToShow, showMoreMovies};
