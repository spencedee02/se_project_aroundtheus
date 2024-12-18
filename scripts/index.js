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

// ---------------------------------------------------------------------------//
//                          ELEMENTS                                          //
//----------------------------------------------------------------------------//

//Profile Edit Button//
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileEditCloseButton = profileEditModal.querySelector(
  "#profile-modal-close"
);

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
const addCardButtonClose = addCardModal.querySelector("#card-modal-close");

//Cards//

const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const cardListElement = document.querySelector(".cards__list");

//Card Title & URL//
const cardTitleInput = document.querySelector("#card-title-input");
const cardImageUrlInput = document.querySelector("#card-url-input");
const addCardForm = document.querySelector("#card-form");

//Preview Image//
const cardPreviewModal = document.querySelector(".modal_type_preview");
const cardPreviewClose = cardPreviewModal.querySelector(
  ".modal__preview-close"
);
const previewImage = cardPreviewModal.querySelector(".modal__preview-image");
const previewTitle = cardPreviewModal.querySelector(".modal__preview-title");

// ---------------------------------------------------------------------------//
//                          FUNCTIONS                                         //
//----------------------------------------------------------------------------//

// Open Modal
function openPopup(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
}

// Close Modal
function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
}

// Handle Esc Key
function handleEscKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closePopup(openModal);
    }
  }
}

// Handle Overlay Click
function handleOverlayClick(event) {
  if (event.target.classList.contains("modal_opened")) {
    closePopup(event.target);
  }
}

// Get Card Element
function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardTitleElement = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    previewImage.src = cardData.link;
    previewImage.alt = cardData.name || "Preview Image";
    previewTitle.textContent = cardData.name;

    openPopup(cardPreviewModal);
  });

  cardTitleElement.textContent = cardData.name;
  cardImageElement.src = cardData.link;
  cardImageElement.alt = cardData.name || "Card Image";

  return cardElement;
}

// Render Card
function renderCard(cardData) {
  const cardElement = getCardElement(cardData);
  cardListElement.prepend(cardElement);
}

// ---------------------------------------------------------------------------//
//                          EVENT HANDLERS                                    //
//----------------------------------------------------------------------------//

// Profile Edit Submit
function handlerProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

// Add Card Submit
function handlerAddCardSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardImageUrlInput.value;
  renderCard({ name, link });
  closePopup(addCardModal);
  addCardForm.reset();
}

// ---------------------------------------------------------------------------//
//                         EVENT LISTENERS                                    //
//----------------------------------------------------------------------------//

// Profile Edit Button
profileEditButton.addEventListener("click", () => {
  openPopup(profileEditModal);
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
});

profileEditForm.addEventListener("submit", handlerProfileEditSubmit);
profileEditCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);

// Add Card Button
addCardButton.addEventListener("click", () => {
  openPopup(addCardModal);
  //Sorry, I thought that was normal to do. I took out the reset//
  // Also, I was a lil frustrated, there was really no way of communicating with you//
  // I realized the git was not being pushed, that is why you saw 2//
  //submission that looks the same//
  //anyways I appreciate your time in reviewing this//
});

addCardForm.addEventListener("submit", handlerAddCardSubmit);
addCardButtonClose.addEventListener("click", () => closePopup(addCardModal));

// Close Preview Modal
cardPreviewClose.addEventListener("click", () => closePopup(cardPreviewModal));

// Overlay Click for All Modals
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", handleOverlayClick);
});

// Render Initial Cards
initialCards.forEach(renderCard);
