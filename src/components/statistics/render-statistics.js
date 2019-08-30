import {statistics} from "./../../store/statistics";
import {render} from "../../utils";
import Statistics from "./statistics";

export const renderStatistics = (containerId) => {
  const statisticsPanel = new Statistics(statistics);

  render(containerId, statisticsPanel.getElement(), `beforeend`);
};
