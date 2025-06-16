import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9] ?){9}[0-9]$/;

export const actActSchema = Yup.object().shape({
  // prgtycde: Yup.string().max(10).required("General Type is required"),
  practncd: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  practsts: Yup.string().max(3, "Length cannot more than 3").required("Field is required"),
  practnts: Yup.string().max(3, "Length cannot more than 3").required("Field is required"),
  practind: Yup.string().max(3, "Length cannot more than 3").required("Field is required"),
  // practgen: Yup.string().max(1, "Length cannot more than 1").required("Field is required"),
  // practbyc: Yup.string().max(1, "Length cannot more than 1").required("Field is required"),
  practycde: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  // practcod: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  // practdesc: Yup.string().max(50, "Length cannot more than 50").optional(),
  // prquecod: Yup.string().max(10, "Length cannot more than 10").optional(),
  // prquedesc: Yup.string().max(50, "Length cannot more than 50").optional(),
  practgen: Yup.string().max(150, "Length cannot more than 150").required("Field is required"),
  practbyc: Yup.string().max(150, "Length cannot more than 150").required("Field is required"),

  
});
