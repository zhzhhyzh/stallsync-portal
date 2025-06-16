import * as Yup from "yup";

export const MetadataSchema = Yup.object().shape({
  psmdasrc: Yup.string().required("Field is required"),
  psmdagrp: Yup.string().required("Field is required"),
  psmdafle: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psmdafld: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  psmdadsc: Yup.string().max(50, "Length cannot more than 50").required("Field is required"),
  psmdadsp: Yup.string().max(40, "Length cannot more than 40").required("Field is required"),
});