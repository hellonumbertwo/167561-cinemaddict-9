export const createFooterTemplate = (moviesList) => `
  <section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>${moviesList.length} movies inside</p>
  </section>
`;
