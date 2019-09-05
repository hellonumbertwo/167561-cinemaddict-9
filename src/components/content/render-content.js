import {moviesList, SHOW_MOVIES_STEP} from "./../../store/movies-list";
import {render} from "../../utils";
import Content from "./content";
import ShowMoreButton from "./../show-more-button";
import {renderMovie} from "../movie/render-movie";

const renderMoviesListByChunks = (showMoviesStep, movies, containerId) => {
  const container = document.getElementById(containerId);
  const numberMoviesToShow = container.children.length + showMoviesStep;

  movies
    .slice(container.children.length, numberMoviesToShow)
    .forEach((movie) => renderMovie(containerId, movie));
};

const getIsMoreMoviesLeft = (fullList, containerId) => {
  return document.getElementById(containerId).children.length < fullList.length;
};

export const renderContent = (containerId) => {
  const content = new Content();
  const showMoreButton = new ShowMoreButton();

  const topRatedMoviesList = moviesList
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 2);
  const mostCommentedMoviesList = moviesList
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 2);

  showMoreButton.getElement().addEventListener(
      `click`,
      () => {
        renderMoviesListByChunks(SHOW_MOVIES_STEP, moviesList, `movies-list`);
        if (!getIsMoreMoviesLeft(moviesList, `movies-list`)) {
          showMoreButton.getElement().style.display = `none`;
        }
      },
      false
  );

  render(containerId, content.getElement(), `beforeend`);
  render(`movies-list`, showMoreButton.getElement(), `afterend`);
  renderMoviesListByChunks(SHOW_MOVIES_STEP, moviesList, `movies-list`);

  topRatedMoviesList.forEach((movie) => {
    renderMovie(`most-rated-movies-list`, movie);
  });
  mostCommentedMoviesList.forEach((movie) => {
    renderMovie(`most-commented-movies-list`, movie);
  });
};
