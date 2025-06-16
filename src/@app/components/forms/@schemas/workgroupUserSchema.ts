import * as Yup from "yup";

export const WorkgroupUserSchema = Yup.object().shape({
    prwrkusr: Yup.string().max(10, "Length cannot more than 10").required("Workgroup User is required"),
    // prwrkcde: Yup.string().max(255).required("Workgroup Code is required"),
    prspvind: Yup.string().required("Supervisor Indicator is requred"),
});
