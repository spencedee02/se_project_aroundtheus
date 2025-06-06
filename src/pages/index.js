import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js"; // Import the confirmation popup
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

// Declare the currentUserId
let currentUserId;

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
cancelButton.addEventListener("click", () => {
  cardToDelete = null;
  confirmDeletePopup.close(); // Use the close method from PopupWithConfirmation
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
        confirmDeletePopup.close();
      })
      .catch(console.error);
  }
});

// User Info Instance
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
  avatarSelector: ".profile__image", // Pass avatar selector
});

// Like/Unlike logic moved to index.js with updated card element handling
function likeCard(cardId, cardElement) {
  return api
    .likeCard(cardId)
    .then((updatedCard) => {
      cardElement.updateLikeState(); // Directly call updateLikeState() on the card instance
    })
    .catch(console.error);
}

function unlikeCard(cardId, cardElement) {
  return api
    .dislikeCard(cardId)
    .then((updatedCard) => {
      cardElement.updateLikeState(); // Directly call updateLikeState() on the card instance
    })
    .catch(console.error);
}

// PopupWithForm Instances
const editProfilePopup = new PopupWithForm(profileEditModal, (data) => {
  editProfilePopup.setButtonText("Saving...");

  // Return the API call
  return api
    .updateUserInfo({ name: data["title"], about: data["description"] })
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        description: userData.about,
      });
      editProfilePopup.close();
    });
});
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm(addCardModal, (data) => {
  addCardPopup.setButtonText("Saving...");

  // Return the API call
  return api
    .addCard({ name: data["title"], link: data["image url"] })
    .then((cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
      addCardValidator.toggleButtonState();
    });
});
addCardPopup.setEventListeners();

const editAvatarPopup = new PopupWithForm("#edit-avatar-modal", (data) => {
  editAvatarPopup.setButtonText("Saving...");

  // Disable the button after submission
  editAvatarPopup.setButtonDisabled(true);

  // Return the API call
  return api
    .updateUserAvatar(data.avatar)
    .then((userData) => {
      userInfo.setUserAvatar(userData.avatar); // Set avatar using the UserInfo method
      editAvatarPopup.close();
    })
    .finally(() => {
      editAvatarPopup.setButtonText("Save");
      editAvatarPopup.setButtonDisabled(false); // Re-enable the button after submission
    });
});
editAvatarPopup.setEventListeners();

// PopupWithImage Instance
const previewPopup = new PopupWithImage(cardPreviewModal);
previewPopup.setEventListeners();

// PopupWithConfirmation Instance (for card deletion confirmation)
const confirmDeletePopup = new PopupWithConfirmation(
  ".modal_type_confirm",
  () => {
    const card = confirmDeletePopup.getCardElement(); // Get the card to be deleted
    const cardId = card.getAttribute("data-id"); // Extract card ID
    api
      .deleteCard(cardId) // Make API request to delete the card
      .then(() => {
        card.remove(); // Remove the card from the DOM
        confirmDeletePopup.close(); // Close the confirmation modal
      })
      .catch(console.error); // Log errors
  }
);
confirmDeletePopup.setEventListeners();

// Create Card Function
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    (name, link) => previewPopup.open({ name, link }),
    (cardElement) => {
      confirmDeletePopup.open(cardElement); // Open the confirmation popup with the current card
    },
    likeCard, // Pass likeCard function
    unlikeCard // Pass unlikeCard function
  );
  const element = card.generateCard();

  // can call `updateLikeState` per Tutor
  card.updateLikeState(); // Ensure like state is set correctly

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
    currentUserId = userData._id; // Save current user ID
    userInfo.setUserInfo({ name: userData.name, description: userData.about });
    userInfo.setUserAvatar(userData.avatar); // Set the avatar using UserInfo
    cardSection.renderItems(
      cards
        .map((card) => {
          // Ensure 'likes' is an array (or default to an empty array if it's undefined)
          card.likes = card.likes || [];

          // Check if the current user liked the card
          card.isLiked = card.likes.some((user) => user._id === currentUserId);
          return card;
        })
        .reverse() // Reverse the order if needed
    );
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
