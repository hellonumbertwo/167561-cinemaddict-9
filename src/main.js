import {renderContent} from "./components/content/render-content";
import Footer from "./components/footer";

import FiltersPanel from "./components/filters-panel";
import Statistics from "./components/statistics";

import {statistics} from "./store/statistics";
import {filtersList} from "./store/filters-list";
import {moviesList} from "./store/movies-list";
import Search from "./components/search";
import Profile from "./components/profile";
import Sorting from "./components/sorting";
import {render} from "./utils";

const search = new Search();
const profile = new Profile(statistics);
const statisticsPanel = new Statistics(statistics);
const filtersPanel = new FiltersPanel(filtersList);
const sorting = new Sorting();
const footer = new Footer(moviesList);

[search, profile].forEach((component) =>
  render(`header`, component.getElement(), `beforeend`)
);
[statisticsPanel, filtersPanel, sorting].forEach((component) =>
  render(`main`, component.getElement(), `beforeend`)
);
renderContent(`main`);
render(`main`, footer.getElement(), `afterend`);
