import * as Yup from "yup";

export const GeneralCodeSchema = Yup.object().shape({
  // prgtycde: Yup.string().max(10).required("General Type is required"),
  prgecode: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  prgedesc: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),

});