import * as Yup from "yup";

export const ProdFeeSchema = Yup.object().shape({
  psfeecde: Yup.string().nullable().required("Field is required"),
  psfeefqv: Yup.number().typeError('Value must be a number').required("Field is required"),
  psfeefqt: Yup.string().nullable().max(50, "Length cannot more than 50").required("Field is required"),
  psfeeevt: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psfeebin: Yup.string()
    .nullable()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psfeeamt: Yup.number().typeError('Value must be a number').nullable().min(0, "Value should be more than 0").max(9999999999999.99, "Invalid data value"),
  psfeeper: Yup.number().typeError('Value must be a number').nullable().min(0, "Value should be more than 0").max(9999999999999.99, "Invalid data value"),
  psfeemch: Yup.number().nullable(),
  psfeench: Yup.number()
    .nullable()
    .test(
      "minimum",
      "Minimum Charge must be less than Maximum Charge",
      function (value) {
        const typeValue = this.resolve(Yup.ref("psfeemch")) as string;
        // console.log(value)

        if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
          return false;
        } else {
          return true;
        }
      }
    ),
});
