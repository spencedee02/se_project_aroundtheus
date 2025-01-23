import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

// Initial Cards
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

// Validation Settings
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save",
  inactiveButtonClass: "modal__save_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Selectors
const cardListElement = document.querySelector(".cards__list");
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditCloseButton = profileEditModal.querySelector(
  "#profile-modal-close"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = profileEditModal.querySelector("#profile-form");
const addCardButton = document.querySelector("#add-card-button");
const addCardCloseButton = addCardModal.querySelector("#card-modal-close");
const cardTitleInput = document.querySelector("#card-title-input");
const cardImageUrlInput = document.querySelector("#card-url-input");
const addCardForm = document.querySelector("#card-form");
const cardPreviewModal = document.querySelector(".modal_type_preview");
const previewImage = cardPreviewModal.querySelector(".modal__preview-image");
const previewTitle = cardPreviewModal.querySelector(".modal__preview-title");
const cardPreviewCloseButton = cardPreviewModal.querySelector(
  ".modal__preview-close"
);

// Functions for opening and closing modals
function openPopup(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
}

function handleEscKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closePopup(openModal);
  }
}

function handleOverlayClick(event) {
  if (event.target.classList.contains("modal_opened")) {
    closePopup(event.target);
  }
}

function handleImageClick(name, link) {
  previewImage.src = link;
  previewImage.alt = name;
  previewTitle.textContent = name;
  openPopup(cardPreviewModal);
}

function handleProfileEditSubmit(event) {
  event.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

function handleAddCardSubmit(event) {
  event.preventDefault();
  const name = cardTitleInput.value;
  const link = cardImageUrlInput.value;
  createCard({ name, link }); // I made a special function outside this, so I can reuse it.
  closePopup(addCardModal);
  addCardForm.reset();
  addCardValidator.toggleButtonState(); //thanks for the comment, I didn't realized that part.
}

function createCard(data) {
  const card = new Card(data, "#card-template", handleImageClick);
  cardListElement.prepend(card.generateCard());
}

// Event Listeners for Profile Edit
profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(profileEditModal);
});
profileEditCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);
profileEditForm.addEventListener("submit", handleProfileEditSubmit);

// Event Listeners for Add Card
addCardButton.addEventListener("click", () => {
  addCardForm.reset();
  addCardValidator.resetValidation();
  openPopup(addCardModal);
});
addCardCloseButton.addEventListener("click", () => closePopup(addCardModal));
addCardForm.addEventListener("submit", handleAddCardSubmit);

// Close Preview Modal
cardPreviewCloseButton.addEventListener("click", () =>
  closePopup(cardPreviewModal)
);

// Add overlay click event listeners to all modals
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", handleOverlayClick);
});

// Hello reviewer, sorry it took me awhile to submit the correction.. it was just stressful :(
// I tried adding the code you gave me, but for some reason my whole code stopped working.
// I had to figure out how to make my other code reusable. so I figure out by adding createCard outside
// on it's own then just past it through here.
// Can you please check if how I did. ty

// Render Initial Cards
initialCards.forEach(createCard);

// Initialize Form Validators
const editProfileValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
const addCardValidator = new FormValidator(validationSettings, addCardForm);

editProfileValidator.enableValidation();
addCardValidator.enableValidation();
