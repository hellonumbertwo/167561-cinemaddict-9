import {createCardsListTemplate} from "./cardsList";
import {createShowMoreButtonTemplate} from "./show-more-button";

export const createContentTemplate = () => `
    <section class="films">
        <section class="films-list">
            ${createCardsListTemplate(5)}
            ${createShowMoreButtonTemplate()}
        </section>
        <section class="films-list--extra">
            <h2 class="films-list__title">Top rated</h2>
            ${createCardsListTemplate(2)}
        </section>
        <section class="films-list--extra">
            <h2 class="films-list__title">Most commented</h2>
            ${createCardsListTemplate(2)}
        </section>
    </section>
`;
