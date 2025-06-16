import * as Yup from "yup";

export const HolidaySchema = Yup.object().shape({
  // psholcde: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psholday: Yup.number()
    .typeError('Value must be a number')
    .nullable()
    .min(1, 'Value must be at least 1')
    .integer('Value must be an integer'),
  psholdsc: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  pshollds: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  // psholsts: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psholtyp: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psholdat: Yup.date().required("Field is required"),

});
