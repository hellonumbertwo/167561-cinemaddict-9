import moment from "moment";

export const render = (container, element, place) => {
  if (container) {
    switch (place) {
      case `afterbegin`:
        container.prepend(element);
        break;
      case `beforeend`:
        container.append(element);
        break;
      case `afterend`:
        container.after(element);
        break;
    }
  }
};

export const unrender = element => {
  if (element) {
    element.remove();
  }
};

export const createElement = template => {
  const newTemplate = document.createElement(`template`);
  newTemplate.innerHTML = template;
  return newTemplate.content.firstElementChild;
};

export const formatDuration = ms => {
  return `${moment.duration(ms).hours()}h ${moment.duration(ms).minutes()}m`;
};

export const getMoviesDataByFilters = list => {
  const getMoviesListByFilter = filter => {
    switch (filter) {
      case Filters.ALL:
        return list;
      case Filters.WATCHLIST:
        return list.filter(({ isInWatchList }) => !!isInWatchList);
      case Filters.HISTORY:
        return list.filter(({ isWatched }) => !!isWatched);
      case Filters.FAVORITES:
        return list.filter(({ isFavorite }) => !!isFavorite);
    }
    return list;
  };

  return Object.values(Filters).reduce((acc, filter) => {
    acc[filter] = getMoviesListByFilter(filter);
    return acc;
  }, {});
};

export const formatDurationFromMinutes = duration => {
  const hours = `${Math.trunc(duration / 60)}`;
  const minutes = `${duration % 60}`;
  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};

/**
 * @function
 * @return {number} - возыращает уникальный id
 */
export const getUniqueID = () => {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 5)
  );
};

// ENUMS
export const Filters = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

export const Screens = {
  STATISTICS: `Statistics`,
  FILMS: `Films`,
  SEARCH: `Search`
};

// Mocs
export const getFishText = () =>
  [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ]
    .sort(() => Math.random() - Math.random())
    .slice(0, Math.ceil(Math.random() * 3))
    .join(` `);

export const getRandomDate = startDate => {
  const from = new Date(startDate).getTime();
  const to = Date.now();
  return new Date(from + Math.random() * (to - from));
};

export const getRandomArrayItem = array => {
  return array[Math.floor(Math.random() * array.length)];
};
