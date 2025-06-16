import * as Yup from "yup";

export const NotificationGroupSchema = Yup.object().shape({
    psngpcde: Yup.string().max(25, "Length cannot more than 25").required("Field is required"),
    psngpdsc: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
    psngplds: Yup.string().optional(),
    // psngpsts: Yup.string().required("Field is required"),
});