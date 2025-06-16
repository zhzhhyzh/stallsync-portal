import * as Yup from "yup";

export const LoanCalculatorSchema = Yup.object().shape({
  loanamt: Yup.number().min(0, "Value should be more than 0").required("Field is required"),
  tenure: Yup.number().typeError('Value must be a number').min(1, "Value should be more than 0").required("Field is required"),
  startdate: Yup.string().required("Field is required"),
  //maturitydate: Yup.string().required("Field is required"),
  paymentfreq: Yup.number().typeError('Value must be a number').min(1, "Value should be more than 0").required("Field is required"),
  rate: Yup.number().typeError('Value must be a number').min(0, "Value should be more than 0").required("Field is required"),
  eirate: Yup.number().typeError('Value must be a number').min(0, "Value should be more than 0").required("Field is required")
});