import {getFishText, getRandomDate} from "../utils/index";

const getTheRandomAuthor = () => {
  const name = [`John`, `Chris`, `Elliot`, `Bob`, `Perry`, `Carla`][
    Math.floor(Math.random() * 6)
  ];
  const surname = [`Dorian`, `Turk`, `Reid`, `Kelso`, `Cox`, `Espinosa`][
    Math.floor(Math.random() * 6)
  ];
  return `${name} ${surname}`;
};

const createComment = () => {
  return {
    emoji: [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`][
      Math.floor(Math.random() * 5)
    ],
    author: getTheRandomAuthor(),
    text: getFishText(),
    date: getRandomDate(new Date().setFullYear(new Date().getFullYear() - 5))
  };
};

export const createCommentsList = () => {
  const commentsList = [];
  for (let i = 0; i < Math.round(Math.random() * 100); i++) {
    commentsList.push(createComment());
  }
  return commentsList;
};
