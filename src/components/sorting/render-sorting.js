import Sorting from "./sorting";
import {render} from "../../utils";

export const renderSorting = (containerId) => {
  const sorting = new Sorting();

  render(containerId, sorting.getElement(), `baforeend`);
};
