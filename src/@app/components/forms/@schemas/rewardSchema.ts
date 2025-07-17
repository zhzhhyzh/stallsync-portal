import * as Yup from "yup";

export const RewardSchema = Yup.object().shape({
  psrwduid: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psrwddsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psrwdnme: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psrwdlds: Yup.string().nullable().max(255, "Length cannot more than 255"),
  psrwdtyp: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psrwddva: Yup.number().typeError('Value must be a number').required("Field is required"),
  psrwdqty: Yup.number().typeError('Value must be a number').required("Field is required"),
  psrwdcap: Yup.number().typeError('Value must be a number').optional(),
  psrwdmin: Yup.number().typeError('Value must be a number').optional(),
});

