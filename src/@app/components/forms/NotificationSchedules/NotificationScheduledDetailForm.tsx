// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Switch,
  useDisclosure,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import {
  DatePicker,
  Space,
  TimePicker,
  Upload,
  UploadFile,
  Image,
  Typography,
  Tooltip,
} from "antd";
import {
  DownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined,
} from "@ant-design/icons";
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
import useFetchScheduledNotificationDetail from "@app/hooks/selector/useFetchScheduledNotificationDetail";
import dynamic from "next/dynamic";
import Colors from "@app/constants/Colors";
import { amendSchedule } from "@app/redux/notificationsheduledetail/slice";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import PreviewScheduleRecipients from "./PreviewScheduleRecipients";
//import useFetchDDLSegment from "@app/hooks/selector/useFetchDDLSegment";
import { UploadedFile } from "@app/interfaces/uploaded.types";
import { download } from "@app/redux/app/slice";
import { genDocumentUrl } from "@app/helpers/commonHelper";

export default function NotificationScheduledDetailForm(props: any) {
  const { sendRequest, loading } = useApi({
    title: "Scheduled Notification Detail",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchScheduledNotificationDetail(id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ddlData] = useFetchDDL({ code: ["NOTCHNL", "NOTCATG", "FREQ"] });
  //const [ddlSegment] = useFetchDDLSegment();
  const { Dragger } = Upload;

  //const [emailFile, setEmailFile] = useState<any[]>([]); //For multiple upload
  const [selectedEmailFile, setSelectedEmailFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const initialValues = {
    sendDate: "",
    sendTime: "",
    freq_code: "",
    freq_value: "",
    expiry_date: "",

    psmsgttl: "",
    psmsgbdy: "",
    psmsgurl: "",
    psmsgtid: "",
    pswapmsg: "",

    psnotcde: "",
    psnotdsc: "",

    psnotchn: "",
    psnotcat: "",
    psschsts: false,
    recipientType: "",
    pssegcde: "",

    attachments: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => {
      const {
        sendDate,
        sendTime,
        freq_code,
        freq_value,
        expiry_date,
        psschsts,
      } = values;

      //Combined Send Date and Send Time
      let newSendDate = new Date(sendDate);
      let convertedSendTime = dayjs(sendTime, { format: "HH:mm" });
      newSendDate.setHours(
        convertedSendTime.hour(),
        convertedSendTime.minute()
      );

      let postValue = {
        psschstd: newSendDate,
        psschfrq: freq_code,
        psschfrv: freq_value,
        psschexp: expiry_date,
        psschsts: psschsts ? "Y" : "N",
        id,
      };

      onSubmit(postValue);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          recipientType:
            detailData.pssegcde && detailData.pssegcde != ""
              ? "SEGMENT"
              : "MANUAL",
          sendDate: detailData.psschstd,
          sendTime: detailData.psschstd,
          freq_code: detailData.psschfrq,
          freq_value: detailData.psschfrv,
          expiry_date: detailData.psschexp,
          psschsts: detailData.psschsts == "Y" ? true : false,
          id,
        });

        //Set File
        if (
          detailData?.attachments !== "" &&
          detailData?.attachments.length > 0
        ) {
          //Reset selected file
          setSelectedEmailFile([]);
          //setEmailFile([]);

          //Multiple File
          (detailData?.attachments).forEach((fileItem: any) => {
            setSelectedEmailFile((previousFile) => [
              ...previousFile,
              {
                uid: fileItem.psdocfnm,
                name: fileItem.psdoconm,
                status: "done",
                fileStatus: "old",
                url: fileItem?.download_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
                thumbUrl: fileItem?.document_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
                preview: fileItem?.document_url,
              },
            ]);
          });
        } else {
          setSelectedEmailFile([]);
        }
      }
    }
  }, [detailData]);

  const handleStatusChange = () => {
    formik.setFieldValue("psschsts", !formik.values.psschsts);
  };

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: amendSchedule(data),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "Scheduled Notification",
          message: "Schedule Updated",
        });
        router.back();
      }, 200);
    }
  }

  function handlePreview() {
    onOpen();
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
      //Multiple Upload
      setSelectedEmailFile((previousFile) => [
        ...previousFile,
        {
          uid: file?.name,
          name: file?.name,
          status: "done",
          fileStatus: "new",
          url: genThumbUrl(file.originFileObj),
          thumbUrl: genThumbUrl(file.originFileObj),
          preview: genThumbUrl(file.originFileObj)
        },
      ]);

      //Multiple Upload
      //setEmailFile((previousFile) => [...previousFile, file.originFileObj]); //For multiple file
    }
    return false;
  };

  // async function handleDownload(filename: string) {
  //   await sendRequest({
  //     fn: download({
  //       filename,
  //     }),
  //   });
  // }

  // const handleRemove = (file: any) => {
  //   // Remove the file from the fileList state
  //   setSelectedEmailFile((prevList) =>
  //     prevList.filter((item) => item.uid !== file.uid)
  //   );

  //   //For multiple upload
  //   setEmailFile((prevFile) =>
  //     prevFile.filter((item) => item.name !== file.uid)
  //   );
  // };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Scheduled Notification Detail
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Scheduled Notification",
                  href: `/notificationSchedules`, // Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "Scheduled Notification Detail" + " (" + mode + ")",
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
              {mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
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
          <Card className="grid grid-cols-1 gap-6">
            <div className="flex flex-col sm:flex-column gap-3">
              <Text fontSize={"lg"}>Messages</Text>
              <Box display="flex" flexDir="column" gap={6}>
                <Flex flexDir={"row"}>
                  <FormControl
                    id="psnotchn"
                    isInvalid={
                      Boolean(formik.errors.psnotchn) &&
                      Boolean(formik.touched.psnotchn)
                    }
                    isReadOnly={true}
                    pr={1}
                  >
                    <FormLabel>Notification Type</FormLabel>
                    <Select
                      //placeholder="Please Select Notification Type"
                      value={formik.values.psnotchn}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isDisabled={true}
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
                  {formik.values.psnotchn != "PSH" && (
                    <FormControl
                      id="psnotcat"
                      isInvalid={
                        Boolean(formik.errors.psnotcat) &&
                        Boolean(formik.touched.psnotcat)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Notification Category</FormLabel>
                      <Select
                        placeholder="Please Select Notification Category"
                        value={formik.values.psnotcat}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={true}
                      >
                        {ddlData?.NOTCATG?.map((option: DDL_TYPES) => (
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
                  )}
                </Flex>
                {formik.values.psnotchn == "WAP" ? (
                  <>
                    <FormControl
                      id="psmsgtid"
                      isInvalid={
                        Boolean(formik.errors.psmsgtid) &&
                        Boolean(formik.touched.psmsgtid)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Template ID</FormLabel>
                      <Input
                        placeholder={"Enter Template Id"}
                        type="text"
                        name="psmsgtid"
                        //onChange={formik.handleChange}
                        onChange={(event) => {
                          const { value } = event.target;
                          formik.handleChange({
                            target: { value, name: "psmsgtid" },
                          });
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.psmsgtid}
                        //isDisabled={mode === "EDIT" ? true : false}
                      />

                      {formik.errors.psmsgtid && (
                        <FormErrorMessage>
                          {formik.errors.psmsgtid}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psmsgttl"
                      isInvalid={
                        Boolean(formik.errors.psmsgttl) &&
                        Boolean(formik.touched.psmsgttl)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Template Name</FormLabel>
                      <Input
                        placeholder={"Enter Title"}
                        type="text"
                        name="psmsgttl"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psmsgttl}
                      />
                      {formik.errors.psmsgttl && (
                        <FormErrorMessage>
                          {formik.errors.psmsgttl}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                ) : (
                  <FormControl
                    id="psmsgttl"
                    isInvalid={
                      Boolean(formik.errors.psmsgttl) &&
                      Boolean(formik.touched.psmsgttl)
                    }
                    isReadOnly={true}
                  >
                    <FormLabel>Title</FormLabel>
                    <Input
                      placeholder={"Enter Title"}
                      type="text"
                      name="psmsgttl"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgttl}
                    />
                    {formik.errors.psmsgttl && (
                      <FormErrorMessage>
                        {formik.errors.psmsgttl}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}

                {formik.values.psnotchn == "EMLE" ? (
                  <FormControl
                    id="psmsgbdy"
                    isInvalid={
                      Boolean(formik.errors.psmsgbdy) &&
                      Boolean(formik.touched.psmsgbdy)
                    }
                    isReadOnly={true}
                  >
                    <FormLabel>Message Body</FormLabel>
                    <iframe
                      title="Preview"
                      srcDoc={formik.values.psmsgbdy}
                      style={{ width: "100%", height: "60vh", border: "none" }}
                    />
                    {formik.errors.psmsgbdy && (
                      <FormErrorMessage>
                        {formik.errors.psmsgbdy}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                ) : formik.values.psnotchn == "WAP" ? (
                  <>
                    <FormControl
                      id="psmsgbdy"
                      isInvalid={
                        Boolean(formik.errors.psmsgbdy) &&
                        Boolean(formik.touched.psmsgbdy)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Metadata</FormLabel>
                      <Textarea
                        name="psmsgbdy"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psmsgbdy}
                      />
                      {formik.errors.psmsgbdy && (
                        <FormErrorMessage>
                          {formik.errors.psmsgbdy}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="pswapmsg"
                      isInvalid={
                        Boolean(formik.errors.pswapmsg) &&
                        Boolean(formik.touched.pswapmsg)
                      }
                      isReadOnly={true}
                    >
                      <FormLabel>Message Body</FormLabel>
                      <Textarea
                        placeholder={"Enter Message Body"}
                        //type="text"
                        name="pswapmsg"
                        //onChange={formik.handleChange}
                        onChange={(event) => {
                          const { value } = event.target;
                          formik.handleChange({
                            target: { value, name: "pswapmsg" },
                          });
                        }}
                        sx={{ height: "150px" }}
                        onBlur={formik.handleBlur}
                        value={formik.values.pswapmsg}
                      />
                      {formik.errors.pswapmsg && (
                        <FormErrorMessage>
                          {formik.errors.pswapmsg}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                ) : (
                  <FormControl
                    id="psmsgbdy"
                    isInvalid={
                      Boolean(formik.errors.psmsgbdy) &&
                      Boolean(formik.touched.psmsgbdy)
                    }
                    isReadOnly={true}
                  >
                    <FormLabel>Message Body</FormLabel>
                    <Textarea
                      name="psmsgbdy"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgbdy}
                      sx={{ height: "200px" }}
                    />
                    {formik.errors.psmsgbdy && (
                      <FormErrorMessage>
                        {formik.errors.psmsgbdy}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
                {formik.values.psnotchn == "PSH" && (
                  <FormControl
                    id="psmsgurl"
                    isInvalid={
                      Boolean(formik.errors.psmsgurl) &&
                      Boolean(formik.touched.psmsgurl)
                    }
                    isDisabled={true}
                    //isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <FormLabel>URL</FormLabel>
                    <Input
                      placeholder={"Enter URL"}
                      type="text"
                      name="psmsgurl"
                      //onChange={formik.handleChange}
                      onChange={(event) => {
                        const { value } = event.target;
                        formik.handleChange({
                          target: { value, name: "psmsgurl" },
                        });
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgurl}
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                    {formik.errors.psmsgurl && (
                      <FormErrorMessage>
                        {formik.errors.psmsgurl}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}

                {formik.values.psnotchn != "WAP" && (
                  <FormControl
                    id="attachments"
                    isInvalid={
                      Boolean(formik.errors.attachments) &&
                      Boolean(formik.touched.attachments)
                    }
                  >
                    <FormLabel>Attachment</FormLabel>
                    <div>
                      <Dragger
                        name="file"
                        style={{ marginBottom: 10 }}
                        fileList={
                          selectedEmailFile ? selectedEmailFile : undefined
                        }
                        disabled={true}
                        onChange={(e: any) => handleFileUpload(e)}
                        customRequest={dummyReq}
                        itemRender={(originNode, file, fileList, action) => {
                          const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(
                            file.name
                          );

                          return (
                            <Space
                              direction="horizontal"
                              style={{
                                backgroundColor: "white",
                                width: "100%",
                                minHeight: "60px",
                                maxHeight: "60px",
                                paddingTop: 10,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingBottom: 5,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "lightgray",
                                justifyContent: "space-between",
                                marginBottom: 5,
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
                                      window.open(file?.preview, "_blank")
                                    }
                                  />
                                </Tooltip>

                                {/* <Tooltip title="Remove">
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
                            </Tooltip> */}
                              </Space>
                            </Space>
                          );
                        }}
                      >
                        <Flex flexDir={"column"} pb={6}>
                          <Text fontSize={"md"} fontWeight={"bold"}>
                            Drop Files here
                          </Text>
                          <Text>or click to upload</Text>
                        </Flex>
                      </Dragger>
                    </div>
                    {formik.errors.attachments && (
                      <FormErrorMessage>
                        {formik.errors.attachments}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Box>
            </div>
          </Card>
          <Flex direction={"column"} w={"100%"} gap={5}>
            <Card className="grid grid-cols-1 gap-6">
              <div className="flex flex-col sm:flex-column gap-3">
                <Text fontSize={"lg"}>Schedule Information</Text>
                <Box display={"flex"} flexDir={"row"}>
                  <Box display="flex" flexDir="column" gap={6} pr={1}>
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
                    <Flex flexDir="row" gap={6} w={"100%"}>
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
                      <FormControl
                        id="psschsts"
                        isInvalid={
                          Boolean(formik.errors.psschsts) &&
                          Boolean(formik.touched.psschsts)
                        }
                      >
                        <FormLabel>Active?</FormLabel>
                        <Switch
                          id="psschsts"
                          name="psschsts"
                          isChecked={formik.values.psschsts}
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
                        {formik.errors.psschsts && (
                          <FormErrorMessage>
                            {formik.errors.psschsts}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                  </Box>
                </Box>
              </div>
            </Card>
            <Card className="grid grid-cols-1 gap-6">
              <div className="flex flex-col sm:flex-column gap-3">
                <Text fontSize={"lg"}>Recipients</Text>
                <Box display="flex" flexDir="column" gap={6}>
                  <RadioGroup
                    name="recipientType"
                    value={formik.values.recipientType}
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "recipientType" },
                      })
                    }
                    isDisabled={true}
                  >
                    <Stack gap={3} direction="row">
                      {/* <Radio value="SEGMENT">Segment</Radio> */}
                      <Radio value="MANUAL">Manual</Radio>
                    </Stack>
                  </RadioGroup>
                  <Box display="flex" flexDir="column" gap={6}>
                    {/* <FormControl
                      id="pssegcde"
                      isInvalid={
                        Boolean(formik.errors.pssegcde) &&
                        Boolean(formik.touched.pssegcde)
                      }
                    >
                      <FormLabel>Segment</FormLabel>
                      <Flex direction={"row"} alignItems={"center"}>
                        <Select
                          placeholder="Please Select Segment"
                          value={formik.values.pssegcde}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          pr={1}
                          isDisabled={true}
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
                      </Flex>

                      {formik.errors.pssegcde && (
                        <FormErrorMessage>
                          {formik.errors.pssegcde}
                        </FormErrorMessage>
                      )}
                    </FormControl> */}
                    <Buttons
                      width={"30%"}
                      variant={"outline"}
                      borderColor={Colors.PRIMARY}
                      color={Colors.PRIMARY}
                      buttonText="View Recipients"
                      style={{ alignSelf: "center" }}
                      buttonDefaultType="CUSTOM"
                      buttonHoverBackgroundColor={Colors.PRIMARY}
                      buttonHoverColor={Colors.BACKGROUND}
                      isDisabled={
                        formik.values.recipientType == "SEGMENT" &&
                        formik.values.pssegcde == ""
                          ? true
                          : false
                      }
                      onClick={handlePreview}
                    />
                  </Box>
                </Box>
              </div>
            </Card>
          </Flex>
        </Flex>
        <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
          <Box>
            <Space size="small">
              <Buttons
                buttonDefaultType={"BACK"}
                onclick={() => router.back()}
              />
              {mode !== "VIEW" && (
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
        children={<PreviewScheduleRecipients id={id} />}
      />
    </>
  );
}
