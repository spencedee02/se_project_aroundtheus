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

// Profile Edit Elements
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

// Add Card Elements
const addCardButton = document.querySelector("#add-card-button");
const addCardCloseButton = addCardModal.querySelector("#card-modal-close");
const cardTitleInput = document.querySelector("#card-title-input");
const cardImageUrlInput = document.querySelector("#card-url-input");
const addCardForm = document.querySelector("#card-form");

// Preview Modal Elements
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

// Close modal on overlay click
function handleOverlayClick(event) {
  if (event.target.classList.contains("modal_opened")) {
    closePopup(event.target);
  }
}

// Handle Image Click
function handleImageClick(name, link) {
  previewImage.src = link;
  previewImage.alt = name;
  previewTitle.textContent = name;
  openPopup(cardPreviewModal);
}

// Handle Profile Edit Submit
function handleProfileEditSubmit(event) {
  event.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

// Handle Add Card Submit
function handleAddCardSubmit(event) {
  event.preventDefault();
  const name = cardTitleInput.value;
  const link = cardImageUrlInput.value;
  const card = new Card({ name, link }, "#card-template", handleImageClick);
  cardListElement.prepend(card.generateCard());
  closePopup(addCardModal);
  addCardForm.reset();
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
addCardButton.addEventListener("click", () => openPopup(addCardModal));
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

// Render Initial Cards
initialCards.forEach((data) => {
  const card = new Card(data, "#card-template", handleImageClick);
  cardListElement.prepend(card.generateCard());
});

// Initialize Form Validators
const editProfileValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
const addCardValidator = new FormValidator(validationSettings, addCardForm);

editProfileValidator.enableValidation();
addCardValidator.enableValidation();
