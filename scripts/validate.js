// Validation Settings
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save",
  inactiveButtonClass: "modal__save_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Function to close the modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// Function to handle the Esc key
function handleEscKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

// Attach the Esc key listener to the document
document.addEventListener("keydown", handleEscKey);

// Show error message
function showInputError(
  formElement,
  inputElement,
  { inputErrorClass, errorClass }
) {
  const errorMessageEl = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorMessageEl.textContent = inputElement.validationMessage;
  errorMessageEl.classList.add(errorClass);
}

// Hide error message
function hideInputError(
  formElement,
  inputElement,
  { inputErrorClass, errorClass }
) {
  const errorMessageEl = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorMessageEl.textContent = "";
  errorMessageEl.classList.remove(errorClass);
}

// Reset the form state
function resetFormState(formElement, settings) {
  const { inputSelector, submitButtonSelector } = settings;
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButton = formElement.querySelector(submitButtonSelector);

  // Clear all error messages and remove error styles
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
    inputElement.value = ""; // Reset input values
  });

  // Disable the save button
  submitButton.classList.add(settings.inactiveButtonClass);
  submitButton.disabled = true;
}

// Toggle the state of the Save button
function toggleStateButton(inputList, submitButton, { inactiveButtonClass }) {
  const isValid = inputList.every(
    (inputElement) => inputElement.validity.valid
  );
  if (isValid) {
    submitButton.classList.remove(inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// Check input validity
function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

// Add event listeners to form inputs
function setEventListeners(formElement, settings) {
  const { inputSelector, submitButtonSelector } = settings;
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  const submitButton = formElement.querySelector(submitButtonSelector);

  // Set initial button state
  toggleStateButton(inputList, submitButton, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleStateButton(inputList, submitButton, settings);
    });
  });
}

// Enable validation for all forms
function enableValidation(settings) {
  const formList = [...document.querySelectorAll(settings.formSelector)];
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission
      const modal = formElement.closest(".modal");
      closeModal(modal); // Close the modal after submission
      resetFormState(formElement, settings); // Reset form after submission
    });

    setEventListeners(formElement, settings);

    // Reset form state when the modal is opened
    const modal = formElement.closest(".modal");
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal_opened")) {
        resetFormState(formElement, settings);
      }
    });
  });
}

// Function to close the modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

// Activate Validation
enableValidation(validationSettings);
