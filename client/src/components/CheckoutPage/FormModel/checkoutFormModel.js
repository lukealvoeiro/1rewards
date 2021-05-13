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
      label: "Email*",
      requiredErrorMsg: "Email address is required",
      invalidErrorMsg: "Email address provided is invalid",
    },
    phoneNumber: {
      name: "phoneNumber",
      label: "Phone Number*",
      requiredErrorMsg: "Phone number is required",
      invalidErrorMsg: "Phone number is not of format +1xxxxxxxxxx",
    },
  },
};

export default form;
