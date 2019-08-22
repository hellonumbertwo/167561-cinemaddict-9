export const createCommentTemplate = ({author, text, date, emoji}) => `
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date.toLocaleString()}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
`;
