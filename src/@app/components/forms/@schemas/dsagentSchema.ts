import * as Yup from "yup";

export const DsagentSchema = Yup.object().shape({
  psdsgcde: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psdsgsqn: Yup.number()
    .typeError('Value must be a number')
    .nullable()
    .min(1, 'Value must be at least 1')
    .integer('Value must be an integer'),
  psdsgdsc: Yup.string().nullable().required("Field is required").max(255, "Length cannot more than 255"),
  psdsglds: Yup.string().nullable().optional().max(255, "Length cannot more than 255"),
  psdsgpre: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgsts: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgtue: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgvfv: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psdsgvfq: Yup.string().nullable().required("Field is required").max(10, "Length cannot more than 10"),
  psdsgagf: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgaft: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgmts: Yup.number().typeError('Value must be a number').optional().nullable(),

  //Uplevel
  psdsgugs: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgups: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgusd: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgunr: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsguss: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgupr: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgupn: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgsst: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgnst: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),

  //Uplevel
  psdsgmgs: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmps: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmsd: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmnr: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmss: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmdr: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmpr: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgmpn: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmpd: Yup.number().typeError('Value must be a number').optional().nullable(),
  psdsgmmt: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),
  psdsgmnt: Yup.string().nullable().optional().max(10, "Length cannot more than 10"),

});
