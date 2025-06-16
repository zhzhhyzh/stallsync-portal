import * as Yup from "yup";

export const ProdSchema = Yup.object().shape({
  psprdcde: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprdccr: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprdoct: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdost: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprdocn: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprdotl: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdoex: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  psprdoem: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdows: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdpmd: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprddsc: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdoa1: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdiss: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprdopc: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psprddmg: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  psprdoa2: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  psprdoa3: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  psprdoa4: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  psprdmin: Yup.number().typeError('Value must be a number').required("Field is required"),
  psprdmul: Yup.number().typeError('Value must be a number').optional(),
  psprdten: Yup.number().typeError('Value must be a number').optional(),
  psprdfsz: Yup.number().typeError('Value must be a number').optional(),
  psprddac: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprdda2: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psprddtp: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psprdsdd: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),

  
  // psfeefqt: Yup.string().nullable().max(50, "Length cannot more than 50").required("Field is required"),
  // psfeeevt: Yup.string()
  //   .nullable()
  //   .max(10, "Length cannot more than 10")
  //   .required("Field is required"),
  // psfeebin: Yup.string()
  //   .nullable()
  //   .max(10, "Length cannot more than 10")
  //   .required("Field is required"),
  // psfeeamt: Yup.number().typeError('Value must be a number').nullable().min(0, "Value should be more than 0").max(9999999999999.99, "Invalid data value"),
  // psfeeper: Yup.number().typeError('Value must be a number').nullable().min(0, "Value should be more than 0").max(9999999999999.99, "Invalid data value"),
  // psfeemch: Yup.number().nullable(),
  // psfeench: Yup.number()
  //   .nullable()
  //   .test(
  //     "minimum",
  //     "Minimum Charge must be less than Maximum Charge",
  //     function (value) {
  //       const typeValue = this.resolve(Yup.ref("psfeemch")) as string;
  //       // console.log(value)

  //       if (parseInt(typeValue) && value && value > parseInt(typeValue)) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   ),
});
