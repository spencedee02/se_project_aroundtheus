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

// Delete confirmation modal setup
const confirmModal = document.querySelector(".modal_type_confirm");
const confirmForm = confirmModal.querySelector(".modal__form");
const cancelButton = confirmModal.querySelector(".modal__cancel");
let cardToDelete = null;

// Modal handlers
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeOnEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeOnEsc);
}

function closeOnEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

cancelButton.addEventListener("click", () => {
  cardToDelete = null;
  closeModal(confirmModal);
});

confirmForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cardToDelete) {
    cardToDelete.remove();
    cardToDelete = null;
  }
  closeModal(confirmModal);
});

// User Info Instance
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
});

// PopupWithForm Instances
const editProfilePopup = new PopupWithForm(profileEditModal, (data) => {
  userInfo.setUserInfo({
    name: data["title"],
    description: data["description"],
  });
  editProfilePopup.close();
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(addCardModal, (data) => {
  const cardElement = createCard({
    name: data["title"] || "Untitled",
    link: data["image url"] || "https://via.placeholder.com/150",
  });
  cardSection.addItem(cardElement);
  addCardPopup.close();
  addCardForm.reset();
  addCardValidator.toggleButtonState();
});
addCardPopup.setEventListeners();

// PopupWithImage Instance
const previewPopup = new PopupWithImage(cardPreviewModal);
previewPopup.setEventListeners();

// Create Card Function
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    (name, link) => {
      previewPopup.open({ name, link });
    },
    (cardElement) => {
      cardToDelete = cardElement;
      openModal(confirmModal);
    }
  );
  return card.generateCard();
}

// Section Instance - Initial Cards
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
