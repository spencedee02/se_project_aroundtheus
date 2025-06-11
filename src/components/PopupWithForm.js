import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._form = this._popup.querySelector(".modal__form");
    this._handleFormSubmit = handleFormSubmit;
    this._submitButton = this._form.querySelector(".modal__save");
    this._defaultButtonText = this._submitButton.textContent;
    this._inactiveButtonClass = "modal__save_disabled"; // Ensure this class is in your CSS

    // Avatar input field
    this._avatarInput = this._form.querySelector("#avatar-url-input");
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

    // Initialize the button as disabled when modal opens
    this.setButtonDisabled(true); // Disable the button initially when the modal opens

    // Listen for input change in the avatar field
    if (this._avatarInput) {
      this._avatarInput.addEventListener("input", () => {
        if (this._avatarInput.value.trim() !== "") {
          this.setButtonDisabled(false); // Enable button if there's input
        } else {
          this.setButtonDisabled(true); // Disable button if input is empty
        }
      });
    }

    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._handleFormSubmit(this._getInputValues())
        .then(() => {
          // Reset the form only after a successful submission
          this._form.reset();
          this.close(); // Close the modal
        })
        .catch(console.error)
        .finally(() => {
          this.setButtonText(this._defaultButtonText); // Reset the button text in any case
        });
    });
  }

  setButtonText(text) {
    this._submitButton.textContent = text;
  }

  setButtonDisabled(isDisabled) {
    this._submitButton.disabled = isDisabled;
    if (isDisabled) {
      this._submitButton.classList.add(this._inactiveButtonClass);
    } else {
      this._submitButton.classList.remove(this._inactiveButtonClass);
    }
  }

  close() {
    super.close();
    this.setButtonDisabled(true); // Ensure the button is disabled on modal close
  }

  open() {
    super.open();
    this.setButtonDisabled(true); // Ensure the button is disabled every time the modal opens
  }
}
