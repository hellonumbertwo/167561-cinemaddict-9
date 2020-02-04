import { moviesList } from "./store/movies-list";
import PageController from "./controllers/page-controller";
import api from "./api/index";

api.getMovies().then(movies => {
  const pageController = new PageController(
    document.getElementById(`main`),
    movies
  );
  pageController.init();
});
