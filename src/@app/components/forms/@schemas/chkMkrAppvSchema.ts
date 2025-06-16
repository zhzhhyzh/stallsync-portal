import * as Yup from "yup";

export const ChkMkrAppvSchema = Yup.object().shape({
    psrqtsts: Yup.string().max(10, "Length cannot longer than 10 characters").required("Field is required"),
   

});