import * as Yup from "yup";

export const MbrProfileSchema = Yup.object().shape({
  psmbreml: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmbrnam: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmbrphn: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
 
});

