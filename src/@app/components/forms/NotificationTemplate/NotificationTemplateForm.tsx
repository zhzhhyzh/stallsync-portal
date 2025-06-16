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
  Tabs,
  TabList,
  Tab,
  Link,
  Switch,
  useDisclosure,
  Highlight,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, UploadFile } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  postBulkUploadFile,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";

import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchNotificationTemplateDetail from "@app/hooks/selector/useFetchNotificationTemplateDetail";
import dayjs from "dayjs";
import {
  checkTemplate,
  fetchNotificationTemplateDetail,
  manageNotificationTemplate,
} from "@app/redux/notificationtemplate/slice";

import PushNotification from "./PushNotification";
import EmailNotification from "./EmailNotification";
import WhatsappNotification from "./WhatsappNotification";
import EmailHTMLNotification from "./EmailHTMLNotification";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import TestReceiverTable from "./TestReceiverTable";
import { NotificationTemplateShema } from "../@schemas/notificationSchema";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import SubHeader from "@app/components/common/Header/SubHeader";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";

export default function NotificationTemplateForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Notification Template" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const id2 = props.id2;
  const mode = props.mode;

  const [detailData, onInit, NotDetailloading, reset] =
    useFetchNotificationTemplateDetail(id, id2, "1");
  const [ddlData] = useFetchDDL({
    code: ["NOTCHNL", "NOTCATG", "YESORNO", "NOTLANG", "MBRNTP"],
  });

  const [msgLanguage, setMsgLanguage] = useState("1");
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const initialValues = {
    //General Info
    psnotcde: "",
    psnotdsc: "",
    psnotchn: mode === "ADD" ? "EML" : "",
    status: false,
    psnotcat: "",
    psnotisd: "",
    psnotlst: "",
    psmsptyp: "",
    psmspstp: "",
    pskeybdy: [],

    metagroup: "",
    metafield: "",

    //Messages
    isContentChanged: false,
    psmsgttl: "",
    psmsgbdy: "",
    currentMsgbdy: "",
    psmsgobj: {},
    psmsgurl: "",
    attachments: "",
    forceLoad: false,
    psapvsts: "",
    psapvdat: "",
    psmsgtid: "",
    pswapmsg: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: NotificationTemplateShema,
    onSubmit: (values) => {
      const {
        psnotcde,
        psnotdsc,
        psnotchn,
        status,
        psnotlst,
        psnotcat,
        psnotisd,
        psmsgttl,
        psmsgbdy,
        psmsgobj,
        psmsgurl,
        psmsptyp,
        pskeybdy,
        psmspstp,
      } = values;

      let msgBody = "";
      let msgTtl = "";
      let msgObj = "";
      if (psnotchn === "PSH") {
        msgTtl = psmsgttl;
        msgBody = psmsgbdy;
      } else if (psnotchn === "EML") {
        msgBody = emailContent;
      } else if (psnotchn === "WAP") {
        msgBody = psmsgbdy;
      } else if (psnotchn === "EMLE") {
        msgBody = psmsgbdy;
        msgObj = JSON.stringify(psmsgobj);
      }

      //Retrieve current metadata from message title
      let newMetadataObj: CustomMetaJson[] = [];
      if (msgTtl !== "") {
        const pattern = /\{\{([^}]+)\}\}/g;
        const allMatches = msgTtl.match(pattern);
        let tempArray: CustomMetaJson[] = [];
        if (allMatches) {
          for (let i = 0; i < allMatches.length; i++) {
            const matched = allMatches[i];
            const matchMetadata = matched.match(/\{\{([^}]+)\}\}/)![1];
            tempArray.push({
              field: matchMetadata,
            });
          }
          newMetadataObj = distinctMetadata(tempArray);
        }
      }

      //Retrieve current metadata from message body
      if (msgBody !== "") {
        const pattern = /\{\{([^}]+)\}\}/g;
        const allMatches = msgBody.match(pattern);
        let tempArray: CustomMetaJson[] = [];
        if (allMatches) {
          for (let i = 0; i < allMatches.length; i++) {
            const matched = allMatches[i];
            const matchMetadata = matched.match(/\{\{([^}]+)\}\}/)![1];
            tempArray.push({
              field: matchMetadata,
            });
          }
          if (newMetadataObj.length > 0) {
            newMetadataObj = distinctMetadata([
              ...newMetadataObj,
              ...tempArray,
            ]);
          } else {
            newMetadataObj = distinctMetadata(tempArray);
          }
        }
      }

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
      if (psmsptyp === "ACTION") {
        isPassed = validationOnExtraData(pskeybdy);
      } else {
        isPassed = true;
      }

      let postValue = {
        psnotcde,
        psnotdsc,
        psnotist: status === true ? "Y" : "N",
        psnotchn,
        psnotcat,
        psnotisd,
        psnotlst,
        psmsglng: msgLanguage,
        psmsgttl,
        psmsgbdy: msgBody,
        psmsgobj: msgObj,
        psmsgurl,
        psmsgmta: newMetadataObj,
        psmsptyp,
        psmspstp,
        pskeybdy: psmsptyp === "ACTION" ? keyBodyJson : {},
      };

      if (isPassed) {
        onSubmit(postValue);
      }
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();
      else {
        //Reset validation status
        formik.setErrors({});
        formik.setTouched({});

        //Recreate Extra Data Array
        let newKeybdyArr: any[] = [];
        if (detailData?.pskeybdy && detailData?.pskeybdy !== "") {
          let newObj =
            typeof detailData?.pskeybdy === "string"
              ? JSON.parse(detailData?.pskeybdy)
              : detailData?.pskeybdy;

          if (newObj && Object.keys(newObj).length > 0) {
            let newKeybdy = newObj.body;
            let newDataArr = [];
            for (var i = 0; i < newKeybdy.length; i++) {
              let objItem = newKeybdy[i];

              newDataArr.push({
                _id: objItem._id,
                key: objItem.key,
                group: objItem.group,
              });
            }
            newKeybdyArr = newDataArr;
          }
        }

        formik.setValues({
          ...detailData,
          psmsgttl:
            detailData?.message !== "" ? detailData?.message?.psmsgttl : "",
          psmsgbdy:
            detailData?.message !== "" ? detailData?.message?.psmsgbdy : "",
          psmsgobj:
            detailData?.message !== "" && detailData?.psnotchn === "EMLE"
              ? typeof detailData?.message?.psmsgobj === "string"
                ? JSON.parse(detailData?.message?.psmsgobj)
                : detailData?.message?.psmsgobj
              : {},
          currentMsgbdy:
            detailData?.message !== "" ? detailData?.message?.psmsgbdy : "",
          psmsgurl:
            detailData?.message !== "" ? detailData?.message?.psmsgurl : "",
          // psmsptyp:
          //   detailData?.message !== "" ? detailData?.message?.psmsptyp : "",
          //requestType: requestType,
          pskeybdy: newKeybdyArr.length > 0 ? newKeybdyArr : [],
          id: detailData?.psusrunm,
          status: detailData?.psnotist === "Y" ? true : false,
          psmsgtid:
            detailData?.message !== "" ? detailData?.message?.psmsgtid : "",
          pswapmsg:
            detailData?.message !== "" ? detailData?.message?.pswapmsg : "",
        });

        //Default the isContentChanged flag
        formik.setFieldValue("isContentChanged", false);

        //Force Load the Editor
        if (formik.values.psnotchn === "EMLE")
          formik.setFieldValue("forceLoad", true);
      }
    }
  }, [detailData]);

  useEffect(() => {
    //Retrigger fetch api
    if (mode !== "ADD") {
      triggerAPi("1");
    }
  }, [router.query]);

  useEffect(() => {
    if (mode === "ADD") {
      formik.setFieldValue("psmsgttl", "");
      formik.setFieldValue("psmsgbdy", "");
    }
  }, [formik.values.psnotchn]);

  async function onSubmit(data: any) {
    //Default Attachment
    data.attachments = [];

    //Multiple Upload
    let uploadedEmailFile: String[] = [];

    //Single Upload
    let uploadedFile = "";
    if (
      (formik.values.psnotchn === "WAP" || formik.values.psnotchn === "PSH") &&
      ((mode === "ADD" && pushFile) || (mode === "EDIT" && pushFile))
    ) {
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
          data.attachments.push(uploadedFile);
        } else {
          return;
        }
      } else {
        data.attachments = [];
      }
    } else if (
      formik.values.psnotchn === "EML" &&
      ((mode === "ADD" && emailFile) || (mode === "EDIT" && emailFile))
    ) {
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
          data.attachments = uploadedEmailFile;
        } else {
          return;
        }
      } else {
        selectedEmailFile.forEach((fileItem) =>
          uploadedEmailFile.push(fileItem.uid)
        );
        data.attachments = uploadedEmailFile;
      }
    } else if (
      formik.values.psnotchn === "EMLE" &&
      ((mode === "ADD" && emailHTMLFile) || (mode === "EDIT" && emailHTMLFile))
    ) {
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
          data.attachments = uploadedEmailFile;
        } else {
          return;
        }
      } else {
        selectedEmailHTMLFile.forEach((fileItem) =>
          uploadedEmailFile.push(fileItem.uid)
        );
        data.attachments = uploadedEmailFile;
      }
    }

    if (mode === "ADD") {
      const { success } = await sendRequest({
        fn: checkTemplate(data),
        formik,
      });

      if (success) {
        const { success } = await sendRequest({
          fn: manageNotificationTemplate(data),
          formik,
        });

        if (success) {
          formik.setFieldValue("isContentChanged", false);
          setTimeout(() => {
            showModal(dispatch, {
              title: "Add Record",
              message: "Record Added"
            });
            router.replace({
              pathname: router.pathname,
              query: {
                id: data.psnotcde,
                id2: data.psnotchn,
                mode: "EDIT",
              },
            });
            //router.back();
          }, 200);
        }
      }
    } else if (mode === "EDIT") {
      const { success } = await sendRequest({
        fn: manageNotificationTemplate(data),
        formik,
      });

      if (success) {
        formik.setFieldValue("isContentChanged", false);
        triggerAPi(msgLanguage);
        setTimeout(() => {
          showModal(dispatch, {
            title: "Update Record",
            message: "Record Updated"
          });
        }, 200);
      }
    }
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

      if (dataObj.key == "") {
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

  async function handleTabChange(index: string) {
    if (msgLanguage !== index) {
      if (!formik.values.isContentChanged) {
        setMsgLanguage(index);

        if (mode !== "ADD") {
          triggerAPi(index);
        } else {
          formik.setFieldValue("resetFlag", true);
        }
      } else {
        dispatch(
          openGlobalModal({
            title: "Content Changed Alert",
            message: MessageDetail(),
            status: "warning",
            actions: [
              {
                title: "Confirm",
                onClick: async () => {
                  formik.setFieldValue("isContentChanged", false);
                  setMsgLanguage(index);
                  dispatch(closeGlobalModal());

                  if (mode !== "ADD") {
                    triggerAPi(index);
                  } else {
                    formik.setFieldValue("resetFlag", true);
                  }
                },
              },
              {
                title: "Cancel",
                isClose: true,
              },
            ],
          })
        );
      }
    }
  }

  async function triggerAPi(index: string) {
    await sendRequest({
      fn: fetchNotificationTemplateDetail({
        psnotcde: id,
        psnotchn: id2,
        psmsglng: index,
      }),
    });
  }

  const handleStatusChange = () => {
    formik.setFieldValue("status", !formik.values.status);
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

  function distinctMetadata(metadata: CustomMetaJson[]) {
    const distinctArray = metadata.reduce(
      (distinctData: CustomMetaJson[], currentData) => {
        const isExist = distinctData.find(
          (item: CustomMetaJson) => item.field === currentData.field
        );

        if (!isExist) {
          distinctData.push(currentData);
        }

        return distinctData;
      },
      []
    );

    return distinctArray;
  }

  function alertSendTestReceiver() {
    dispatch(
      openGlobalModal({
        title: "Send to Test Device",
        message: TestReceiverMsg(),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => handleSendTestReceiver(),
          },
          {
            title: "Cancel",
            isClose: true,
            props: {
              variant: "danger",
            },
          },
        ],
      })
    );
  }

  function handleSendTestReceiver() {
    dispatch(closeGlobalModal());
    onOpen();
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {/* Header */}
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Notification Template Detail
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Notification Template",
                  href: `/notificationTemplate`, // Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Notification Template (" + mode + ")",
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
                buttonDefaultType={"BACK"}
                onclick={() => router.back()}
              />
              {mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
            </Space>
          </Box>
        </Flex>

        {/* General Info */}
        <Flex
          // flexDir={{
          //   base: "column",
          //   lg: 'row'
          // }}
          gap={Spacing.gap}
          mt={Spacing.gap}
        >
          <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
            {/* <Text fontSize={"19pt"} fontWeight="500">
              Template Detail
            </Text> */}
            <SubHeader labelText="Template Detail"/>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <FormControl
                  id="psnotcde"
                  isInvalid={
                    Boolean(formik.errors.psnotcde) &&
                    Boolean(formik.touched.psnotcde)
                  }
                  // isReadOnly={mode === "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Notification Code" />
                  <Input
                    placeholder={"Enter Notification Code"}
                    type="text"
                    name="psnotcde"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnotcde}
                    isDisabled={mode === "EDIT" ? true : false}
                  />
                  {formik.errors.psnotcde && (
                    <FormErrorMessage>
                      {formik.errors.psnotcde}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psnotdsc"
                  isInvalid={
                    Boolean(formik.errors.psnotdsc) &&
                    Boolean(formik.touched.psnotdsc)
                  }
                  //isReadOnly={mode === "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Notification Description" />
                  <Input
                    placeholder={"Enter Notification Description"}
                    type="text"
                    name="psnotdsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnotdsc}
                    //isDisabled={mode === "EDIT" ? true : false}
                  />
                  {formik.errors.psnotdsc && (
                    <FormErrorMessage>
                      {formik.errors.psnotdsc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {mode !== "ADD" && (
                  <>
                    <FormControl
                      id="psnotchn"
                      isInvalid={
                        Boolean(formik.errors.psnotchn) &&
                        Boolean(formik.touched.psnotchn)
                      }
                    >
                      <FormLabel>Notification Type</FormLabel>
                      <Select
                        //placeholder="Please Select Notification Type"
                        value={formik.values.psnotchn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={mode === "EDIT" ? true : false}
                      >
                        {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                          <option key={option.prgecode} value={option.prgecode}>
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
                          //isDisabled={mode === "EDIT" ? true : false}
                        >
                          {ddlData?.MBRNTP?.map((option: DDL_TYPES) => (
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
                  </>
                )}
              </Box>
              <Box display="flex" flexDir="column" gap={6} width="100%">
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
                    isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.NOTCATG?.filter(
                      (item: DDL_TYPES) => item.prgecode !== "INS"
                    ).map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
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
                {mode !== "ADD" ? (
                  <>
                    <Flex flexDir={"row"} justifyContent={"space-between"}>
                      <FormControl
                        id="status"
                        w={"49%"}
                        isInvalid={
                          Boolean(formik.errors.status) &&
                          Boolean(formik.touched.status)
                        }
                      >
                        <FormLabel>Status</FormLabel>
                        <Switch
                          id="status"
                          name="status"
                          isChecked={formik.values.status}
                          onChange={handleStatusChange}
                          onBlur={formik.handleBlur}
                          size="md"
                          colorScheme={"green"}
                          sx={{
                            "span.chakra-switch__track:not([data-checked])": {
                              backgroundColor: Colors.DANGER,
                            },
                          }}
                        />
                        {formik.errors.status && (
                          <FormErrorMessage>
                            {formik.errors.status}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psnotisd"
                        w={"49%"}
                        isInvalid={
                          Boolean(formik.errors.psnotisd) &&
                          Boolean(formik.touched.psnotisd)
                        }
                      >
                        <FormLabel>Status Date</FormLabel>
                        <DatePicker
                          format={"DD/MM/YYYY"}
                          style={{ width: "100%" }}
                          value={
                            formik.values.psnotisd
                              ? dayjs(formik.values.psnotisd)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "psnotisd" },
                            })
                          }
                          onBlur={formik.handleBlur}
                          disabled={true}
                        />
                        {formik.errors.psnotisd && (
                          <FormErrorMessage>
                            {formik.errors.psnotisd}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>

                    {/* {formik.values.psnotchn === "WAP" && (
                      <Box display="flex" flexDir="row" gap={6} width="100%">
                        <FormControl
                          id="psapvsts"
                          isInvalid={
                            Boolean(formik.errors.psapvsts) &&
                            Boolean(formik.touched.psapvsts)
                          }
                        >
                          <FormLabel>Approval Status</FormLabel>
                          <Select
                            disabled
                            placeholder="Please Select Approval Status"
                            value={formik.values.psapvsts}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psapvsts && (
                            <FormErrorMessage>
                              {formik.errors.psapvsts}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="psapvdat"
                          isInvalid={
                            Boolean(formik.errors.psapvdat) &&
                            Boolean(formik.touched.psapvdat)
                          }
                        >
                          <FormLabel>Approval Date</FormLabel>
                          <DatePicker
                            id="psapvdat"
                            name="psapvdat"
                            style={{ width: "100%" }}
                            format={"DD/MM/YYYY"}
                            value={
                              formik.values.psapvdat
                                ? dayjs(formik.values.psapvdat)
                                : null
                            }
                            onChange={(value) =>
                              formik.handleChange({
                                target: { value, name: "psapvdat" },
                              })
                            }
                            disabled={true}
                          />
                          {formik.errors.psapvdat && (
                            <FormErrorMessage>
                              {formik.errors.psapvdat}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </Box>
                    )} */}
                    {/* <Flex flexDir={"row"}>
                      <FormControl
                        id="psnotlst"
                        isInvalid={
                          Boolean(formik.errors.psnotlst) &&
                          Boolean(formik.touched.psnotlst)
                        }
                        style={{ width: "285px" }}
                      >
                        <FormLabel>Last Sent Date</FormLabel>
                        <DatePicker
                          format={"DD/MM/YYYY"}
                          style={{ width: "283px" }}
                          value={
                            formik.values.psnotlst
                              ? dayjs(formik.values.psnotlst)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "psnotlst" },
                            })
                          }
                          onBlur={formik.handleBlur}
                          disabled={true}
                        />
                        {formik.errors.psnotlst && (
                          <FormErrorMessage>
                            {formik.errors.psnotlst}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <Link
                        color={"Highlight"}
                        ml={3}
                        mt={8}
                        alignSelf={"center"}
                        fontSize={"8pt"}
                      >
                        Sent History
                      </Link>
                    </Flex> */}
                  </>
                ) : (
                  <>
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
                        isDisabled={mode === "EDIT" ? true : false}
                      >
                        {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                          <option key={option.prgecode} value={option.prgecode}>
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
                          //isDisabled={mode === "EDIT" ? true : false}
                        >
                          {ddlData?.MBRNTP?.map((option: DDL_TYPES) => (
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
                  </>
                )}
              </Box>
            </div>
          </Card>
        </Flex>

        {/* Tabs */}
        <Flex mt={4} bgColor="#fff" py={2}>
          {/* <Tabs onChange={(index) => handleTabChange(String(index + 1))}> */}
          <Tabs
            index={
              Number(msgLanguage) > 0
                ? Number(msgLanguage) - 1
                : Number(msgLanguage)
            }
          >
            <TabList
              border={0}
              //overflowX={'auto'}
              //overflowY="hidden"
              //w="100vw"
            >
              {/* {mode === "ADD" ? (
                <>
                  {ddlData?.NOTLANG && ddlData?.NOTLANG.length > 0 && (
                    <Tab
                      key={`notlang-tab-${ddlData?.NOTLANG[0].prgecode}`}
                      ml={{
                        base: 0,
                        md: "5px",
                      }}
                      py={3}
                      onClick={() => handleTabChange(ddlData?.NOTLANG[0].prgecode)}
                      whiteSpace={"nowrap"}
                    >
                      {ddlData?.NOTLANG[0].prgedesc}
                    </Tab>
                  )}
                </>
              ) : (
                ddlData?.NOTLANG?.map((option: DDL_TYPES, index: number) => (
                  <Tab
                    key={`notlang-tab-${option.prgecode}`}
                    ml={
                      index > 0
                        ? {}
                        : {
                            base: 0,
                            md: "5px",
                          }
                    }
                    py={3}
                    onClick={() => handleTabChange(option.prgecode)}
                    whiteSpace={"nowrap"}
                  >
                    {option.prgedesc}
                  </Tab>
                ))
              )} */}

              {ddlData?.NOTLANG?.map((option: DDL_TYPES, index: number) => (
                // <Tab
                //   key={`notlang-tab-${option.prgecode}`}
                //   ml={
                //     index > 0
                //       ? {}
                //       : {
                //           base: 0,
                //           md: "5px",
                //         }
                //   }
                //   py={3}
                //   onClick={() => handleTabChange(option.prgecode)}
                //   whiteSpace={"nowrap"}
                // >
                //   {option.prgedesc}
                // </Tab>
                <CustomTabs label={option.prgedesc} index={index} selectedTabIndex={Number(msgLanguage) - 1}  onClick={() => handleTabChange(option.prgecode)}/>
              ))}
            </TabList>
          </Tabs>
        </Flex>

        {/* Email(EML) */}
        {formik.values.psnotchn === "EML" && (
          <EmailNotification
            mode={mode}
            id={id}
            id2={id2}
            detailData={detailData}
            formik={formik}
            screenType="TEMPLATE"
            onChangeFiles={(files, selectedFile) =>
              handleEmailFile(files, selectedFile)
            }
            onChangeEditor={(content) => setEmailContent(content)}
          />
        )}
        {/* Email Editor(EMLE) */}
        {formik.values.psnotchn === "EMLE" && (
          <EmailHTMLNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
            screenType="TEMPLATE"
            notLang={msgLanguage}
            onChangeFiles={(files, selectedFile) =>
              handleEmailHTMLFile(files, selectedFile)
            }
          />
        )}
        {/* Push Notification(PSH) */}
        {formik.values.psnotchn === "PSH" && (
          <PushNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
            screenType="TEMPLATE"
            notLang={msgLanguage}
            onChangeImages={(image, selectedImage) =>
              handlePushFile(image, selectedImage)
            }
          />
        )}

        {/* Whatsapp Notification (WAP) */}
        {formik.values.psnotchn === "WAP" && (
          <WhatsappNotification
            mode={mode}
            id={id}
            detailData={detailData}
            formik={formik}
            screenType="TEMPLATE"
            notLang={msgLanguage}
            onChangeImages={(image, selectedImage) =>
              handlePushFile(image, selectedImage)
            }
          />
        )}
        {/* Footer */}
        <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
          <Box>
            <Space size="small">
              {mode &&
                mode !== "ADD" &&
                formik.values.psnotchn !== "PSH" &&
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
                    onClick={() => alertSendTestReceiver()}
                  />
                )}
              <Buttons
                buttonDefaultType={"BACK"}
                onclick={() => router.back()}
              />
              {mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
            </Space>
          </Box>
        </Flex>
      </form>
      {/* Modal Dialog */}
      <ModalDialogPopUp
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        children={
          <TestReceiverTable
            notChannel={formik.values.psnotchn}
            notStatus={"Y"}
            notTempCode={formik.values.psnotcde}
            screenType={"TEMPLATE"}
            notLang={msgLanguage}
          />
        }
      />
    </>
  );
}

const TestReceiverMsg = () => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      <Text p={3}>
        Please ensure you had saved the latest content before proceed.
      </Text>
    </Box>
  );
};

interface UploadedFile {
  uid: string;
  name: string;
  status: string;
  url?: string;
  thumbUrl?: string;
}

//For Multiple Upload
interface ReturnedFileUploadStatus {
  ext: string;
  orgfnm: string;
  sysfnm: string;
}

interface CustomMetaJson {
  field: string;
  value?: string;
}

interface ExtraData {
  _id: string;
  group: string;
  key: string;
}

// interface ExtraDataBodyJson {
//   id: string;
//   group: string;
//   field: string;
// }
const MessageDetail = () => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Message Content Changed!</Text>
      <Text fontSize={"sm"}>
        {" "}
        <Highlight query="SAVE" styles={{ py: "1", fontWeight: "bold" }}>
          Please SAVE before switching tabs to avoid losing changes.
        </Highlight>{" "}
      </Text>
      <Text fontSize={"sm"}>
        <Highlight
          query={["Confirm", "Cancel"]}
          styles={{ fontWeight: "bold" }}
        >
          Press Confirm to switch to next tab or Cancel to stay on this tab.
        </Highlight>{" "}
      </Text>
    </Box>
  );
};
