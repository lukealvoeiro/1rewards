import * as Yup from "yup";
import moment from "moment";
import checkoutFormModel from "./checkoutFormModel";
const {
  formField: {
    firstName,
    lastName,
    email,
    phoneNumber,
    cardNumber,
    expiryDate,
    cvv,
  },
} = checkoutFormModel;

const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;

export default [
  Yup.object().shape({
    [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),
    [lastName.name]: Yup.string().required(`${lastName.requiredErrorMsg}`),
    [email.name]: Yup.string().required(`${email.requiredErrorMsg}`),
    [phoneNumber.name]: Yup.string()
      .nullable()
      .required(`${phoneNumber.requiredErrorMsg}`),
  }),
];
