import * as Yup from "yup";

export const CredAppLimSchema = Yup.object().shape({
  pscalamt: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  pscaltyp: Yup.string().nullable().max(10, "Length cannot more than 10").required('Field is required'),
  pscalar1: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  pscalar2: Yup.string().nullable().max(10, "Length cannot more than 10"),
  });

