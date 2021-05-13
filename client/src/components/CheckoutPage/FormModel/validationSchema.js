import * as Yup from "yup";
import checkoutFormModel from "./checkoutFormModel";
const {
  formField: { firstName, lastName, email, phoneNumber },
} = checkoutFormModel;

const form = [
  Yup.object().shape({
    [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),
    [lastName.name]: Yup.string().required(`${lastName.requiredErrorMsg}`),
    [email.name]: Yup.string().required(`${email.requiredErrorMsg}`),
    [phoneNumber.name]: Yup.string()
      .nullable()
      .required(`${phoneNumber.requiredErrorMsg}`),
  }),
];

export default form;
