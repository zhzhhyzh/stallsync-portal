import * as Yup from "yup";

export const ComparSchema = Yup.object().shape({
  // pscomuid: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  pscomcde: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  pscomsts: Yup.string().nullable().max(10, "Length cannot more than 10"),
  pscomnme: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  pscomspv: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  pscompre: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  });

