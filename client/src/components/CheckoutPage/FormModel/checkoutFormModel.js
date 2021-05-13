const form = {
  formId: "checkoutForm",
  formField: {
    firstName: {
      name: "firstName",
      label: "First name*",
      requiredErrorMsg: "First name is required",
    },
    lastName: {
      name: "lastName",
      label: "Last name*",
      requiredErrorMsg: "Last name is required",
    },
    email: {
      name: "email",
      label: "Email",
      requiredErrorMsg: "Email address is required",
    },
    phoneNumber: {
      name: "phoneNumber",
      label: "Phone Number",
      requiredErrorMsg: "Phone number is required",
    },
    cardNumber: {
      name: "cardNumber",
      label: "Card number*",
      requiredErrorMsg: "Card number is required",
      invalidErrorMsg: "Card number is not valid (e.g. 4111111111111)",
    },
    expiryDate: {
      name: "expiryDate",
      label: "Expiry date*",
      requiredErrorMsg: "Expiry date is required",
      invalidErrorMsg: "Expiry date is not valid",
    },
    cvv: {
      name: "cvv",
      label: "CVV*",
      requiredErrorMsg: "CVV is required",
      invalidErrorMsg: "CVV is invalid (e.g. 357)",
    },
  },
};

export default form;
