import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import "../pages/index.css";

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
const cardListElement = ".cards__list";
const profileEditModal = "#profile-edit-modal";
const addCardModal = "#add-card-modal";
const cardPreviewModal = ".modal_type_preview";
const profileForm = document.querySelector("#profile-form");
const addCardForm = document.querySelector("#card-form");

// User Info Instance
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
});

// PopupWithForm Instances
const editProfilePopup = new PopupWithForm(profileEditModal, (data) => {
  userInfo.setUserInfo({
    name: data["title"], // Uses name="title" from HTML
    description: data["description"], // Uses name="description" from HTML
  });
  editProfilePopup.close();
});
editProfilePopup.setEventListeners();

// Updated Add Card Popup ✅
const addCardPopup = new PopupWithForm(addCardModal, (data) => {
  console.log("Form Data (Add Card): ", data); // Debugging

  const cardElement = createCard({
    name: data["title"] || "Untitled", // Uses name="title" from HTML
    link: data["image url"] || "https://via.placeholder.com/150", // Uses name="image url" from HTML
  });
  cardSection.addItem(cardElement);
  addCardPopup.close();
});
addCardPopup.setEventListeners();

// PopupWithImage Instance
const previewPopup = new PopupWithImage(cardPreviewModal);
previewPopup.setEventListeners();

// Create Card Function ✅
function createCard(data) {
  const card = new Card(data, "#card-template", (name, link) => {
    previewPopup.open({ name, link });
  });
  return card.generateCard();
}

// Section Instance - Initial Cards ✅
const cardSection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  cardListElement
);
cardSection.renderItems();

// Form Validators
const editProfileValidator = new FormValidator(validationSettings, profileForm);
const addCardValidator = new FormValidator(validationSettings, addCardForm);
editProfileValidator.enableValidation();
addCardValidator.enableValidation();

// Event Listeners
document.querySelector("#profile-edit-button").addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  document.querySelector("#profile-title-input").value = userData.name;
  document.querySelector("#profile-description-input").value =
    userData.description;
  editProfilePopup.open();
});

document.querySelector("#add-card-button").addEventListener("click", () => {
  addCardValidator.resetValidation();
  addCardPopup.open();
});
