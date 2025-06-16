import * as Yup from "yup";

export const GeneralTypeSchema = Yup.object().shape({
  prgtycde: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  prgtydsc: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  prgtylen: Yup.number().min(1, "Value should be more than 0").required("Field is required"),
  prgtyman: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  prgtycat: Yup.string().max(255, "Length cannot more than 255").required("Field is required")

});