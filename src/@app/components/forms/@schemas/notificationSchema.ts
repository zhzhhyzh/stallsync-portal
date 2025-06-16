import dayjs from "dayjs";
import * as Yup from "yup";

export const NotificationTemplateShema = Yup.object().shape({
  psnotcde: Yup.string()
    .max(10, "Length cannot more than 10")
    .required("Field is required"),
  psnotdsc: Yup.string()
    .max(255, "Length cannot more than 255")
    .required("Field is required"),
  psnotcat: Yup.string().required("Field is required"),
  psmsgttl: Yup.string()
    .max(250, "Length cannot more than 250")
    .required("Field is required"),
  //psmsgbdy: Yup.string().required("Field is required"),
  psmsgbdy: Yup.string().when("psnotchn", {
    is: "WAP",
    then: (schema: any) => schema.optional(),
    otherwise: (schema: any) => schema.required("Field is required"),
  }),
  psmsptyp: Yup.string().when("psnotchn", {
    is: "PSH",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.optional(),
  }),
  psmspstp: Yup.string().when("psmsptyp", {
    is: "ACTION",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.nullable().optional(),
  }),
  // pskeybdy: Yup.array().when("psmsptyp", {
  //   is: "ACTION",
  //   then: (schema: any) => schema.min(1, "Field is required"),
  //   otherwise: (schema: any) => schema.optional(),
  // }),
});

export const NotificationAdhocShema = Yup.object().shape({
  segment: Yup.string().test(
    "segment-validation",
    "Field is required",
    function (value) {
      const recipientType = this.resolve(Yup.ref("recipientType")) as string;
      if (recipientType === "SEGMENT" && value === undefined) {
        return false;
      } else {
        return true;
      }
    }
  ),
  manualRecipient: Yup.string().test(
    "manualRecipient-validation",
    "Field is required",
    function (value) {
      const recipientType = this.resolve(Yup.ref("recipientType")) as string;
      const recipientsUploadFlag = this.resolve(
        Yup.ref("recipientsUploadFlag")
      ) as boolean;

      if (
        recipientType === "MANUAL" &&
        !recipientsUploadFlag &&
        value === undefined
      ) {
        return false;
      } else {
        return true;
      }
    }
  ),
  recipientsUpload: Yup.string().test(
    "recipientsUpload-validation",
    "Incorrect file or data format",
    function (value) {
      const recipientType = this.resolve(Yup.ref("recipientType")) as string;
      const recipientsUploadFlag = this.resolve(
        Yup.ref("recipientsUploadFlag")
      ) as boolean;

      if (
        recipientType === "MANUAL" &&
        recipientsUploadFlag &&
        value === undefined
      ) {
        return false;
      } else {
        return true;
      }
    }
  ),
  psmsgttl: Yup.string()
    .max(250, "Length cannot more than 250")
    .required("Field is required"),
  //psmsgbdy: Yup.string().required("Field is required"),
  psmsgbdy: Yup.string().when("psnotchn", {
    is: "WAP",
    then: (schema: any) => schema.optional(),
    otherwise: (schema: any) => schema.required("Field is required"),
  }),
  sendDate: Yup.string()
    .nullable()
    .test("sendDate-validation", "Field is required", function (value) {
      const sendType = this.resolve(Yup.ref("sendType")) as string;
      if (sendType === "SCHEDULED" && (value === undefined || value === null)) {
        return false;
      } else {
        return true;
      }
    })
    .test(
      "sendDateVSTodayDate-validation",
      "Send Date cannot before today date",
      function (value: any) {
        const sendType = this.resolve(Yup.ref("sendType")) as string;
        const sendTime = this.resolve(Yup.ref("sendTime")) as string;
        const todayDate = new Date();

        //Combined Send Date and Send Time
        let newSendDate = new Date(value);
        let convertedSendTime = dayjs(sendTime, { format: "HH:mm" });
        newSendDate.setHours(
          convertedSendTime.hour(),
          convertedSendTime.minute()
        );

        if (sendType === "SCHEDULED" && newSendDate < todayDate) {
          return false;
        } else {
          return true;
        }
      }
    ),
  sendTime: Yup.string()
    .nullable()
    .test("sendTime-validation", "Field is required", function (value) {
      const sendType = this.resolve(Yup.ref("sendType")) as string;
      if (sendType === "SCHEDULED" && (value === undefined || value === null)) {
        return false;
      } else {
        return true;
      }
    }),
  // expiry_date: Yup.string()
  //   .nullable()
  //   .test("expiryDate-validation", "Field is required", function (value) {
  //     const sendType = this.resolve(Yup.ref("sendType")) as string;
  //     if (sendType === "SCHEDULED" && (value === undefined || value === null)) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   })
  //   .test(
  //     "expiryDateVSTodayDate-validation",
  //     "Expiry Date cannot before today date",
  //     function (value: any) {
  //       const sendType = this.resolve(Yup.ref("sendType")) as string;

  //       const todayDate = new Date();
  //       const expiryDate = new Date(value);

  //       if (sendType === "SCHEDULED" && expiryDate < todayDate) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   )
  //   .test(
  //     "expiryDateVSSendDate-validation",
  //     "Expiry Date cannot before Send date",
  //     function (value: any) {
  //       const sendType = this.resolve(Yup.ref("sendType")) as string;
  //       const sendDate = this.resolve(Yup.ref("sendDate")) as string;
  //       const sendTime = this.resolve(Yup.ref("sendTime")) as string;
  //       const expiryDate = new Date(value);

  //       //Combined Send Date and Send Time
  //       let newSendDate = new Date(sendDate);
  //       let convertedSendTime = dayjs(sendTime, { format: "HH:mm" });
  //       newSendDate.setHours(
  //         convertedSendTime.hour(),
  //         convertedSendTime.minute()
  //       );

  //       if (sendType === "SCHEDULED" && expiryDate < newSendDate) {
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }
  //   ),
  psmsptyp: Yup.string().when("psnotchn", {
    is: "PSH",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.optional(),
  }),
  psmspstp: Yup.string().when(["isTemplate", "psmsptyp"], {
    is: (isTemplate: boolean, psmsptyp: string) => isTemplate === false && psmsptyp === "ACTION",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.nullable().optional(),
  }),
  // pskeybdy: Yup.array().when(["isTemplate", "psmsptyp"], {
  //   is: (isTemplate: boolean, psmsptyp: string) => isTemplate === false && psmsptyp === "ACTION",
  //   then: (schema: any) => schema.min(1, "Field is required"),
  //   otherwise: (schema: any) => schema.optional(),
  // }),
  // pschncde: Yup.string().when("psnotchn", {
  //   is: (psnotchn: string) => psnotchn === "EML" || psnotchn === "EMLE",
  //   then: (schema: any) => schema.required("Field is required"),
  //   otherwise: (schema: any) => schema.optional(),
  // }),
  psnotcat: Yup.string().when("psnotchn", {
    is: (psnotchn: string) => psnotchn === "EML" || psnotchn === "EMLE",
    then: (schema: any) => schema.required("Field is required"),
    otherwise: (schema: any) => schema.optional(),
  }),
});
