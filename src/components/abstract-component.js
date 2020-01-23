import { createElement, unrender } from "./../utils/index";

/**
 * абстрактный класс – содержит общую логику и данные компонентов
 * @class
 */
export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(
        `Can't instantiate AbstractComponent, only concrete one.`
      );
    }
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element = unrender(this._element);
      this._element = null;
    }
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }
}
