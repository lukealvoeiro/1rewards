import checkoutFormModel from "./checkoutFormModel";
const {
  formField: { firstName, lastName, email, phoneNumber },
} = checkoutFormModel;

const form = {
  [firstName.name]: "",
  [lastName.name]: "",
  [email.name]: "",
  [phoneNumber.name]: "",
};

export default form;
