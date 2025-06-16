import * as Yup from "yup";

export const AgentIncentiveSchema = Yup.object().shape({
  psmbruid: Yup.string()
    .max(255, "Length cannot more than 255")
    .required("Field is required"),
    psincsts: Yup.string()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
    psinctyp: Yup.string()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
    psincamt: Yup.number().nullable().required("Field is required"),
    psincdat: Yup.date().required("Field is required"),
    psincdsc:Yup.string()
    .max(255, "Length cannot more than 255")
    .required("Field is required"),
 
});
