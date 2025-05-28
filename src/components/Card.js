// Project-9
export default class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteClick) {
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._id = data._id;
    this._isLiked = data.isLiked; // Use the isLiked field passed from the server
  }

  _getTemplate() {
    const cardTemplate = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardTemplate;
  }

  _setEventListeners() {
    this._element
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this.toggleLike();
      });

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDeleteClick(this._element); // Triggers confirmation modal
      });

    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleImageClick(this._name, this._link);
      });
  }

  toggleLike() {
    this._isLiked = !this._isLiked; // Toggle liked state
    this._element
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active", this._isLiked);

    // Update the server with the new state
    this._updateLikeState();
  }

  _updateLikeState() {
    if (this._isLiked) {
      api.likeCard(this._id); // Like the card on the backend
    } else {
      api.dislikeCard(this._id); // Dislike the card on the backend
    }
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    // Set the initial like state based on the passed `isLiked` field
    if (this._isLiked) {
      this._element
        .querySelector(".card__like-button")
        .classList.add("card__like-button_active");
    }

    this._setEventListeners();
    return this._element;
  }
}
