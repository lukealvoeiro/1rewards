import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { Formik, Form } from "formik";

import AddressForm from "./Forms/AddressForm";
import ReviewOrder from "./ReviewOrder";

import validationSchema from "./FormModel/validationSchema";
import checkoutFormModel from "./FormModel/checkoutFormModel";
import formInitialValues from "./FormModel/formInitialValues";

import useStyles from "./styles";
import SquareFormPayment from "./Forms/SquareFormPayment";

const steps = ["Customer Information", "Review Order", "Pay for Order "];
const { formId, formField } = checkoutFormModel;

function _renderStepContent(step, isLoad) {
  switch (step) {
    case 0:
      return <AddressForm formField={formField} />;
    case 1:
      return <ReviewOrder />;
    case 2:
      return <SquareFormPayment />;
    default:
      return <div>Not Found</div>;
  }
}

export default function CheckoutPage() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  function _handleSubmit(values, actions) {
    if (!isLastStep) {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <React.Fragment>
      <Typography component="h1" variant="h4" align="center">
        Checkout
      </Typography>
      <Stepper
        activeStep={activeStep}
        className={classes.stepper}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <React.Fragment>
        <Formik
          initialValues={formInitialValues}
          validationSchema={currentValidationSchema}
          onSubmit={_handleSubmit}
        >
          {activeStep === 2
            ? _renderStepContent(activeStep)
            : ({ isSubmitting }) => (
                <Form id={formId}>
                  {_renderStepContent(activeStep)}

                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button onClick={_handleBack} className={classes.button}>
                        Back
                      </Button>
                    )}
                    <div className={classes.wrapper}>
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        {isLastStep ? "Pay" : "Next"}
                      </Button>
                      {isSubmitting && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </div>
                  </div>
                </Form>
              )}
        </Formik>
      </React.Fragment>
    </React.Fragment>
  );
}
