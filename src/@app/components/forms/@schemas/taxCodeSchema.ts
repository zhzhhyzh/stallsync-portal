import * as Yup from "yup";

export const TaxCodeSchema = Yup.object().shape({
  pstaxcde: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  pstaxdsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  pstaxlds: Yup.string().nullable().max(255, "Length cannot more than 255"),

  pstaxrat: Yup.number().typeError('Value must be a number').required("Field is required").min(0, "Value should be more than 0").max(99999.99999, "Value Cannot be More than 99999.99999"),

  pstaxgla: Yup.string().nullable().max(50, "Length cannot more than 50"),
});

