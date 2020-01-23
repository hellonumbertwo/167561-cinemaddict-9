import { filtersList } from "./store/filters-list";
import { calculateStatistics } from "./store/statistics";
import { moviesList, SHOW_MOVIES_STEP } from "./store/movies-list";
import { render } from "./utils";
import Footer from "./components/footer";
import Search from "./components/search";
import Profile from "./components/profile";
import PageController from "./controllers/page-controller";

const statisticsData = calculateStatistics(moviesList);

const search = new Search();
const profile = new Profile(statisticsData);
const footer = new Footer(moviesList);
const pageController = new PageController(
  document.getElementById(`main`),
  moviesList,
  SHOW_MOVIES_STEP,
  filtersList,
  statisticsData
);

[search, profile].forEach(component =>
  render(document.getElementById(`header`), component.getElement(), `beforeend`)
);
render(document.getElementById(`main`), footer.getElement(), `afterend`);
pageController.init();
