import {render} from "../../utils/index";
import Search from "./search";

export const renderSearch = (containerId) => {
  const search = new Search();

  render(containerId, search.getElement(), `beforeend`);
};
