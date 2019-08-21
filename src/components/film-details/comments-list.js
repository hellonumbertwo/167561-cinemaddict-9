import {createCommentTemplate} from "./comment";

export const createCommentsListTemplate = ({comments}) => `
<section class="film-details__comments-wrap">
<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${
  comments.length
}</span></h3>

<ul class="film-details__comments-list">
${comments
  .map(
      (comment) => `
  <li class="film-details__comment">
    ${createCommentTemplate(comment)}
  </li>
`
  )
  .join(``)}
</ul>
</section>
`;
