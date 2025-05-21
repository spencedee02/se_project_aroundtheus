import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._form = this._popup.querySelector(".modal__form");
    this._handleFormSubmit = handleFormSubmit;
    this._submitButton = this._form.querySelector(".modal__save"); // ✅ Add this line
    this._defaultButtonText = this._submitButton.textContent; // ✅ Save default text
  }

  _getInputValues() {
    this._inputList = this._form.querySelectorAll(".modal__input");
    this._formValues = {};
    this._inputList.forEach((input) => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  setButtonText(text) {
    this._submitButton.textContent = text;
  }

  close() {
    super.close();
    this._form.reset(); // ✅ Optional: Reset fields on close
    this.setButtonText(this._defaultButtonText); // ✅ Restore default button text
  }
}
