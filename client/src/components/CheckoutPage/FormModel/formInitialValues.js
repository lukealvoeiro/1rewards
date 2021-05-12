import checkoutFormModel from "./checkoutFormModel";
const {
  formField: { firstName, lastName, email, phoneNumber },
} = checkoutFormModel;

export default {
  [firstName.name]: "",
  [lastName.name]: "",
  [email.name]: "",
  [phoneNumber.name]: "",
};
