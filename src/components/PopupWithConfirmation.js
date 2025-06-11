import Popup from "./Popup.js";

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleConfirmation) {
    super(popupSelector);
    this._handleConfirmation = handleConfirmation;
    this._form = this._popup.querySelector(".modal__form");
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._handleConfirmation(); // Trigger confirmation action
      this.close(); // Close modal after confirmation
    });
  }

  open(cardElement) {
    this._cardElement = cardElement; // Store the card to be deleted
    super.open(); // Open the confirmation modal
  }

  getCardElement() {
    return this._cardElement; // Return the card to be deleted
  }
}
