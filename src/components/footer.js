import AbstractComponent from "./abstract-component";

export default class Footer extends AbstractComponent {
  constructor(moviesList) {
    super();
    this._moviesList = moviesList;
  }
  getTemplate() {
    return `
      <footer class="footer">
        <section class="footer__logo logo logo--smaller">Cinemaddict</section>
        <section class="footer__statistics">
          <p>${this._moviesList.length} movies inside</p>
        </section>
      </footer>
    `;
  }
}
