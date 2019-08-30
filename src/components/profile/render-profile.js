import {render} from "../../utils";
import {statistics} from "./../../store/statistics";
import Profile from "./profile";

export const renderProfile = (containerId) => {
  const profile = new Profile(statistics);

  render(containerId, profile.getElement(), `beforeend`);
};
