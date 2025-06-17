import * as Yup from "yup";

export const MerchantSchema = Yup.object().shape({
  psmrcuid: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psmrcdsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmrcnme: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmrclds: Yup.string().nullable().max(255, "Length cannot more than 255"),
  // psmrcjdt: Yup.date().required("Field is required"),
  psmrcown: Yup.string().nullable().max(25, "Length cannot more than 25").optional(),
  psmrcssm: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmrcssc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmrcsts: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psmrcbnk: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psmrcacc: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psmrcbnm: Yup.string().nullable().max(255, "Length cannot more than 25").required("Field is required"),
  psmrcsfi: Yup.string().nullable().max(255, "Length cannot more than 255"),
  psmrcppi: Yup.string().nullable().max(255, "Length cannot more than 255"),

});

