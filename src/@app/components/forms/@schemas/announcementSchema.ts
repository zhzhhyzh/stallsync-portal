import * as Yup from "yup";

export const announcementSchema = Yup.object().shape({
    psannttl: Yup.string().nullable().max(50, "Length cannot more than 50").required("Field is required"),
    psannmsg: Yup.string().nullable().required("Field is required"),
    psanntyp: Yup.string().nullable().max(3, "Length cannot more than 3").required("Field is required"),
    psannsts: Yup.string().nullable().max(10, "Value should be more than 10"),






});

