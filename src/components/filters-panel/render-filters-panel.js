import {render} from "../../utils";
import {filtersList} from "./../../store/filters-list";
import FiltersPanel from "./filters-panel";

export const renderFiltersPanel = (containerId) => {
  const filtersPanel = new FiltersPanel(filtersList);

  render(containerId, filtersPanel.getElement(), `beforeend`);
};
