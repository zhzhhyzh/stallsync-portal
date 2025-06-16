import * as Yup from "yup";

export const NotificationScheduleSchema = Yup.object().shape({
  psschstd: Yup.date().required("Field is required"),
  startTime: Yup.date().required("Field is required"),
  psschexp: Yup.string().required("Field is required"),
  psschfrq: Yup.string().required("Field is required"),
  psschfrv: Yup.number().typeError('Value must be a number').min(1, "Value should be more than 0").required("Field is required"),
});