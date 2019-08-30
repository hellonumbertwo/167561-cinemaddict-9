import {render} from "../../utils";
import Comment from "./comment";

export const renderComment = (containerId, commentData) => {
  const comment = new Comment(commentData);

  render(containerId, comment.getElement(), `beforeend`);
};
