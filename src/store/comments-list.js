import {getFishText, getRandomDate, getRandomArrayItem} from "../utils/index";

const createComment = () => {
  const emoji = getRandomArrayItem([
    `angry.png`,
    `puke.png`,
    `sleeping.png`,
    `smile.png`,
    `trophy.png`
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

  /**
   * @constant
   * дата самого старого комментария не раньше 5 лет назал
   */
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
  /**
   * @constant {number} - рандомное кол-во комментарией до 30
   */
  const commentsListMaxLength = Math.round(Math.random() * 30);

  for (let i = 0; i < commentsListMaxLength; i++) {
    commentsList.push(createComment());
  }
  return commentsList;
};
