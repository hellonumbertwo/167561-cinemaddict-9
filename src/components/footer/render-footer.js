import {render} from "../../utils";
import {moviesList} from "./../../store/movies-list";
import Footer from "./footer";

export const renderFooter = (containerId) => {
  const footer = new Footer(moviesList);

  render(containerId, footer.getElement(), `beforeend`);
};
