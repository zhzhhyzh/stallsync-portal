import * as Yup from "yup";

export const RoleCodeSchema = Yup.object().shape({
  psrolcde: Yup.string().nullable().max(25, "Length cannot more than 10").required("Field is required"),
  psroldsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psrollds: Yup.string().nullable().max(255, "Length cannot more than 255"),
 
  psrolibi: Yup.string().nullable().max(10, "Length cannot more than 10"),
  psrolibm: Yup.string().nullable().max(10, "Length cannot more than 10"),

  });

