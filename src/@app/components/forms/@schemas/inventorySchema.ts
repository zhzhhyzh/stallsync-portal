import * as Yup from "yup";

export const InventorySchema = Yup.object().shape({
  // psprduid: Yup.string().nullable().max(25, "Length cannot more than 25").required("Field is required"),
  psinvven: Yup.string().nullable().max(255, "Length cannot more than 255").required("Field is required"),

  psinvpri: Yup.number().nullable().required("Field is Required"),
  psinvqty: Yup.number().nullable().required("Field is Required"),


});

