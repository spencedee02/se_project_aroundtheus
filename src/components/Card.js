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
    const likeButton = this._element.querySelector(".card__like-button");
    likeButton.addEventListener("click", () => {
      const cardId = this._element.getAttribute("data-id");

      // Call like/unlike methods and pass the card element
      if (likeButton.classList.contains("card__like-button_active")) {
        this._unlikeCard(cardId, this._element);
      } else {
        this._likeCard(cardId, this._element);
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

  toggleLike() {
    this._element
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active");
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    // Update the like state based on initial data
    this.updateLikeState(); // Ensure like state is set correctly

    this._setEventListeners();
    return this._element;
  }

  // Method to update the like state based on the card data
  updateLikeState() {
    const likeButton = this._element.querySelector(".card__like-button");
    const likeCountElement = this._element.querySelector(".card__like-count");

    const isLikedByUser = this._likes.some(
      (user) => user._id === currentUserId
    );
    if (isLikedByUser) {
      likeButton.classList.add("card__like-button_active");
    } else {
      likeButton.classList.remove("card__like-button_active");
    }

    if (likeCountElement) {
      likeCountElement.textContent = this._likes.length;
    }
  }
}
