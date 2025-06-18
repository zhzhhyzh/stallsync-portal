import * as Yup from "yup";

export const StaffSchema = Yup.object().shape({
  // psstfuid: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfnme: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psmrcuid: Yup.string().nullable().max(25, "Length cannot more than 25").optional(),
  psstftyp: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psstfidt: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psstfidn: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfprp: Yup.string().nullable().max(255, "Length cannot more than 255"),
  psstfnat: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  // psstfsts: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psstfad1: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psstfad2: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psstfpos: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfcit: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfsta: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfha1: Yup.string()
    .nullable()
    .max(255, "Length cannot more than 255")
    .when("psstfsam", {
      is: false,
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  psstfha2: Yup.string()
    .nullable()
    .max(255, "Length cannot more than 255")
    .when("psstfsam", {
      is: false,
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  psstfhpo: Yup.string()
    .nullable()
    .max(25, "Length cannot more than 25")
    .when("psstfsam", {
      is: false,
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  psstfhci: Yup.string()
    .nullable()
    .max(25, "Length cannot more than 25")
    .when("psstfsam", {
      is: false,
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  psstfhst: Yup.string()
    .nullable()
    .max(25, "Length cannot more than 25")
    .when("psstfsam", {
      is: false,
      then: (schema) => schema.required("Field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  psstfsam: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psstfchp: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfeml: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfbnk: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psstfacc: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psstfbnm: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),
  psstfepr: Yup.string().nullable().max(10, "Length cannot more than 10").required("Field is required"),
  psstfehp: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psusrunm: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),

});

