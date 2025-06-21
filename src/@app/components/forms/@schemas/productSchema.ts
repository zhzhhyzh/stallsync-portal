import * as Yup from "yup";

export const ProductSchema = Yup.object().shape({
  psprduid: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psprddsc: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psprdnme: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psprdlds: Yup.string().nullable().max(255, "Length cannot more than 255"),
  // psmrcjdt: Yup.date().required("Field is required"),
  psprdlsr: Yup.number().nullable(),
  psprdtpr: Yup.number().nullable().required("Field is Required"),
  psprdcat: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psprdtyp: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psprdsts: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psprdpri: Yup.number().nullable().required("Field is Required"),
  psmrcuid: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psprdimg: Yup.string().nullable().max(255, "Length cannot more than 255"),


});

