import { moviesList } from "./store/movies-list";
import PageController from "./controllers/page-controller";

const pageController = new PageController(
  document.getElementById(`main`),
  moviesList
);
pageController.init();
