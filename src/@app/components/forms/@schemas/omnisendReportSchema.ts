import * as Yup from "yup";

export const ReportSchema = Yup.object().shape({
    prrpttyp: Yup.string().required("Field is required"),
    // psnotcat: Yup.string().required("Field is required"),
//   from: Yup.mixed() 
//   .required("Field is required"),
// //   .when('type', (type) => {
// //       if (type=="R") {
// //           return Yup.mixed()
// //               .required('Start Date is required')
// //       }
// //   }),
//   to: Yup.mixed() 
//   .required("Field is required")
//   .test(
//     "sendDateVSTodayDate-validation",
//     "Send Date cannot before today date",
//     function (value: any) {
//       const from = this.resolve(Yup.ref("from")) as string;

//       if (value < from) {
//         return false;
//       } else {
//         return true;
//       }
//     }
//   ),
    
});