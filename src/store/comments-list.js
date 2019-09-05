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

  return {
    emoji,
    author,
    text: getFishText(),
    date: getRandomDate(new Date().setFullYear(new Date().getFullYear() - 5))
  };
};

export const createCommentsList = () => {
  const commentsList = [];
  /**
   * @constant {number} - рандомное кол-во комментарией до сотни
   */
  const commentsListMaxLength = Math.round(Math.random() * 100);

  for (let i = 0; i < commentsListMaxLength; i++) {
    commentsList.push(createComment());
  }
  return commentsList;
};
