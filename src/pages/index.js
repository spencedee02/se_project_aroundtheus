import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import { initialCards, validationSettings } from "../utils/constants.js";
import "../pages/index.css";

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
  addCardForm.reset(); // reset -- Thank you!!!
  addCardValidator.toggleButtonState(); // this will disable the button --- Thank You!!!
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
  addCardPopup.open();
});
