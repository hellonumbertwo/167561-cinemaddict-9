export const createCommentTemplate = () => `
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/smile.png" width="55" height="55" alt="emoji">
  </span>
  <div>
    <p class="film-details__comment-text">Interesting setting and a good cast</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">Tim Macoveev</span>
      <span class="film-details__comment-day">3 days ago</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
`;
