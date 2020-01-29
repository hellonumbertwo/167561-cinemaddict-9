import AbstractComponent from "./abstract-component";

export default class Profile extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return `
      <section class="header__profile profile">
        <p class="profile__rating">Status</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>
    `;
  }
}
