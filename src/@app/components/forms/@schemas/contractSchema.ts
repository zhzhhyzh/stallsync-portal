import * as Yup from "yup";

export const ContractSchema = Yup.object().shape({
  psconuid: Yup.string().max(255, "Length cannot more than 255").optional(),

  // psconsts: Yup.string()
  //   .required("Field is required")
  //   .max(10, "Length cannot more than 10"),

  pscontyp: Yup.string().max(10, "Length cannot more than 10").optional(),

  psconesd: Yup.string().optional(),
  psconexd: Yup.string().optional(),
  psmbruid: Yup.string()
    .required("Field is required")
    .max(255, "Length cannot more than 255"),

    psciftyp: Yup.string()
    .required("Field is required"),
    pscifidt: Yup.string()
    .required("Field is required"),
    pscifidn: Yup.string()
    .required("Field is required").max(255, "Length cannot more than 255"),

    pscifphn: Yup.string()
    .required("Field is required")

    .max(255, "Length cannot more than 255"),
    
    pscifeml: Yup.string().email("Invalid email format")
    .required("Field is required")

    .max(255, "Length cannot more than 25"),
  psconamt: Yup.number()
    .required("Field is required")
    .test("is-decimal", "Invalid value", (value) =>
      /^\d+(\.\d{1,2})?$/.test(String(value))
    ),

  psprdcde: Yup.string()
    .required("Field is required")
    .max(10, "Length cannot more than 10"),

  pscomstp: Yup.string()
    .required("Field is required")
    .max(10, "Length cannot more than 10"),

  psconsbd: Yup.string().required("Field is required"),
  // psconlcd: Yup.string().optional(),
});
