import * as Yup from "yup";

export const SegmentSchema = Yup.object().shape({
  pssegcde: Yup.string().max(25, "Length cannot more than 25").required("Field is required"),
  pssegdsc: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
});