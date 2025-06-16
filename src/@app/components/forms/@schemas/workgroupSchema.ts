import * as Yup from "yup";

export const WorkgroupSchema = Yup.object().shape({
  prwrkcde: Yup.string().max(10, "Length cannot more than 10").required("Workgroup Code is required"),
  prwrkdsc: Yup.string().max(255, "Length cannot more than 255").required("Workgroup Description is required"),
  prwrklds: Yup.string().max(255, "Length cannot more than 255").optional(),
});
