// Validation Settings
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save",
  inactiveButtonClass: "modal__save_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

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
  toggleStateButton(inputList, submitButton, settings);
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
    });

    setEventListeners(formElement, settings);
  });
}

// Activate Validation
enableValidation(validationSettings);
