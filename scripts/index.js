const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

/* -------------------------------------------------------------------*/
/*                       ELEMENTS                                     */
/* -------------------------------------------------------------------*/

//Profile Edit Button//
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditCloseButton = profileEditModal.querySelector("#modal-close");

//Profile name & Description//
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = profileEditModal.querySelector("#profile-form");

//Add Card Button//
const addCardButton = document.querySelector("#add-card-button");
const addCardModal = document.querySelector("#add-card-modal");
const addCardButtonClose = addCardModal.querySelector("#modal-close");

//Cards//
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const cardListElement = document.querySelector(".cards__list");

//Card Title & URL//
// const cardTitle = document.querySelector(".card__title");
// const cardImageUrl = document.querySelector(".card__image");
const cardTitleInput = document.querySelector("#card-title-input");
const cardImageUrlInput = document.querySelector("#card-description-input");
const addCardForm = document.querySelector("#card-form");

/* -------------------------------------------------------------------*/
/*                      FUNCTIONS                                     */
/* -------------------------------------------------------------------*/

function closePopup(modal) {
  modal.classList.remove("modal_opened");
}
function openPopup(modal) {
  modal.classList.add("modal_opened");
}

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardTitleElement = cardElement.querySelector(".card__title");
  cardTitleElement.textContent = cardData.name;
  cardImageElement.src = cardData.link;
  cardImageElement.alt = cardData.name;
  return cardElement;
}

function renderCard(cardData) {
  const cardElement = getCardElement(cardData);
  cardListElement.prepend(cardElement);
}
/* -------------------------------------------------------------------*/
/*                      EVENT HANDLERS                                */
/* -------------------------------------------------------------------*/

//Profile Edit Button//
function handlerProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

//Add Card Button//
function handlerAddCardSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardImageUrlInput.value;
  renderCard({ name, link }, cardListElement);
  closePopup(addCardModal);
}

/* -------------------------------------------------------------------*/
/*                      EVENT LISTENERS                               */
/* -------------------------------------------------------------------*/

//Profile Edit Button//
profileEditButton.addEventListener("click", () => {
  openPopup(profileEditModal);
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
});

profileEditForm.addEventListener("submit", handlerProfileEditSubmit);

profileEditCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);

//Add Card Button//
addCardButton.addEventListener("click", () => openPopup(addCardModal));
addCardForm.addEventListener("submit", handlerAddCardSubmit);
addCardButtonClose.addEventListener("click", () => closePopup(addCardModal));

initialCards.forEach((cardData) => {
  cardListElement.prepend(getCardElement(cardData));
});

// //Like Button// <-- This is an element, for some reason the nodes won't show unless it's down here -->//
const likeButtons = document.querySelectorAll(".card__like-button");
likeButtons.forEach((likeButton) => {
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });
});
