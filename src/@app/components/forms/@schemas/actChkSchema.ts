import * as Yup from "yup";

const contactNoRegExp = /^(?:[0-9] ?){9}[0-9]$/;

export const actChkSchema = Yup.object().shape({
  prchklcod: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  prchkldsc: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  prchkllds: Yup.string().max(50, "Length cannot more than 50").optional(),
  prchklrmk: Yup.string().max(50, "Length cannot more than 50").optional(),
  practcod: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  practdesc: Yup.string().max(50, "Length cannot more than 50").optional(),
  prquecod: Yup.string().max(10, "Length cannot more than 10").optional(),
  prquedesc: Yup.string().max(50, "Length cannot more than 50").optional(),
  // prcaspre: Yup.string().max(5).required("Case Prefix is required"),
});
