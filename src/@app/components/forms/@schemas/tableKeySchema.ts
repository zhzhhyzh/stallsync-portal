import * as Yup from "yup";

export const TableKeySchema = Yup.object().shape({
  pstblkyn: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),
  pstblkys: Yup.number().min(1, "Value should be more than 0").required("Field is required"),
//   pstblnme: Yup.string().max(255, "Length cannot more than 255").required("Field is required"),

});