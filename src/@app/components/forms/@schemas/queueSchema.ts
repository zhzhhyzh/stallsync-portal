import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9] ?){9}[0-9]$/;

export const queueSchema = Yup.object().shape({
  // prgtycde: Yup.string().max(10).required("General Type is required"),
  prquecod: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  prquedesc: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  prslafreq: Yup.number().integer().optional(),
  prslafcde: Yup.string().max(1, "Length cannot more than 1").optional(),
  prqueldsc: Yup.string().max(50, "Length cannot more than 50").optional(),
  prcaspre: Yup.string().max(5, "Length cannot more than 5").required("Field is required"),
});
