import {moviesList} from "./../store/movies-list";

export const createFooterTemplate = () => `
  <section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>${moviesList.length} movies inside</p>
  </section>
`;
