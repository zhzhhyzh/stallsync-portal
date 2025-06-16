import dayjs from "dayjs";
import * as Yup from "yup";

export const pushNotificationParamSchema = Yup.object().shape({
  psactaps: Yup.string().nullable().required("Field is required"),
  psactape: Yup.string()
    .nullable().required("Field is required")
    .test(
      "actionEndTimeVSactionStartTime-validation",
      "End Time cannot less than Start Time",
      function (value: any) {
        const actionStartTIme =  this.resolve(Yup.ref("psactaps")) as string;
        let startTime = dayjs(actionStartTIme, { format: "HH:mm" });
        let endTime = dayjs(value, { format: "HH:mm" });
        if(startTime <= endTime){
          return true;
        }else{
          return false;
        }
      }
    ),
    psatyaps: Yup.string().nullable().required("Field is required"),
    psatyape: Yup.string()
    .nullable().required("Field is required")
    .test(
      "activityEndTimeVSactivityStartTime-validation",
      "End Time cannot less than Start Time",
      function (value: any) {
        const activityStartTIme =  this.resolve(Yup.ref("psatyaps")) as string;
        let startTime = dayjs(activityStartTIme, { format: "HH:mm" });
        let endTime = dayjs(value, { format: "HH:mm" });
        if(startTime <= endTime){
          return true;
        }else{
          return false;
        }
      }
    ),
});
