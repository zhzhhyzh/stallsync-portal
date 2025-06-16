import * as Yup from "yup";

export const FunctionsSchema = Yup.object().shape({
  prfuncde: Yup.string().max(10, "Length cannot more than 10").required("Field is required"),
  prfunnme: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  prfunlnm: Yup.string().max(255, "Length cannot more than 255"),
  prfungrp: Yup.string().required("Field is required"),
});