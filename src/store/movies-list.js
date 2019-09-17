import {createCommentsList} from "./comments-list";

import {
  getRandomDate as getReleaseDate,
  getFishText as getDescription,
  getRandomArrayItem
} from "../utils/index";

const NUMBER_OF_MOVIES = 34;
const SHOW_MOVIES_STEP = 5;

const createMovie = () => {
  /**
   * @constant {number} - продолжительность фильма в милесекундах - минимум час
   */
  const duration = Math.round(Math.random() * 1000 * 60 * 60 + 60000 * 60);

  /**
   * @constant {array} – массив жанров – 1-3 жанра на фильм
   */
  const genresList = [
    `Action`,
    `Horror`,
    `Noir`,
    `Comedy`,
    `History`,
    `Thriller`,
    `Drama`
  ]
    .sort(() => Math.random() - Math.random())
    .slice(0, Math.ceil(Math.random() * 3));

  /**
   * @constant {string} – страна производства фильма
   */
  const country = getRandomArrayItem([
    `USA`,
    `Russia`,
    `Canada`,
    `Germany`,
    `Ukraine`,
    `Italy`,
    `Brazil`
  ]);

  /**
   * @constant {string} – возрастное ограничение для просмотра
   */
  const ageRestriction = getRandomArrayItem([`0+`, `6+`, `12+`, `16+`, `18+`]);

  const visualAndCastMocs = [
    {
      title: `Popeye meets Sinbad`,
      poster: `popeye-meets-sinbad.png`,
      director: `Dave Fleischer`,
      writers: `Dave Fleischer`,
      starring: `Jack Mercer, Mae Questel , Gus Wickie, Lou Fleischer`
    },
    {
      title: `Made for each other`,
      poster: `made-for-each-other.png`,
      director: `Robert B. Bean`,
      writers: `Roy Townshend`,
      starring: `Renée Taylor, Joseph Bologna, Paul Sorvino, Olympia Dukakis`
    },
    {
      title: `Sagerbrush trail`,
      poster: `sagebrush-trail.jpg`,
      director: `Armand Schaefer`,
      writers: `Lindsley Parsons, Will Beale`,
      starring: `John Wayne, Nancy Shubert, Lane Chandler, Yakima Canutt`
    },
    {
      title: `Santa Claus concuers the martians`,
      poster: `santa-claus-conquers-the-martians.jpg`,
      director: `Nicholas Webster`,
      writers: `Paul L. Jacobson`,
      starring: `John Call, Leonard Hicks, Vincent Beck, Bill McCutcheon, Victor Stiles`
    },
    {
      title: `The dance of life`,
      poster: `the-dance-of-life.jpg`,
      director: `John Cromwell, A. Edward Sutherland`,
      writers: `Benjamin Glazer, Julian Johnson `,
      starring: `Hal Skelly, Nancy Carroll`
    },
    {
      title: `The grate flamarion`,
      poster: `the-great-flamarion.jpg`,
      director: `Anthony Mann`,
      writers: `Heinz Herald, Richard Weil, Anne Wigton`,
      starring: `Erich von Stroheim, Mary Beth Hughes`
    },
    {
      title: `The man with the golden arm`,
      poster: `the-man-with-the-golden-arm.jpg`,
      director: `Otto Preminger`,
      writers: `Walter Newman, Lewis Meltzer, Ben Hecht`,
      starring: `Frank Sinatra, Eleanor Parker, Kim Novak`
    }
  ];

  const visualAndCast = getRandomArrayItem(visualAndCastMocs);

  return {
    ...visualAndCast,
    releaseDate: getReleaseDate(`01/01/1930`),
    duration,
    country,
    genresList,
    rate: Math.round(Math.random() * 9 * 10) / 10,
    description: getDescription(),
    isWatched: !!Math.round(Math.random()),
    isFavorite: !!Math.round(Math.random()),
    isInWatchList: !!Math.round(Math.random()),
    ageRestriction,
    comments: createCommentsList()
  };
};

const createMoviesList = (numberOfMovies) => {
  let moviesList = [];
  for (let i = 0; i < numberOfMovies; i++) {
    const movie = createMovie();
    moviesList.push({...movie, id: `${i}`});
  }
  return moviesList;
};

const moviesList = createMoviesList(NUMBER_OF_MOVIES);

export {SHOW_MOVIES_STEP, moviesList};
