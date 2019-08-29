import {moviesList} from "./store/movies-list";
import {statistics} from "./store/statistics";
import {filtersList} from "./store/filters-list";
import {render} from "./utils/index";

import {createSearchTemplate} from "./components/search";
import {createProfileTemplate} from "./components/profile";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {createContentTemplate} from "./components/content";
import {createstatisticsTemplate} from "./components/statistics";
import {createPopupTemplate} from "./components/movie/movie-details/movie-details";
import {createFooterTemplate} from "./components/footer";
import {showMoreMovies} from "./components/movies-list/handle-movies-list";

render(
    `header`,
    `
    ${createSearchTemplate()}
    ${createProfileTemplate(statistics)}
  `
);
render(
    `main`,
    `
    ${createFiltersTemplate(filtersList)}
    ${createstatisticsTemplate(statistics)}
    ${createSortingTemplate()}
    ${createContentTemplate(moviesList)}
    ${createPopupTemplate(moviesList[0])}
  `
);

render(`footer`, `${createFooterTemplate(moviesList)}`);

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
