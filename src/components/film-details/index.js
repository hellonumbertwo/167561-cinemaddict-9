import {createControlsTemplate} from "./controls";
import {createCommentsListTemplate} from "./comments-list";
import {createCommentFormTemplate} from "./comment-form";
import {createFilmInfoTemplate} from "./film-info";

export const createPopupTemplate = () => `
<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
        ${createFilmInfoTemplate()}
        ${createControlsTemplate()}
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        ${createCommentsListTemplate()}
        ${createCommentFormTemplate()}
      </section>
    </div>
  </form>
</section>
`;
