import * as Yup from "yup";

export const PapparSchema = Yup.object().shape({
  //   prwrkcde: Yup.string().max(10).required("Workgroup Code is required"),
  //   prwrkdsc: Yup.string().max(255).required("Workgroup Description is required"),
  psprdcde: Yup.string().max(10, "Length cannot more than 10").optional(),
  pspapprt: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pspapppm: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pspappps: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pspapitm: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pspapits: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pspapfem: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  pspapfes: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
});
