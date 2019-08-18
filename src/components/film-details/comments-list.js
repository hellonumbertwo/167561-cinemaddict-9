import {createCommentTemplate} from "./comment";

export const createCommentsListTemplate = () => `
<section class="film-details__comments-wrap">
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

<ul class="film-details__comments-list">
  <li class="film-details__comment">
    ${createCommentTemplate()}
  </li>
  <li class="film-details__comment">
    ${createCommentTemplate()}
  </li>
  <li class="film-details__comment">
    ${createCommentTemplate()}
  </li>
  <li class="film-details__comment">
    ${createCommentTemplate()}
  </li>
</ul>
</section>
`;
