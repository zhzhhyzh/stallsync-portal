import * as Yup from "yup";

export const QueueProductCodeSchema = Yup.object().shape({
  //   prwrkcde: Yup.string().max(10).required("Workgroup Code is required"),
  //   prwrkdsc: Yup.string().max(255).required("Workgroup Description is required"),
  prprodcd: Yup.string().max(10, "Length cannot more than 10").required("Product Code is required"),
  // prasgmtd: Yup.string().max(255, "Length cannot more than 255").required("Assignment Method is required"),
});
