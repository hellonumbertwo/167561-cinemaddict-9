const createComment = () => {
  return {
    author: `Author`,
    text: `IMHO`,
    date: `today`
  };
};

export const createCommentsList = () => {
  const commentsList = [];
  for (let i = 0; i < Math.round(Math.random() * 100); i++) {
    commentsList.push(createComment());
  }
  return commentsList;
};
