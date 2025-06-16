import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9] ?){9}[0-9]$/;

export const activitySchema = Yup.object().shape({
  practcod: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  practdesc: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  practldsc: Yup.string().max(50, "Length cannot more than 50").optional(),
  praslafq: Yup.number().integer().optional(),
  praslafc: Yup.string().max(1, "Length cannot more than 1").optional(),
  prquecde: Yup.string().max(10, "Length cannot more than 10").optional(),
  prasgmtd: Yup.string().max(50, "Length cannot more than 1").required("Field is required"),
  prwrkcde: Yup.string().max(50, "Length cannot more than 1").required("Field is required"),
});
