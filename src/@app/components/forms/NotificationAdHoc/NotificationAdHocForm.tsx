// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  RadioGroup,
  Stack,
  Radio,
  Button,
  IconButton,
  Tooltip as ChakraTooltip,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Link,
  Switch,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import {
  DatePicker,
  Space,
  TimePicker,
  Tooltip,
  Upload,
  UploadFile,
  Image,
  Typography,
  Select as AntdSelect,
} from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import dayjs from "dayjs";
import EmailNotification from "../NotificationTemplate/EmailNotification";
import EmailHTMLNotification from "../NotificationTemplate/EmailHTMLNotification";
import PushNotification from "../NotificationTemplate/PushNotification";
import useFetchDDLSegment from "@app/hooks/selector/useFetchDDLSegment";
import { UploadOutlined } from "@ant-design/icons";
import { AiOutlineUpload } from "react-icons/ai";
import { SlMagnifier } from "react-icons/sl";
import {
  DownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { UploadedFile } from "@app/interfaces/uploaded.types";
import { BsFillEyeFill, BsSend } from "react-icons/bs";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import TestReceiverTable from "../NotificationTemplate/TestReceiverTable";
import {
  download,
  openGlobalModal,
  postBulkUploadFile,
} from "@app/redux/app/slice";
import { sendNewMessage } from "@app/redux/notificationtemplate/slice";
import PreviewSegmentTable from "./PreviewSegmentTable";
import { NotificationAdhocShema } from "../@schemas/notificationSchema";
import useFetchDDLCustomer from "@app/hooks/selector/useFetchDDLCustomer";
import useFetchDDLChannelSender from "@app/hooks/selector/useFetchDDLChannelSender";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import WhatsappNotification from "../NotificationTemplate/WhatsappNotification";
import SubHeader from "@app/components/common/Header/SubHeader";

export default function NotificationScheduleDetailForm(props: any) {
  const { sendRequest, loading } = useApi({
    title: "Notification Schedule Detail",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  //const [detailData] = useFetchScheduleDetail(id, id2);
  const [ddlSegment] = useFetchDDLSegment();
  const [ddlChannelSender] = useFetchDDLChannelSender();

  const [isExist, setIsExist] = useState(false);
  const [ddlData] = useFetchDDL({
    code: ["NOTCHNL", "FREQ", "MBRNTP", "NOTCATG"],
  });
  const [ddlCustomerData] = useFetchDDLCustomer();

  // const [recipientType, setRecipientType] = useState("SEGMENT");
  // const [sendType, setSendType] = useState("SENDNOW");

  const { Dragger } = Upload;

  const [recipientFile, setRecipientFile] = useState("");
  const [selectedRecipientFile, setSelectedRecipientFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const [pushFile, setPushFile] = useState("");

  const [emailFile, setEmailFile] = useState<any[]>([]);
  const [selectedEmailFile, setSelectedEmailFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const [emailHTMLFile, setEmailHTMLFile] = useState<any[]>([]);
  const [selectedEmailHTMLFile, setSelectedEmailHTMLFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const [emailContent, setEmailContent] = useState("");
  const [customerSource, setCustomerSource] = useState<any[]>([]);

  const initialValues = {
    //Recipient
    segment: "",
    manualRecipient: "",
    manualRecipientArr: [],
    recipientsUpload: "",
    recipientsUploadFlag: false,
    psnotchn: "EML",
    previewSegment: false,
    recipientType: "MANUAL",
    //pschncde: "",
    psmsptyp: "",
    psmspstp: "",
    pskeybdy: [],
    distinctFlag: false,
    psnotcat: "",

    //Messages
    psmsgttl: "",
    psmsgbdy: "",
    psmsgobj: {},
    psmsgurl: "",
    forceLoad: false,
    attachments: "",
    isTemplate: false,
    psnotcde: "",
    psmsgtid: "",
    pswapmsg: "",

    //Send Type
    sendType: "SENDNOW",
    sendDate: "",
    sendTime: "",
    freq_code: "",
    freq_value: "",
    expiry_date: "",

    //Reset flag
    resetFlag: false,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: NotificationAdhocShema,
    onSubmit: (values) => {
      const {
        segment,
        manualRecipient,
        recipientsUpload,
        psnotchn,
        psmsgttl,
        psmsgbdy,
        psmsgobj,
        psmsgurl,
        attachments,
        sendDate,
        sendTime,
        freq_code,
        freq_value,
        expiry_date,
        recipientType,
        sendType,
        psnotcde,
        //pschncde,
        psmsptyp,
        pskeybdy,
        psmspstp,
        isTemplate,
        distinctFlag,
        psnotcat,
        psmsgtid,
      } = values;

      //Combined Send Date and Send Time
      let newSendDate = new Date(sendDate);
      let convertedSendTime = dayjs(sendTime, { format: "HH:mm" });
      newSendDate.setHours(
        convertedSendTime.hour(),
        convertedSendTime.minute(),
        0
      );

      //Combined and merged manualRecipient and UploadRecipient
      let finalReceivers = "";
      let array1 = manualRecipient.split(";");
      let array2 = recipientsUpload.split(";");
      let combinedArray = array1.concat(array2);

      combinedArray = combinedArray
        .filter((value, index, array) => {
          return array.indexOf(value) === index;
        })
        .filter((value) => value.trim() !== "");
      finalReceivers = combinedArray.join(";");

      //Form keyBody in json format if Type is ACTION
      let keyBodyJson = {
        body: {},
      };

      if (psmsptyp === "ACTION") {
        let newArr = [];
        for (var i = 0; i < pskeybdy.length; i++) {
          let obj: ExtraData = pskeybdy[i];

          newArr.push({
            _id: obj._id,
            key: obj.key,
            group: obj.group,
          });
        }
        keyBodyJson.body = newArr;
      } else {
        //Reset Extra Data
        formik.setFieldValue("pskeybdy", []);
      }

      //Validate Extra Data
      let isPassed = false;
      if (psmsptyp === "ACTION" && isTemplate === false) {
        isPassed = validationOnExtraData(pskeybdy);
      } else {
        isPassed = true;
      }

      let postValue = {
        receiver: finalReceivers,
        channel: psnotchn,
        language: "1",
        title: psmsgttl,
        msg: psmsgbdy,
        schedule: sendType === "SCHEDULED" ? true : false,
        schedule_date: newSendDate,
        freq_code,
        freq_value,
        expiry_date,
        segmentCode: segment,
        recipientType: recipientType,
        templateCode: psnotcde,
        //comChannelCode: pschncde,
        messageObj: psmsgobj,
        psmsptyp,
        psmspstp,
        distinctFlag,
        msgUrl: psmsgurl,
        notCategory: psnotcat,
        psmsgtid,
        sendType,
      };

      if (isPassed) {
        onSubmit(postValue);
      }
    },
  });

  useEffect(() => {
    if (Array.isArray(ddlCustomerData)) {
      setCustomerSource(ddlCustomerData);
    }
  }, [ddlCustomerData]);

  useEffect(() => {
    //reset segment , manual recipient and recipient upload
    formik.setFieldValue("segment", "");
    formik.setFieldValue("manualRecipient", "");
    formik.setFieldValue("recipientsUpload", "");
    formik.setFieldValue("previewSegment", false);
    formik.setFieldValue("recipientsUploadFlag", false);
    //formik.setFieldValue("pschncde", "");
    formik.setFieldValue("psnotcat", "");
    formik.setFieldValue("distinctFlag", false);
    setSelectedRecipientFile([]);
    setRecipientFile("");

    //reset FieldTouched and Field Error for segment , manual recipient and recipient upload
    formik.setFieldTouched("segment", false);
    formik.setFieldError("segment", undefined);
    formik.setFieldTouched("manualRecipient", false);
    formik.setFieldError("manualRecipient", undefined);
    //formik.setFieldTouched("pschncde", false);
    formik.setFieldTouched("psnotcat", false);
    //formik.setFieldError("pschncde", undefined);
    formik.setFieldError("psnotcat", undefined);
  }, [formik.values.recipientType]);

  useEffect(() => {
    //reset Schedule Related Fields
    formik.setFieldValue("sendDate", "");
    formik.setFieldValue("sendTime", "");
    formik.setFieldValue("freq_code", "");
    formik.setFieldValue("freq_value", "");
    formik.setFieldValue("expiry_date", "");

    //reset FieldTouched and Field Error for Schedule Related Fields
    formik.setFieldTouched("sendDate", false);
    formik.setFieldError("sendDate", undefined);
    formik.setFieldTouched("sendTime", false);
    formik.setFieldError("sendTime", undefined);
    formik.setFieldTouched("freq_code", false);
    formik.setFieldError("freq_code", undefined);
    formik.setFieldTouched("freq_value", false);
    formik.setFieldError("freq_value", undefined);
    formik.setFieldTouched("expiry_date", false);
    formik.setFieldError("expiry_date", undefined);
  }, [formik.values.sendType]);

  useEffect(() => {
    formik.setErrors({});
    formik.setTouched({});

    //reset Message Title and Message Body
    formik.setFieldValue("psmsgbdy", "");
    formik.setFieldValue("psmsgttl", "");

    //reset FieldTouched and Field Error for Message Title and Message Body
    formik.setFieldTouched("psmsgbdy", false);
    formik.setFieldError("psmsgbdy", undefined);
    formik.setFieldTouched("psmsgttl", false);
    formik.setFieldError("psmsgttl", undefined);

    if (formik.values.recipientType == "MANUAL") {
      formik.setFieldValue("manualRecipient", "");
      formik.setFieldValue("recipientsUpload", "");
      formik.setFieldValue("manualRecipientArr", []);
    }
  }, [formik.values.psnotchn]);

  function resetPage() {
    //Reset validation status
    formik.setErrors({});
    formik.setTouched({});

    formik.setFieldValue("resetFlag", true);

    formik.setFieldValue("recipientsUploadFlag", false);
    formik.setFieldValue("isTemplate", false);

    formik.setFieldValue("psnotchn", "EML");
    formik.setFieldValue("manualRecipient", "");
    formik.setFieldValue("manualRecipientArr", []);
    formik.setFieldValue("recipientsUpload", "");
    formik.setFieldValue("previewSegment", false);
    formik.setFieldValue("segment", "");
    formik.setFieldValue("psnotcde", "");
    //formik.setFieldValue("pschncde", "");
    formik.setFieldValue("psnotcat", "");

    formik.setFieldValue("sendDate", "");
    formik.setFieldValue("sendTime", "");
    formik.setFieldValue("freq_code", "");
    formik.setFieldValue("freq_value", "");
    formik.setFieldValue("expiry_date", "");

    formik.setFieldValue("recipientType", "MANUAL");
    formik.setFieldValue("sendType", "SENDNOW");

    formik.setFieldValue("distinctFlag", false);

    setRecipientFile("");
    setSelectedRecipientFile([]);
    setSelectedEmailFile([]);
    setEmailFile([]);
    setSelectedEmailHTMLFile([]);
    setEmailHTMLFile([]);
    setPushFile("");
    // setRecipientType("SEGMENT");
    // setSendType("SENDNOW");
  }

  function validationOnExtraData(extraDataArr: any[]) {
    let result = true;

    for (var i = 0; i < extraDataArr.length; i++) {
      let dataObj = extraDataArr[i];

      if (dataObj.group == "") {
        result = false;
        let groupElement = document.getElementById("Group-" + dataObj._id);
        if (groupElement) {
          groupElement.style.borderColor = "red";
        }
        let groupErrorElement = document.getElementById(
          "GroupError-" + dataObj._id
        );
        if (groupErrorElement) {
          groupErrorElement.style.display = "block";
          groupErrorElement.innerText = "Field is required";
        }
      }

      if (dataObj.field == "") {
        result = false;
        let fieldElement = document.getElementById("Field-" + dataObj._id);
        if (fieldElement) {
          fieldElement.style.borderColor = "red";
        }
        let fieldErrorElement = document.getElementById(
          "FieldError-" + dataObj._id
        );
        if (fieldErrorElement) {
          fieldErrorElement.style.display = "block";
          fieldErrorElement.innerText = "Field is required";
        }
      }
    }

    return result;
  }

  async function onSubmit(data: any) {
    //Default Attachment
    data.attachment = [];
    //data.recipeints = [];

    //Multiple Upload
    let uploadedEmailFile: String[] = [];

    //Single Upload
    let uploadedFile = "";
    //let uploadedRecipientFile = "";

    if (formik.values.psnotchn === "PSH" && pushFile) {
      if (pushFile !== "") {
        const formData = new FormData();

        //For single upload
        formData.append(`document`, pushFile);

        const { success, message } = await sendRequest({
          fn: postBulkUploadFile(formData),
          formik,
        });

        if (success) {
          //Single Upload
          uploadedFile = message?.document[0]?.sysfnm;
          data.attachment.push(uploadedFile);
        } else {
          return;
        }
      } else {
        data.attachment = [];
      }
    } else if (formik.values.psnotchn === "EML" && emailFile) {
      if (emailFile.length > 0) {
        const formData = new FormData();

        //For Multiple upload purpose
        emailFile.forEach((fileItem, index) => {
          formData.append(`document`, fileItem);
        });

        const { success, message } = await sendRequest({
          fn: postBulkUploadFile(formData),
          formik,
        });

        if (success) {
          //Multiple Upload
          if (message?.document.length > 0) {
            (message?.document).forEach(
              (fileItem: ReturnedFileUploadStatus) => {
                uploadedEmailFile.push(fileItem.sysfnm);
              }
            );
          }

          //Add Existing Uploaded File
          selectedEmailFile.forEach((fileItem: any) => {
            if (fileItem?.fileStatus === "old")
              uploadedEmailFile.push(fileItem.uid);
          });
          data.attachment = uploadedEmailFile;
        } else {
          return;
        }
      } else {
        selectedEmailFile.forEach((fileItem) =>
          uploadedEmailFile.push(fileItem.uid)
        );
        data.attachment = uploadedEmailFile;
      }
    } else if (formik.values.psnotchn === "EMLE" && emailHTMLFile) {
      if (emailHTMLFile.length > 0) {
        const formData = new FormData();

        //For Multiple upload purpose
        emailHTMLFile.forEach((fileItem, index) => {
          formData.append(`document`, fileItem);
        });

        const { success, message } = await sendRequest({
          fn: postBulkUploadFile(formData),
          formik,
        });

        if (success) {
          //Multiple Upload
          if (message?.document.length > 0) {
            (message?.document).forEach(
              (fileItem: ReturnedFileUploadStatus) => {
                uploadedEmailFile.push(fileItem.sysfnm);
              }
            );
          }

          //Add Existing Uploaded File
          selectedEmailHTMLFile.forEach((fileItem: any) => {
            if (fileItem?.fileStatus === "old")
              uploadedEmailFile.push(fileItem.uid);
          });
          data.attachment = uploadedEmailFile;
        } else {
          return;
        }
      } else {
        selectedEmailHTMLFile.forEach((fileItem) =>
          uploadedEmailFile.push(fileItem.uid)
        );
        data.attachment = uploadedEmailFile;
      }
    }

    //Upload Recipients
    // if (recipientFile !== "") {
    //   const formData = new FormData();

    //   //For single upload
    //   formData.append(`document`, recipientFile);

    //   const { success, message } = await sendRequest({
    //     fn: postBulkUploadFile(formData),
    //     formik,
    //   });

    //   if (success) {
    //     //Single Upload
    //     uploadedRecipientFile = message?.document[0]?.sysfnm;
    //     data.recipeints.push(uploadedRecipientFile);
    //   } else {
    //     return;
    //   }
    // } else {
    //   data.recipeints = [];
    // }

    const { success } = await sendRequest({
      fn: sendNewMessage(data),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "New Message",
          message:
            data.sendType === "SCHEDULED"
              ? "Message Sheduled!"
              : "Message Sent!",
        });
        resetPage();
        //if(mode === "ADD") router.back();
      }, 200);
    }
  }

  const genThumbUrl = (file: any) => {
    return URL.createObjectURL(file);
  };

  const handleFileUpload = ({ file }: { file: any }) => {
    if (file.size > 5242880) {
      showModal(dispatch, {
        title: "File Upload",
        message: "File size cannot be more than 5MB",
        status: "error",
      });
    } else {
      if (file.type === "text/csv") {
        formik.setFieldValue("recipientsUploadFlag", true);

        //Single Upload
        //Set File
        setSelectedRecipientFile(() => [
          {
            uid: file?.name,
            name: file?.name,
            status: "done",
            fileStatus: "new",
            url: genThumbUrl(file.originFileObj),
            thumbUrl: genThumbUrl(file.originFileObj),
          },
        ]);

        //Single Upload
        setRecipientFile(file.originFileObj);

        let reader = new FileReader();
        reader.onload = function (e) {
          // Use reader.result
          if (typeof reader.result === "string") {
            let resultString = reader.result;
            let tempArray = resultString.split("\r\n");
            tempArray = tempArray.slice(1);
            tempArray = tempArray
              .filter((value, index, array) => {
                return array.indexOf(value) === index;
              })
              .filter((value) => value.trim() !== "");
            let newString = tempArray.join(";");
            formik.setFieldValue("recipientsUpload", newString);
          }
        };
        reader.readAsText(file.originFileObj);
      } else {
        showModal(dispatch, {
          title: "File Upload",
          message: "Invalid File Type",
          status: "error",
        });
      }
    }
  };

  const handleRemove = (file: any) => {
    // Remove the file from the fileList state
    setSelectedRecipientFile([]);
    setRecipientFile("");
    formik.setFieldValue("recipientsUploadFlag", false);
  };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  function handleEmailFile(files: any[], selectedFile: any[]) {
    setEmailFile(files);
    setSelectedEmailFile(selectedFile);
  }

  function handleEmailHTMLFile(files: any[], selectedFile: any[]) {
    setEmailHTMLFile(files);
    setSelectedEmailHTMLFile(selectedFile);
  }

  function handlePushFile(files: string, selectedFile: any[]) {
    setPushFile(files);
  }

  function handleClose() {
    if (formik.values.previewSegment) {
      formik.setFieldValue("previewSegment", false);
    }
    onClose();
  }

  function handlePreview() {
    formik.setFieldValue("previewSegment", true);
    onOpen();
  }

  async function handleDownload(filename: string) {
    await sendRequest({
      fn: download({
        filename,
      }),
    });
  }

  function validateEmptyMessage() {
    if (formik.values.psmsgttl !== "" && formik.values.psmsgbdy !== "") {
      onOpen();
    } else {
      showModal(dispatch, {
        title: "Send To Test Device",
        message:
          "Please ensure your message title and message body is not empty.",
        status: "error",
      });
    }
  }

  const handleDistinctFlagChange = () => {
    formik.setFieldValue("distinctFlag", !formik.values.distinctFlag);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            New Message
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "New Message",
              },
            ]}
          />
        </Flex>
        <Box
          display={"flex"}
          alignSelf={"center"}
          pr={{
            base: 0,
            md: Spacing.containerPx,
          }}
        >
          <Space size="small">
            <Buttons
              variant={"primary"}
              buttonText="Send"
              buttonLeftIcon={<BsSend />}
              buttonSize={"sm"}
              buttonDefaultType="CUSTOM"
              buttonType="submit"
              buttonFontWeight={"normal"}
              buttonBorderRadius={3}
              buttonHoverBackgroundColor={Colors.SUCCESS3}
              buttonBgColor={Colors.SUCCESS}
              buttonLoading={loading}
            />
          </Space>
        </Box>
      </Flex>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <Box>
            {/* <Text pb={3} fontSize={"19pt"} fontWeight={"500"}>
              1. Recipients
            </Text> */}
            <SubHeader labelText="1. Recipients"/>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <RadioGroup
                  name="recipientType"
                  value={formik.values.recipientType}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "recipientType" },
                    })
                  }
                >
                  <Stack gap={3} direction="row">
                    {/* <Radio value="SEGMENT">Segment</Radio> */}
                    <Radio value="MANUAL">Manual</Radio>
                  </Stack>
                </RadioGroup>
                <Flex w={"100%"}>
                  {formik.values.recipientType === "SEGMENT" ? (
                    <Flex direction="column" gap={6} w={"49%"}>
                      <FormControl
                        id="segment"
                        isInvalid={
                          Boolean(formik.errors.segment) &&
                          Boolean(formik.touched.segment)
                        }
                      >
                        <CustomFormLabel labelText="Segment" />
                        <Flex direction={"row"} alignItems={"center"}>
                          <Select
                            placeholder="Please Select Segment"
                            value={formik.values.segment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            pr={1}
                          >
                            {Array.isArray(ddlSegment) &&
                              ddlSegment?.map((option: any) => {
                                return (
                                  <option
                                    key={option.pssegcde}
                                    value={option.pssegcde}
                                  >
                                    {option.pssegcde} - {option.pssegdsc}
                                  </option>
                                );
                              })}
                          </Select>
                          <ChakraTooltip label="Preview" fontSize="sm">
                            <IconButton
                              variant="outline"
                              size={"sm"}
                              borderRadius={20}
                              colorScheme="teal"
                              sx={{
                                _hover: {
                                  backgroundColor: Colors.SUCCESS2,
                                  color: Colors.BACKGROUND,
                                },
                              }}
                              icon={<SlMagnifier />}
                              aria-label={"preview"}
                              onClick={handlePreview}
                              isDisabled={
                                formik.values.segment === "" ? true : false
                              }
                            />
                          </ChakraTooltip>
                        </Flex>

                        {formik.errors.segment && (
                          <FormErrorMessage>
                            {formik.errors.segment}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="distinctFlag"
                        isInvalid={
                          Boolean(formik.errors.distinctFlag) &&
                          Boolean(formik.touched.distinctFlag)
                        }
                      >
                        <FormLabel>Distinct Recipients?</FormLabel>
                        <Switch
                          id="distinctFlag"
                          name="distinctFlag"
                          isChecked={formik.values.distinctFlag}
                          onChange={handleDistinctFlagChange}
                          onBlur={formik.handleBlur}
                          size="md"
                          colorScheme={"green"}
                          sx={{
                            "span.chakra-switch__track:not([data-checked])": {
                              backgroundColor: Colors.DANGER,
                            },
                          }}
                        />
                        {formik.errors.distinctFlag && (
                          <FormErrorMessage>
                            {formik.errors.distinctFlag}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psnotchn"
                        isInvalid={
                          Boolean(formik.errors.psnotchn) &&
                          Boolean(formik.touched.psnotchn)
                        }
                      >
                        <CustomFormLabel labelText="Notification Type" />
                        <Select
                          //placeholder="Please Select Notification Type"
                          value={formik.values.psnotchn}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psnotchn && (
                          <FormErrorMessage>
                            {formik.errors.psnotchn}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psnotcat"
                        isInvalid={
                          Boolean(formik.errors.psnotcat) &&
                          Boolean(formik.touched.psnotcat)
                        }
                      >
                        <CustomFormLabel labelText="Notification Category" />
                        <Select
                          placeholder="Please Select Notification Category"
                          value={formik.values.psnotcat}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isDisabled={formik.values.isTemplate ? true : false}
                        >
                          {ddlData?.NOTCATG?.filter(
                            (item: DDL_TYPES) => item.prgecode !== "INS"
                          ).map((option: DDL_TYPES) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psnotcat && (
                          <FormErrorMessage>
                            {formik.errors.psnotcat}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      {formik.values.psnotchn === "PSH" && (
                        <FormControl
                          id="psmsptyp"
                          isInvalid={
                            Boolean(formik.errors.psmsptyp) &&
                            Boolean(formik.touched.psmsptyp)
                          }
                        >
                          <CustomFormLabel labelText="Push Notification Type" />
                          <Select
                            placeholder="Please Select Push Notification Type"
                            value={formik.values.psmsptyp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={formik.values.isTemplate ? true : false}
                          >
                            {ddlData?.MBRNTP?.filter((x: DDL_TYPES) => {
                              return formik.values.isTemplate
                                ? x.prgecode !== ""
                                : x.prgecode === "ACTVTY";
                            }).map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psmsptyp && (
                            <FormErrorMessage>
                              {formik.errors.psmsptyp}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      )}
                    </Flex>
                  ) : (
                    <Flex
                      direction="row"
                      w={"100%"}
                      justifyContent={"space-between"}
                    >
                      <Flex direction="column" gap={6} w={"49%"}>
                        <FormControl
                          id="manualRecipient"
                          isInvalid={
                            Boolean(formik.errors.manualRecipient) &&
                            Boolean(formik.touched.manualRecipient)
                          }
                        >
                          {formik.values.psnotchn !== "WAP" ? (
                            <>
                              <FormLabel>Recipient Email Address</FormLabel>
                              <AntdSelect
                                mode="tags"
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                tokenSeparators={[";"]}
                                onSelect={(value: antdSelectProp, option) => {
                                  let selectedValue = value;
                                  let currentVal =
                                    formik.values.manualRecipient;
                                  let targetValue = selectedValue?.value;

                                  let currentArrVal =
                                    formik.values.manualRecipientArr;

                                  formik.setFieldValue(
                                    "manualRecipient",
                                    currentVal + targetValue + ";"
                                  );
                                  formik.setFieldValue("manualRecipientArr", [
                                    ...currentArrVal,
                                    value,
                                  ]);
                                }}
                                onDeselect={(value: antdSelectProp) => {
                                  let deSelectedValue = value;
                                  let currentVal =
                                    formik.values.manualRecipient;
                                  let targetValue = deSelectedValue.value;

                                  let currentArrVal =
                                    formik.values.manualRecipientArr;

                                  let targetArrValue = deSelectedValue?.value;

                                  formik.setFieldValue(
                                    "manualRecipient",
                                    currentVal.replaceAll(targetValue + ";", "")
                                  );
                                  formik.setFieldValue(
                                    "manualRecipientArr",
                                    currentArrVal.filter(
                                      (item: antdSelectProp) =>
                                        item.value !== targetArrValue
                                    )
                                  );
                                }}
                                labelInValue
                                optionFilterProp="label"
                                maxTagCount={4}
                                value={formik.values.manualRecipientArr}
                                options={customerSource.map((option) => ({
                                  key: option.psmbruid,
                                  value: option.psmbreml,
                                  label: `${option.psmbreml}`,
                                }))}
                              />
                            </>
                          ) : (
                            <>
                              <FormLabel>Recipient Phone Number</FormLabel>
                              <AntdSelect
                                mode="tags"
                                style={{ width: "100%" }}
                                placeholder="Please select"
                                tokenSeparators={[";"]}
                                onSelect={(value: antdSelectProp, option) => {
                                  let selectedValue = value;
                                  let currentVal =
                                    formik.values.manualRecipient;
                                  let targetValue = selectedValue?.value;

                                  let currentArrVal =
                                    formik.values.manualRecipientArr;

                                  formik.setFieldValue(
                                    "manualRecipient",
                                    currentVal + targetValue + ";"
                                  );
                                  formik.setFieldValue("manualRecipientArr", [
                                    ...currentArrVal,
                                    value,
                                  ]);
                                }}
                                onDeselect={(value: antdSelectProp) => {
                                  let deSelectedValue = value;
                                  let currentVal =
                                    formik.values.manualRecipient;
                                  let targetValue = deSelectedValue.value;

                                  let currentArrVal =
                                    formik.values.manualRecipientArr;

                                  let targetArrValue = deSelectedValue?.value;

                                  formik.setFieldValue(
                                    "manualRecipient",
                                    currentVal.replaceAll(targetValue + ";", "")
                                  );
                                  formik.setFieldValue(
                                    "manualRecipientArr",
                                    currentArrVal.filter(
                                      (item: antdSelectProp) =>
                                        item.value !== targetArrValue
                                    )
                                  );
                                }}
                                labelInValue
                                optionFilterProp="label"
                                maxTagCount={4}
                                value={formik.values.manualRecipientArr}
                                options={customerSource.map((option) => ({
                                  key: option.psmbruid,
                                  value: option.psmbrphn,
                                  label: `${option.psmbrnme}(${option.psmbrphn})`,
                                }))}
                              />
                            </>
                          )}

                          {formik.errors.manualRecipient && (
                            <FormErrorMessage>
                              {formik.errors.manualRecipient}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="recipientsUpload"
                          isInvalid={
                            Boolean(formik.errors.recipientsUpload) &&
                            Boolean(formik.touched.recipientsUpload)
                          }
                        >
                          <FormLabel>Upload Recipient List{""}</FormLabel>
                          <Text
                            pl={0}
                            fontWeight={"normal"}
                            fontStyle={"italic"}
                            fontSize={"xs"}
                          >
                            Note: Only .csv file is allowed. Here is a{" "}
                            <Link
                              color="blue.400"
                              fontWeight={"bold"}
                              onClick={() =>
                                handleDownload(
                                  formik.values.psnotchn == "WAP"
                                    ? "11c1b751-c366-48cd-b537-7a3df28bb0e2.csv"
                                    : "013cfa45-c218-480c-ab76-d7e609a56883.csv"
                                )
                              }
                            >
                              sample csv file.
                            </Link>
                          </Text>
                          <div>
                            <Dragger
                              name="file"
                              //listType="picture"
                              style={{ marginBottom: 10 }}
                              disabled={
                                selectedRecipientFile &&
                                selectedRecipientFile.length > 0
                                  ? true
                                  : false
                              }
                              fileList={
                                selectedRecipientFile
                                  ? selectedRecipientFile
                                  : undefined
                              }
                              onChange={(e: any) => handleFileUpload(e)}
                              customRequest={dummyReq}
                              itemRender={(
                                originNode,
                                file,
                                fileList,
                                action
                              ) => {
                                const isImage =
                                  /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);

                                return (
                                  <Space
                                    direction="horizontal"
                                    style={{
                                      backgroundColor: "white",
                                      width: "100%",
                                      paddingTop: 10,
                                      paddingLeft: 10,
                                      paddingRight: 10,
                                      paddingBottom: 5,
                                      borderRadius: 10,
                                      borderWidth: 1,
                                      borderColor: "lightgray",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Space size={"middle"}>
                                      {file.thumbUrl && isImage ? (
                                        <Image width={60} src={file.thumbUrl} />
                                      ) : (
                                        <FileOutlined
                                          style={{
                                            marginBottom: "7px",
                                            width: "60px",
                                            color: "gray",
                                          }}
                                        />
                                      )}
                                      <Typography
                                        style={{
                                          alignSelf: "flex-start",
                                          alignContent: "flex-start",
                                          alignItems: "flex-start",
                                        }}
                                      >
                                        {file.name}
                                      </Typography>
                                    </Space>
                                    <Space
                                      style={{ alignSelf: "flex-end" }}
                                      size={"small"}
                                    >
                                      {/* {fileList.filter(
                              (item: any) =>
                                item.uid === file.uid &&
                                item.fileStatus === "old"
                            ).length > 0 && (
                              <Tooltip title="Download">
                                <DownloadOutlined
                                  style={{
                                    color: "gray",
                                    fontSize: 14,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    marginBottom: "6px",
                                  }}
                                  onClick={() => handleDownload(file?.uid)}
                                />
                              </Tooltip>
                            )} */}
                                      <Tooltip title="Preview">
                                        <ExportOutlined
                                          style={{
                                            color: "gray",
                                            fontSize: 14,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            marginBottom: "6px",
                                          }}
                                          onClick={() =>
                                            window.open(file?.url, "_blank")
                                          }
                                        />
                                      </Tooltip>
                                      <Tooltip title="Remove">
                                        <DeleteOutlined
                                          style={{
                                            color: "gray",
                                            fontSize: 14,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            marginBottom: "6px",
                                          }}
                                          onClick={() => {
                                            handleRemove(file);
                                          }}
                                        />
                                      </Tooltip>
                                    </Space>
                                  </Space>
                                );
                              }}
                            >
                              <Flex flexDir={"column"} pb={6}>
                                <Text fontSize={"md"} fontWeight={"bold"}>
                                  Drop File here
                                </Text>
                                <Text>or click to upload</Text>
                              </Flex>
                            </Dragger>
                          </div>

                          {formik.errors.recipientsUpload && (
                            <FormErrorMessage>
                              {formik.errors.recipientsUpload}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </Flex>
                      <Flex direction="column" gap={6} w={"49%"}>
                        <FormControl
                          id="psnotchn"
                          isInvalid={
                            Boolean(formik.errors.psnotchn) &&
                            Boolean(formik.touched.psnotchn)
                          }
                        >
                          <CustomFormLabel labelText="Notification Type" />
                          <Select
                            //placeholder="Please Select Notification Type"
                            value={formik.values.psnotchn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psnotchn && (
                            <FormErrorMessage>
                              {formik.errors.psnotchn}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="psnotcat"
                          isInvalid={
                            Boolean(formik.errors.psnotcat) &&
                            Boolean(formik.touched.psnotcat)
                          }
                        >
                          <CustomFormLabel labelText="Notification Category" />
                          <Select
                            placeholder="Please Select Notification Category"
                            value={formik.values.psnotcat}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={formik.values.isTemplate ? true : false}
                          >
                            {ddlData?.NOTCATG?.filter(
                              (item: DDL_TYPES) => item.prgecode !== "INS"
                            ).map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psnotcat && (
                            <FormErrorMessage>
                              {formik.errors.psnotcat}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                        {formik.values.psnotchn === "PSH" && (
                          <FormControl
                            id="psmsptyp"
                            isInvalid={
                              Boolean(formik.errors.psmsptyp) &&
                              Boolean(formik.touched.psmsptyp)
                            }
                          >
                            <CustomFormLabel labelText="Push Notification Type" />
                            <Select
                              placeholder="Please Select Push Notification Type"
                              value={formik.values.psmsptyp}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isDisabled={
                                formik.values.isTemplate ? true : false
                              }
                            >
                              {ddlData?.MBRNTP?.filter((x: DDL_TYPES) => {
                                return formik.values.isTemplate
                                  ? x.prgecode !== ""
                                  : x.prgecode === "ACTVTY";
                              }).map((option: DDL_TYPES) => (
                                <option
                                  key={option.prgecode}
                                  value={option.prgecode}
                                >
                                  {option.prgedesc}
                                </option>
                              ))}
                            </Select>
                            {formik.errors.psmsptyp && (
                              <FormErrorMessage>
                                {formik.errors.psmsptyp}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        )}
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </div>
          </Box>
        </Card>
      </Flex>

      {/* Email(EML) */}
      {formik.values.psnotchn === "EML" && (
        <EmailNotification
          mode={"ADD"}
          id={""}
          id2={""}
          detailData={{}}
          formik={formik}
          screenType="NEWNOT"
          onChangeFiles={(files, selectedFile) =>
            handleEmailFile(files, selectedFile)
          }
          onChangeEditor={(content) => setEmailContent(content)}
        />
      )}
      {/* Email Editor(EMLE) */}
      {formik.values.psnotchn === "EMLE" && (
        <EmailHTMLNotification
          mode={"ADD"}
          id={""}
          detailData={{}}
          formik={formik}
          screenType="NEWNOT"
          onChangeFiles={(files, selectedFile) =>
            handleEmailHTMLFile(files, selectedFile)
          }
        />
      )}
      {/* Push Notification(PSH) */}
      {formik.values.psnotchn === "PSH" && (
        <PushNotification
          mode={"ADD"}
          id={""}
          detailData={{}}
          formik={formik}
          notLang={"1"}
          screenType="NEWNOT"
          onChangeImages={(image, selectedImage) =>
            handlePushFile(image, selectedImage)
          }
        />
      )}
      {/* Whatsapp Notification (WAP) */}
      {formik.values.psnotchn === "WAP" && (
        <WhatsappNotification
          mode={"ADD"}
          id={""}
          detailData={{}}
          formik={formik}
          screenType="NEWNOT"
          notLang={"1"}
          // onChangeImages={(image, selectedImage) =>
          //   handlePushFile(image, selectedImage)
          // }
        />
      )}
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
          <Box>
            {/* <Text pb={3} fontSize={"19pt"} fontWeight={"500"}>
              3. Send Time
            </Text> */}
            <SubHeader labelText="3. Send Time"/>

            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="50%">
                <RadioGroup
                  name="sendType"
                  value={formik.values.sendType}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "sendType" },
                    })
                  }
                >
                  <Stack gap={3} direction="row">
                    <Radio value="SENDNOW">Send Immediately</Radio>
                    <Radio value="SCHEDULED">Send at a Designated Time</Radio>
                  </Stack>
                </RadioGroup>
                {formik.values.sendType === "SCHEDULED" && (
                  <>
                    <Flex flexDir="row" gap={6} w={"100%"}>
                      <FormControl
                        id="sendDate"
                        isInvalid={
                          Boolean(formik.errors.sendDate) &&
                          Boolean(formik.touched.sendDate)
                        }
                      >
                        <FormLabel>Schedule Send Date</FormLabel>
                        <DatePicker
                          id="sendDate"
                          name="sendDate"
                          style={{ width: "100%" }}
                          format={"DD/MM/YYYY"}
                          disabledDate={(currentDate) =>
                            currentDate < dayjs().startOf("day")
                          }
                          value={
                            formik.values.sendDate
                              ? dayjs(formik.values.sendDate)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "sendDate" },
                            })
                          }
                        />
                        {formik.errors.sendDate && (
                          <FormErrorMessage>
                            {formik.errors.sendDate}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="sendTime"
                        isInvalid={
                          Boolean(formik.errors.sendTime) &&
                          Boolean(formik.touched.sendTime)
                        }
                      >
                        <FormLabel>Send Time (HH:MM)</FormLabel>
                        <TimePicker
                          id="sendTime"
                          name="sendTime"
                          style={{ width: "100%" }}
                          format={"HH:mm"}
                          minuteStep={30}
                          showNow={false}
                          value={
                            formik.values.sendTime
                              ? dayjs(formik.values.sendTime)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "sendTime" },
                            })
                          }
                          changeOnBlur
                        />
                        {formik.errors.sendTime && (
                          <FormErrorMessage>
                            {formik.errors.sendTime}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex flexDir="row" gap={6} w={"100%"}>
                      <FormControl
                        id="freq_value"
                        isInvalid={
                          Boolean(formik.errors.freq_value) &&
                          Boolean(formik.touched.freq_value)
                        }
                      >
                        <FormLabel>Schedule Frequency</FormLabel>
                        <NumberInput
                          name="freq_value"
                          min={0}
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "freq_value" },
                            })
                          }
                          onBlur={formik.handleBlur}
                          value={formik.values.freq_value}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        {formik.errors.freq_value && (
                          <FormErrorMessage>
                            {formik.errors.freq_value}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="freq_code"
                        isInvalid={
                          Boolean(formik.errors.freq_code) &&
                          Boolean(formik.touched.freq_code)
                        }
                      >
                        <FormLabel>Schedule Frequency Code</FormLabel>
                        <Select
                          placeholder="Please Select Schedule Frequency Code"
                          value={formik.values.freq_code}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {ddlData?.FREQ?.map((option: DDL_TYPES) => (
                            <option
                              key={option.prgecode}
                              value={option.prgecode}
                            >
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.freq_code && (
                          <FormErrorMessage>
                            {formik.errors.freq_code}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex flexDir="row" gap={6} w={"48%"}>
                      <FormControl
                        id="expiry_date"
                        isInvalid={
                          Boolean(formik.errors.expiry_date) &&
                          Boolean(formik.touched.expiry_date)
                        }
                      >
                        <FormLabel>Expiry Date</FormLabel>
                        <DatePicker
                          id="expiry_date"
                          name="expiry_date"
                          style={{ width: "100%" }}
                          format={"DD/MM/YYYY"}
                          disabledDate={(currentDate) =>
                            currentDate < dayjs().startOf("day")
                          }
                          value={
                            formik.values.expiry_date
                              ? dayjs(formik.values.expiry_date)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "expiry_date" },
                            })
                          }
                        />
                        {formik.errors.expiry_date && (
                          <FormErrorMessage>
                            {formik.errors.expiry_date}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                  </>
                )}
              </Box>
            </div>
          </Box>
        </Card>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            {formik.values.psnotchn !== "PSH" &&
              formik.values.psnotchn !== "WAP" && (
                <Buttons
                  variant={"outline"}
                  borderColor={Colors.PRIMARY}
                  color={Colors.PRIMARY}
                  buttonText="Send to Test Device"
                  style={{ alignSelf: "center" }}
                  buttonDefaultType="CUSTOM"
                  buttonHoverBackgroundColor={Colors.PRIMARY}
                  buttonHoverColor={Colors.BACKGROUND}
                  onClick={() => validateEmptyMessage()}
                />
              )}
            <Buttons
              variant={"primary"}
              buttonText={formik.values.sendType == "SENDNOW" ? "Send" : "Save"}
              buttonLeftIcon={<BsSend />}
              buttonSize={"sm"}
              buttonDefaultType="CUSTOM"
              buttonType="submit"
              buttonFontWeight={"normal"}
              buttonBorderRadius={3}
              buttonHoverBackgroundColor={Colors.SUCCESS3}
              buttonBgColor={Colors.SUCCESS}
              buttonLoading={loading}
              //onClick={() => onOpen()}
            />
          </Space>
        </Box>
      </Flex>
      {/* Modal Dialog */}
      <ModalDialogPopUp
        isOpen={isOpen}
        onClose={handleClose}
        size="6xl"
        children={
          formik.values.previewSegment ? (
            <PreviewSegmentTable formik={formik} />
          ) : (
            <TestReceiverTable
              notChannel={formik.values.psnotchn}
              notStatus={"Y"}
              notTempCode={""}
              notLang={"1"}
              screenType={"NEWNOT"}
              msgTitle={formik.values.psmsgttl}
              msgBody={formik.values.psmsgbdy}
              attachment={
                formik.values.psnotchn === "EML"
                  ? emailFile
                  : formik.values.psnotchn === "EMLE"
                  ? emailHTMLFile
                  : formik.values.psnotchn === "PSH"
                  ? [pushFile]
                  : []
              }
              selectedAttachment={
                formik.values.psnotchn === "EML"
                  ? selectedEmailFile
                  : formik.values.psnotchn === "EMLE"
                  ? selectedEmailHTMLFile
                  : formik.values.psnotchn === "PSH"
                  ? [pushFile]
                  : []
              }
              //notComChannel={formik.values.pschncde}
              notCategory={formik.values.psnotcat}
            />
          )
        }
      />
    </form>
  );
}

interface ReturnedFileUploadStatus {
  ext: string;
  orgfnm: string;
  sysfnm: string;
}

interface ExtraData {
  _id: string;
  group: string;
  key: string;
}

interface antdSelectProp {
  key: string;
  value: string;
  label: string;
}
