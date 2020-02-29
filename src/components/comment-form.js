import AbstractComponent from "./abstract-component";

export default class CommentForm extends AbstractComponent {
  constructor() {
    super();
    this._addEmoji();
  }
  getTemplate() {
    return `
      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          <span style="font-size: 12px; line-height: 2;">* Ctrl/Command + Enter to add a comment</span>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    `;
  }
  _addEmoji() {
    this.getElement().addEventListener(
      `change`,
      e => {
        if (e.target.tagName === `INPUT`) {
          this.getElement().querySelector(
            `.film-details__add-emoji-label`
          ).innerHTML = `<img src="./images/emoji/${e.target.value}.png" width="30" height="30" alt="emoji">`;
        }
      },
      false
    );
  }
}
