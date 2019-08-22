import {createSearchTemplate} from "./components/search";
import {createProfileTemplate} from "./components/profile";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {createContentTemplate} from "./components/content/index";
import {createStatysticsTemplate} from "./components/statystics";
import {createPopupTemplate} from "./components/film-details/index";
import moviesList from "./store/movies";

/* TODO: удалить*/
console.log(moviesList);

const render = (container, component) => {
  container.insertAdjacentHTML(`beforeend`, component);
};

const header = document.querySelector(`#header`);
const main = document.querySelector(`#main`);

render(
    header,
    `
      ${createSearchTemplate()}
      ${createProfileTemplate()}
    `
);
render(
    main,
    `
      ${createFiltersTemplate()}
      ${createStatysticsTemplate()}
      ${createSortingTemplate()}
      ${createContentTemplate(moviesList)}
      ${createPopupTemplate(moviesList[0])}
    `
);
