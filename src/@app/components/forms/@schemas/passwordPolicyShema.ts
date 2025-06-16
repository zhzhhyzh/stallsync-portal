import * as Yup from "yup";

export const PasswordPolicySchema = Yup.object().shape({
  prpwdatm: Yup.number().required("Field is required"),
  pratmmsg: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  prpwdlen: Yup.number().required("Field is required"),
  prlenmsg: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  prpwdfrq: Yup.number().required("Field is required"),
  prfrqmsg: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
});