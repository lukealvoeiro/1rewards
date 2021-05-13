import * as Yup from "yup";
import checkoutFormModel from "./checkoutFormModel";
const {
  formField: { firstName, lastName, email, phoneNumber },
} = checkoutFormModel;

const form = [
  Yup.object().shape({
    [firstName.name]: Yup.string().required(`${firstName.requiredErrorMsg}`),
    [lastName.name]: Yup.string().required(`${lastName.requiredErrorMsg}`),
    [email.name]: Yup.string()
      .required(`${email.requiredErrorMsg}`)
      .test("valid", email.invalidErrorMsg, (val) => {
        if (val) {
          const re = /\S+@\S+\.\S+/;
          return re.test(val);
        }
        return false;
      }),
    [phoneNumber.name]: Yup.string()
      .required(`${phoneNumber.requiredErrorMsg}`)
      .test("valid", phoneNumber.invalidErrorMsg, (val) => {
        if (val) {
          const re = /\+1\d{10}/;
          return re.test(val);
        }
        return false;
      }),
  }),
];

export default form;
