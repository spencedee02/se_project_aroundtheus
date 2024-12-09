// Validation Settings
const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save",
  inactiveButtonClass: "modal__save_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

//Show error message//
function showInputError(
  formElement,
  inputElement,
  { inputErrorClass, errorClass }
) {
  const errorMessageEl = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  console.log(inputElement.validationMessage);
  errorMessageEl.textContent = inputElement.validationMessage;
  errorMessageEl.classList.add(errorClass);
}

//Check input is valid//
function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

// Add event listeners to form inputs //
function setEventListeners(formElement, settings) {
  const { inputSelector } = settings;
  const inputList = [...formElement.querySelectorAll(inputSelector)];
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", (e) => {
      checkInputValidity(formElement, inputElement, settings);
    });
  });
}

//Enable Validation for all Forms//
function enableValidation(settings) {
  const formList = [...document.querySelectorAll(settings.formSelector)];
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    setEventListeners(formElement, settings);
  });
}

//Activate Validation//
enableValidation(validationSettings);
