import * as Yup from "yup";

export const GlaSchema = Yup.object().shape({
  psglacno: Yup.string().nullable().max(25, "Length cannot more than 50").required("Field is required"),
  psgladsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psglalds: Yup.string().nullable().max(255, "Length cannot more than 255"),

  psglactp: Yup.string().nullable().max(10, "Length cannot more than 10").required('Field is required'),

  psglablr: Yup.string().nullable().max(10, "Length cannot more than 10"),
});

