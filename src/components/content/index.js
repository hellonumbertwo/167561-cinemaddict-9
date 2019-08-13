import {createCardsListTemplate} from "./cardsList";
import {createCardTemplate} from "./card";
import {createShowMoreButtonTemplate} from "./show-more-button";

const cardsList = `
    ${createCardTemplate()}
    ${createCardTemplate()}
    ${createCardTemplate()}
    ${createCardTemplate()}
    ${createCardTemplate()}
`;

const extraCardsList = `
    ${createCardTemplate()}
    ${createCardTemplate()}
`;

export const createContentTemplate = () => `
    <section class="films">
        <section class="films-list">
            ${createCardsListTemplate(cardsList)}
            ${createShowMoreButtonTemplate()}
        </section>
        <section class="films-list--extra">
            <h2 class="films-list__title">Top rated</h2>
            ${createCardsListTemplate(extraCardsList)}
        </section>
        <section class="films-list--extra">
            <h2 class="films-list__title">Most commented</h2>
            ${createCardsListTemplate(extraCardsList)}
        </section>
    </section>
`;
