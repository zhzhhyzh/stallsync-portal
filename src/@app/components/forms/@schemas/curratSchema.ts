import * as Yup from "yup";

export const CurratSchema = Yup.object().shape({
  pscurcde: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  pscursts: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),

  pscurrat: Yup.number().typeError('Value must be a number').required("Field is required").nullable(),

});
