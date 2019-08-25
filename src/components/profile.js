export const createProfileTemplate = ({status}) => `
    <section class="header__profile profile">
        ${status ? `<p class="profile__rating">${status}</p>` : ``}
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
`;
