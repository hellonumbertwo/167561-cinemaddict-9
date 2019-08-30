import {renderSearch} from "./components/search/render-search";
import {renderProfile} from "./components/profile/render-profile";
import {renderFiltersPanel} from "./components/filters-panel/render-filters-panel";
import {renderStatistics} from "./components/statistics/render-statistics";
import {renderSorting} from "./components/sorting/render-sorting";
import {renderFooter} from "./components/footer/render-footer";
import {renderContent} from "./components/content/render-content";

renderSearch(`header`);
renderProfile(`header`);

renderFiltersPanel(`main`);
renderStatistics(`main`);
renderSorting(`main`);
renderContent(`main`);

renderFooter(`footer`);
