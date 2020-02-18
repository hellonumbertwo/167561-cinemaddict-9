import PageController from "./controllers/page-controller";
import api from "./api/index";
import { render, unrender, createElement, Positioning } from "./utils";

const Loader = createElement(`
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title">
      The movies you won't see anywhere else</h2>
      <div class="no-result">
        Loading...
      </div>
    </section>
  </section>
`);

const Error = message =>
  createElement(`
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title">
      ${message}</h2>
    </section>
  </section>
`);

render(document.getElementById(`main`), Loader, Positioning.BEFOREEND);
api
  .getMovies()
  .then(movies => {
    unrender(Loader);
    const pageController = new PageController(
      document.getElementById(`main`),
      movies
    );
    pageController.init();
  })
  .catch(({ message }) => {
    render(
      document.getElementById(`main`),
      Error(message),
      Positioning.BEFOREEND
    );
  })
  .finally(() => {
    unrender(Loader);
  });
