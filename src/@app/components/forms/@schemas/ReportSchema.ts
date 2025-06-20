import * as Yup from "yup";

export const ReportSchema = Yup.object().shape({
   type: Yup.string().max(10, "Length cannot more than 10").required("Field is required")
    
});