import {createSearchTemplate} from "./components/search";
import {createProfileTemplate} from "./components/profile";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {createContentTemplate} from "./components/content";
import {createStatysticsTemplate} from "./components/statystics";
import {createPopupTemplate} from "./components/movie/movie-details/movie-details";
import {createFooterTemplate} from "./components/footer";
import {moviesList} from "./store/movies-list";
import {statystics} from "./store/statystics";
import {render} from "./utils/index";
import {showMoreMovies} from "./components/movies-list/handle-movies-list";

render(
    `header`,
    `
    ${createSearchTemplate()}
    ${createProfileTemplate(statystics)}
  `
);
render(
    `main`,
    `
    ${createFiltersTemplate()}
    ${createStatysticsTemplate(statystics)}
    ${createSortingTemplate()}
    ${createContentTemplate(moviesList)}
    ${createPopupTemplate(moviesList[0])}
  `
);

render(`footer`, `${createFooterTemplate()}`);

const showMoreButton = document.getElementById(`show-more`);
if (showMoreButton) {
  showMoreButton.addEventListener(
      `click`,
      function () {
        showMoreMovies();
      },
      false
  );
}
