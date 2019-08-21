import {createCommentsList} from "./comments";

const AMOUNT_OF_MOVIES = 24;

const getDescription = () =>
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
    .reduce((set, sentance) => {
      if (set.length < 3 && Math.random() < 0.25) {
        set.push(sentance);
      }
      return set;
    }, [])
    .join(` `);

const getRuntime = () => {
  //минимум час
  const num = (Math.round((Math.random() + 1) * 100) / 100).toString();
  return num
    .split(`.`)
    .map((item, index) => {
      if (index === 0) {
        return `${item}h`;
      }
      return `${item}m`;
    })
    .join(` `);
};

const getFilmVisualAndCast = () => {
  return [
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
  ][Math.floor(Math.random() * 7)];
};

const getreleaseDate = () => {
  const from = new Date(`01/01/1930`).getTime();
  const to = Date.now();
  return new Date(from + Math.random() * (to - from));
};

const createMovie = () => {
  return {
    ...getFilmVisualAndCast(),
    releaseDate: getreleaseDate(),
    runtime: getRuntime(),
    country: [
      `USA`,
      `Russia`,
      `Canada`,
      `Germany`,
      `Ukraine`,
      `Italy`,
      `Brazil`
    ][Math.floor(Math.random() * 7)],
    genre: [
      `Action`,
      `Horror`,
      `Noir`,
      `Comedy`,
      `Documentary`,
      `Thriller`,
      `Drama`
    ][Math.floor(Math.random() * 7)],
    rate: Math.round(Math.random() * 10 * 10) / 10,
    description: getDescription(),
    isWatched: !!Math.round(Math.random()),
    isFavorite: !!Math.round(Math.random()),
    isInWatchList: !!Math.round(Math.random()),
    ageRestriction: [`0+`, `6+`, `12+`, `16+`, `18+`][
      Math.floor(Math.random() * 5)
    ],
    comments: createCommentsList()
  };
};

const createMoviesList = () => {
  let moviesList = [];
  for (let i = 0; i < AMOUNT_OF_MOVIES; i++) {
    moviesList.push(createMovie());
  }
  return moviesList;
};

export default createMoviesList();
