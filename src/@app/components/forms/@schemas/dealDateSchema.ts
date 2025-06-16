import * as Yup from "yup";

export const DealDateSchema = Yup.object().shape({
  psddtmnt: Yup.number().required("Field is required"),
  psddtyer: Yup.number()
  .typeError("Year must be a number")
  .integer("Year must be an integer")
  .min(1900, "Year must be at least 1900")
  // .max(new Date().getFullYear(), "Year cannot be in the future")
  .required("Field is required"),
  psddtvl1: Yup.date().required("Field is required"),
  psddtvl2: Yup.date().required("Field is required"),

});
