import { getFishText, getRandomDate, getRandomArrayItem } from "../utils/index";

const createComment = () => {
  const emoji = getRandomArrayItem([
    `angry`,
    `puke`,
    `sleeping`,
    `smile`,
    `trophy`
  ]);

  const author = `${getRandomArrayItem([
    `John`,
    `Chris`,
    `Elliot`,
    `Bob`,
    `Perry`,
    `Carla`
  ])} ${getRandomArrayItem([
    `Dorian`,
    `Turk`,
    `Reid`,
    `Kelso`,
    `Cox`,
    `Espinosa`
  ])}`;

  // дата самого старого комментария не раньше 5 лет назал
  const theOldestCommentDate = new Date().setFullYear(
    new Date().getFullYear() - 5
  );

  return {
    emoji,
    author,
    text: getFishText(),
    date: getRandomDate(theOldestCommentDate)
  };
};

export const createCommentsList = () => {
  const commentsList = [];
  // рандомное кол-во комментарией до 30
  const commentsListMaxLength = Math.round(Math.random() * 30);

  for (let i = 0; i < commentsListMaxLength; i++) {
    commentsList.push({ ...createComment(), id: i });
  }
  return commentsList;
};
