import {createCardTemplate} from "./card";

const renderList = (n) => {
  let template = ``;
  for (let i = 0; i < n; i++) {
    template += createCardTemplate();
  }
  return template;
};

export const createCardsListTemplate = (amountOfCArds) => `
    <div class="films-list__container">
        ${renderList(amountOfCArds)}
    </div>
`;
