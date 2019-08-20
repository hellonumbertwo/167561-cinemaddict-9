import {createCardTemplate} from "./card";

export const createCardsListTemplate = (cardsList) => `
    <div class="films-list__container">
        ${cardsList.map((card) => createCardTemplate(card)).join(``)}
    </div>
`;
