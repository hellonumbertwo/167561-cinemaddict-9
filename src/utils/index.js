/**
 * Отрендерить элемент в DOM
 * @function
 * @param {HTMLElement} container - родительский контейнер
 * @param {HTMLElement} element - элемент, который нужно отрисовать
 * @param {string} place - позиция рендеринга
 */
export const render = (container, element, place) => {
  if (container) {
    switch (place) {
      case Positioning.AFTERBEGIN:
        container.prepend(element);
        break;
      case Positioning.BEFOREEND:
        container.append(element);
        break;
      case Positioning.AFTEREND:
        container.after(element);
        break;
    }
  }
};

/**
 * Удалить элемент из DOM
 * @function
 * @param {HTMLElement} element - элемент, который нужно удалить
 */
export const unrender = element => {
  if (element) {
    element.remove();
  }
};

/**
 * Создать элемент из template
 * @param {string} template - разметка
 * @return {HTMLElement} - элемент для отрисовки
 */
export const createElement = template => {
  const newTemplate = document.createElement(`template`);
  newTemplate.innerHTML = template;
  return newTemplate.content.firstElementChild;
};

/**
 * Разбивка списка фильмов по жанрам
 * @param {Array} list – список фильмов
 * @return {Object} – {genre: array}
 */
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

/**
 * форматировить продолжительность фильма
 * @param {Number} duration - продолжительность фильма в минутах
 * @return {String} – продолжительность в формате  `1h 36m`
 */
export const formatDurationFromMinutes = duration => {
  const hours = `${Math.trunc(duration / 60)}`;
  const minutes = `${duration % 60}`;
  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};

/**
 * получить уникальный id для пользователя
 * @function
 * @return {number} - возвращает уникальный id
 */
export const getUniqueID = () => {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2, 5)
  );
};

/**
 * получить ранг пользователя (по просмотренным фильмам)
 * @function
 * @param {Array} movies – список фильмов
 * @return {String}
 */
export const getUserRank = movies => {
  const watchedMoviesNumber = movies.filter(({ isWatched }) => !!isWatched)
    .length;
  switch (true) {
    case watchedMoviesNumber > 0 && watchedMoviesNumber <= 10:
      return `novice`;
    case watchedMoviesNumber > 10 && watchedMoviesNumber <= 20:
      return `fan`;
    case watchedMoviesNumber > 20:
      return `movie buff`;
    default:
      return null;
  }
};

/**
 * выбрать данные о статусе по имени
 * @function
 * @param {String} name
 * @return {Object}
 */
export const getStatusDataByName = name => {
  return Object.keys(Statuses).reduce((obj, key) => {
    if (Statuses[key].name === name) {
      obj = { ...Statuses[key] };
    }
    return obj;
  }, {});
};

/**
 * вернуть строку без знаков пунктуации
 * @function
 * @param {String} string
 * @return {String}
 */
export const removePunctuation = string => {
  return string.replace(/[^A-Za-zА-Яа-я0-9\s]/g, ``).replace(/\s{2,}/g, ` `);
};

/**
 * создает ошибку (ошибка которую получили с сервера)
 * @function
 * @param {Number} status
 * @param {String} message
 */
export function APIerror(status, message) {
  this.name = "APIerror";
  this.status = status;
  this.message = message;
  this.prototype = Object.create(Error.prototype);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
}

/**
 * получить отформатированное сообщение об ошибке
 * @function
 * @param {Object} error
 * @return {String}
 */
export const getErrorMessage = error => {
  const { message, errors } = error;
  if (!errors) {
    return message || `Oops, something went wrong!`;
  }
  const errorMessagesList = errors
    .map(({ fieldName, errorMessage }) => `${fieldName} ${errorMessage}`)
    .join(`, `);
  return `${message}: ${errorMessagesList}`
    .split(``)
    .map((char, index) => {
      if (index === 0) {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    })
    .join(``);
};

/**
 * создать delay на n милисекунд
 * @function
 * @param {Number} ms
 * @return {Promise}
 */
export const delay = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

// ENUMS_______________________

/**
 * Доступные фильтры по фильмам
 * @readonly
 * @enum {string}
 */
export const Filters = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`
};

/**
 * Доступные экраны приложения
 * @readonly
 * @enum {string}
 */
export const Screens = {
  STATISTICS: `Statistics`,
  FILMS: `Films`,
  SEARCH: `Search`
};

/**
 * Доступные значения для статуса фильма
 * @readonly
 * @enum {Object}
 */
export const Statuses = {
  WATCHED: {
    name: `watched`,
    text: `Already watched`,
    prop: `isWatched`
  },
  WATCHLIST: {
    name: `watchlist`,
    text: `Add to watchlist`,
    prop: `isInWatchList`
  },
  FAVORITE: {
    name: `favorite`,
    text: `Add to favorites`,
    prop: `isFavorite`
  }
};

/**
 * Позиция элемента внутри родителя при рендеринге в DOM
 * @readonly
 * @enum {string}
 */
export const Positioning = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`
};

// MOCS
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
