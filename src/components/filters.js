import filtersList from "./../store/filters-list";

export const createFiltersTemplate = () => `
    <nav class="main-navigation">
      ${filtersList
        .map(
            ({name, amount}) => `
        <a href="#watchlist" class="main-navigation__item">
        ${name}
        ${
  amount
    ? `<span class="main-navigation__item-count">${amount}</span>`
    : ``
}</a>
      `
        )
        .join(``)}
    </nav>
`;
