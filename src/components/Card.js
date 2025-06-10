export default class Card {
  constructor(
    data,
    cardSelector,
    handleImageClick,
    handleDeleteClick,
    likeCard,
    unlikeCard
  ) {
    this._name = data.name;
    this._link = data.link;
    this._isLiked = data.isLiked; // Internal tracking of like state
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._likeCard = likeCard; // Store the likeCard callback
    this._unlikeCard = unlikeCard; // Store the unlikeCard callback
    this._likes = data.likes || []; // Store likes from data
  }

  _getTemplate() {
    const cardTemplate = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardTemplate;
  }

  _setEventListeners() {
    const likeButton = this._element.querySelector(".card__like-button"); // Store the like button as a class property
    likeButton.addEventListener("click", () => {
      const cardId = this._element.getAttribute("data-id");
      const isLiked = this.isLiked(); // Check if the card is already liked

      if (isLiked) {
        this._unlikeCard(cardId, this); // If liked, call the unlike method
      } else {
        this._likeCard(cardId, this); // If not liked, call the like method
      }
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

  // Toggle the like state and button appearance
  toggleLike() {
    this._element
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active");
  }

  generateCard() {
    this._element = this._getTemplate(); // Ensure _element is assigned here
    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    // Set initial like state after _element is assigned
    this._updateLikesView();
    this._setEventListeners();

    return this._element;
  }

  isLiked() {
    return this._isLiked; // Check if the card is liked using the internal _isLiked state
  }

  updateLikeState() {
    const likeButton = this._element.querySelector(".card__like-button"); // Use the stored like button property
    const likeCountElement = this._element.querySelector(".card__like-count");

    // Toggle the like state and button appearance
    likeButton.classList.toggle("card__like-button_active");
    this._isLiked = !this._isLiked;

    if (likeCountElement) {
      likeCountElement.textContent = this._likes.length; // Update the like count based on _likes array
    }
  }

  _updateLikesView() {
    const likeButton = this._element.querySelector(".card__like-button"); // Use the stored like button property
    const likeCountElement = this._element.querySelector(".card__like-count");

    if (this.isLiked()) {
      likeButton.classList.add("card__like-button_active");
    } else {
      likeButton.classList.remove("card__like-button_active");
    }

    // Update like count if element exists
    if (likeCountElement) {
      likeCountElement.textContent = this._likes.length;
    }
  }
}
