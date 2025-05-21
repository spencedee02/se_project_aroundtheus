import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/api.js";
import { validationSettings } from "../utils/constants.js";
import "../pages/index.css";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f7c32d64-03fb-4be9-a84c-fb3ea30dd569",
    "Content-Type": "application/json",
  },
});

// Selectors
const cardListElement = ".cards__list";
const profileEditModal = "#profile-edit-modal";
const addCardModal = "#add-card-modal";
const cardPreviewModal = ".modal_type_preview";
const profileForm = document.querySelector("#profile-form");
const addCardForm = document.querySelector("#card-form");
const avatarForm = document.querySelector("#avatar-form");
const editAvatarButton = document.querySelector("#edit-avatar-button");
const profileImage = document.querySelector(".profile__image");

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
    const cardId = cardToDelete.getAttribute("data-id");
    api
      .deleteCard(cardId)
      .then(() => {
        cardToDelete.remove();
        cardToDelete = null;
        closeModal(confirmModal);
      })
      .catch(console.error);
  }
});

// User Info Instance
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
});

// PopupWithForm Instances
const editProfilePopup = new PopupWithForm(profileEditModal, (data) => {
  editProfilePopup.setButtonText("Saving...");
  api
    .updateUserInfo({ name: data["title"], about: data["description"] })
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        description: userData.about,
      });
      editProfilePopup.close();
    })
    .catch(console.error)
    .finally(() => editProfilePopup.setButtonText("Save"));
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(addCardModal, (data) => {
  addCardPopup.setButtonText("Saving...");
  api
    .addCard({ name: data["title"], link: data["image url"] })
    .then((cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
      addCardForm.reset();
      addCardValidator.toggleButtonState();
      addCardPopup.close();
    })
    .catch(console.error)
    .finally(() => addCardPopup.setButtonText("Save"));
});
addCardPopup.setEventListeners();

const editAvatarPopup = new PopupWithForm("#edit-avatar-modal", (data) => {
  editAvatarPopup.setButtonText("Saving...");
  api
    .updateUserAvatar(data.avatar)
    .then((userData) => {
      profileImage.src = userData.avatar;
      editAvatarPopup.close();
    })
    .catch(console.error)
    .finally(() => editAvatarPopup.setButtonText("Save"));
});
editAvatarPopup.setEventListeners();

// PopupWithImage Instance
const previewPopup = new PopupWithImage(cardPreviewModal);
previewPopup.setEventListeners();

// Create Card Function
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    (name, link) => previewPopup.open({ name, link }),
    (cardElement) => {
      cardToDelete = cardElement;
      openModal(confirmModal);
    }
  );
  const element = card.generateCard();
  element.setAttribute("data-id", data._id);
  return element;
}

// Section Instance
const cardSection = new Section(
  {
    renderer: (item) => {
      const cardElement = createCard(item);
      cardSection.addItem(cardElement);
    },
  },
  cardListElement
);

// Load user data and cards from API
api
  .getAppData()
  .then(([userData, cards]) => {
    userInfo.setUserInfo({ name: userData.name, description: userData.about });
    profileImage.src = userData.avatar;
    cardSection.renderItems(cards.reverse()); // Pass cards directly to renderItems
  })
  .catch(console.error);

// Form Validators
const editProfileValidator = new FormValidator(validationSettings, profileForm);
const addCardValidator = new FormValidator(validationSettings, addCardForm);
const avatarValidator = new FormValidator(validationSettings, avatarForm);
editProfileValidator.enableValidation();
addCardValidator.enableValidation();
avatarValidator.enableValidation();

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

editAvatarButton.addEventListener("click", () => {
  editAvatarPopup.open();
});
