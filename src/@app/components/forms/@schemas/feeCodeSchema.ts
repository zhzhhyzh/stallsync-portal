import * as Yup from "yup";

export const FeeCodeSchema = Yup.object().shape({
  psfeecod: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psfeedsc: Yup.string().nullable().max(150, "Length cannot more than 150").required("Field is required"),
  psfeelds: Yup.string().nullable().max(150, "Length cannot more than 150").required("Field is required"),
  // psfeestt: Yup.string().nullable().max(1,"Length cannot more than 1").required("Field is required"),
  psfeetcd: Yup.string().nullable().max(10, "Length cannot more than 10").optional(),
  psfeeiet: Yup.string().nullable().max(10, "Length cannot more than 10").optional(),
  psfeegan: Yup.string().nullable().max(50, "Length cannot more than 50").optional(),


});
