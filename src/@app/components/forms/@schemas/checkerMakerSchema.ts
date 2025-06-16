import * as Yup from "yup";

export const checkerMakerSchema = Yup.object().shape({
  pscmkcde: Yup.string().max(10, "Length cannot be longer than 10 characters").required("Field is required"),
  pscmkdsc: Yup.string().max(255, "Length cannot be longer than 255 characters").required("Field is required"),
  pscmklds: Yup.string().max(255, "Length cannot be longer than 255 characters").optional(),
  pscmkgrp: Yup.string().max(10, "Length cannot be longer than 10 characters").required("Field is required"),
  pscmkaac: Yup.string().required("Field is required"),
  pscmkrac: Yup.string().optional(),
  pscmkred: Yup.string().optional(),

  // psstpcrr: Yup.number().min(0).max(1, "Invalid data value"),
});
