// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Textarea,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  InputGroup,
  Stack,
} from "@chakra-ui/react";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// assets
import React, { useEffect, useState } from "react";

import {
  Space,
  Tag,
  DatePicker,
  UploadFile,
  Upload,
  Image,
  Typography,
  Tooltip,
} from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  download,
  openGlobalModal,
  postBulkUploadFile,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { manage } from "@app/redux/announcement/slice";
import useFetchAnnouncementDetail from "@app/hooks/selector/useFetchAnnouncementDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import dayjs from "dayjs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { announcementSchema } from "../@schemas/announcementSchema";
import {
  DownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined,
} from "@ant-design/icons";

export default function ProdTypeForm(props: any) {
  function genDocumentUrl(file_link: string) {
    // const hostname = process.env.NEXT_PUBLIC_API_URL;
    // // const nowTs = new Date().getTime();

    return file_link
  }
  const { sendRequest, loading } = useApi({ title: "Announcement" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const { data: detailData } = useFetchAnnouncementDetail(id);
  const [ddlData] = useFetchDDL({ code: ["YESORNO", "ANNTYP"] });

  const { Dragger } = Upload;
  const [announcementFile, setAnnouncementFile] = useState("");
  const [selectedAnnouncementFile, setSelectedAnnouncementFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const initialValues = {
    psannuid: "",
    psannttl: "",
    psanntyp: "",
    psannsts: true,
    psannmsg: "",
    psannimg: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: announcementSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData?.psannuid,
          pstypstd: dayjs(detailData?.pstypstd),
          psannsts: detailData?.psannsts === "Y" ? true : false,
        });

        //Set File
        if (detailData?.psannimg !== "") {
          //Reset selected file
          setSelectedAnnouncementFile([]);
          setAnnouncementFile("");

          //Single File
          setSelectedAnnouncementFile(() => [
            {
              uid: detailData?.psannimg,
              name: detailData?.originalName,
              status: "done",
              fileStatus: "old",
              url: genDocumentUrl(detailData?.document_link),
              thumbUrl: genDocumentUrl(detailData?.document_link),
              preview: genDocumentUrl(detailData?.document_link),
            },
          ]);
        } else {
          setSelectedAnnouncementFile([]);
        }
      }
    }
  }, [detailData]);

  const handleSwitch = () => {
    formik.setFieldValue("psannsts", !formik.values.psannsts);
    if (!formik.values.psannsts) {
      console.log("green"); //on
    } else {
      console.log("red"); //off
    }
  };


  async function onSubmit(data: any) {
    //Default Attachment
    data.attachments = [];

    //Single Upload
    let uploadedFile = "";

    if (announcementFile !== "") {
      const formData = new FormData();

      //For single upload
      formData.append(`document`, announcementFile);

      const { success, message } = await sendRequest({
        fn: postBulkUploadFile(formData),
        formik,
      });

      if (success) {
        //Single Upload
        uploadedFile = message?.document[0]?.sysfnm;
        data.attachments.push(uploadedFile);
        data.psannimg = uploadedFile;
      } else {
        return;
      }
    } else {
      data.attachments = [];
      data.psannimg = "";
    }
    const { success } = await sendRequest({
      fn: manage({
        ...data,
        id: mode === "EDIT" ? data.id : "",
        psdocnme: data.attachments[0],
        psannsts: formik.values.psannsts === true ? "Y" : "N",
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update Record" : "Add Record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
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
      const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);
      if (isImage) {
        //Single Upload
        //Set File
        setSelectedAnnouncementFile(() => [
          {
            uid: file?.name,
            name: file?.name,
            status: "done",
            fileStatus: "new",
            url: genThumbUrl(file.originFileObj),
            thumbUrl: genThumbUrl(file.originFileObj),
            preview: genThumbUrl(file.originFileObj),
          },
        ]);

        //Single Upload
        setAnnouncementFile(file.originFileObj);
      } else {
        showModal(dispatch, {
          title: "File Upload",
          message: "Only Image file is allowed",
          status: "error",
        });
      }
    }
  };

  // async function handleDownload(filename: string) {
  //   await sendRequest({
  //     fn: download({
  //       filename,
  //     }),
  //   });
  // }

  async function handleDownload(link: string, filename: string) {
    // await sendRequest({
    //     fn: download({
    //         filename,
    //     }),
    // });
    try {

      const response = await fetch(link);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // Set desired file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err)
    }

  }

  const handleRemove = (file: any) => {
    // Remove the file from the fileList state
    setSelectedAnnouncementFile([]);
    setAnnouncementFile("");
  };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Announcement
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Announcement ",
                  href: `/announcement`,
                },
                {
                  title: "Announcement  (" + mode + ")",
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
        <Card
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
        >
          <Box>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="50%">
                {mode != "ADD" ? (
                  <FormControl
                    id="psannuid"
                    isInvalid={
                      Boolean(formik.errors.psannuid) &&
                      Boolean(formik.touched.psannuid)
                    }
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <CustomFormLabel labelText={"Announcement Code"} />

                    <Input
                      placeholder={"Enter Announcement Code"}
                      type="text"
                      name="psannuid"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psannuid}
                      isDisabled={mode === "EDIT" ? true : false}
                    />
                    {formik.errors.psannuid && (
                      <FormErrorMessage>
                        {formik.errors.psannuid}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                ) : (
                  ""
                )}
                <FormControl
                  id="psannttl"
                  isInvalid={
                    Boolean(formik.errors.psannttl) &&
                    Boolean(formik.touched.psannttl)
                  }
                  isReadOnly={mode === "VIEW" || mode == "EDIT" ? true : false}
                >
                  <CustomFormLabel labelText={"Announcement Title"} />

                  <Input
                    placeholder={"Enter Announcement Description"}
                    type="text"
                    name="psannttl"
                    onChange={formik.handleChange}
                    isDisabled={
                      mode === "VIEW" || mode == "EDIT" ? true : false
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.psannttl}
                  />
                  {formik.errors.psannttl && (
                    <FormErrorMessage>
                      {formik.errors.psannttl}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psanntyp"
                  isInvalid={
                    Boolean(formik.errors.psanntyp) &&
                    Boolean(formik.touched.psanntyp)
                  }
                >
                  <FormLabel>Announcement Type</FormLabel>
                  <Select
                    placeholder="Please Select User Role"
                    value={formik.values.psanntyp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.ANNTYP?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psanntyp && (
                    <FormErrorMessage>
                      {formik.errors.psanntyp}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psannsts"
                  isReadOnly={mode === "VIEW" ? true : false}
                  isInvalid={Boolean(formik.errors.psannsts)}
                // columns={{ base: 2, lg: 4 }}
                >
                  <CustomFormLabel labelText={"Status"} />

                  <Switch
                    id="psannsts"
                    size="md"
                    name="psannsts"
                    isChecked={formik.values.psannsts}
                    onChange={handleSwitch}
                    colorScheme={"green"}
                    sx={{
                      "span.chakra-switch__track:not([data-checked])": {
                        backgroundColor: Colors.DANGER,
                      },
                    }}
                  />

                  {formik.errors.psannsts && (
                    <FormErrorMessage>
                      {formik.errors.psannsts}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* </Box>
              <Box display="flex" flexDir="column" gap={6} width="100%"> */}

                <FormControl
                  id="psannmsg"
                  isInvalid={
                    Boolean(formik.errors.psannmsg) &&
                    Boolean(formik.touched.psannmsg)
                  }
                >
                  {/* <CustomFormLabel labelText="Description (EN)" /> */}
                  <FormLabel>Announcement Message</FormLabel>

                  <Textarea
                    // placeholder={"Enter Company Remarks"}
                    // type="text"
                    name="psannmsg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psannmsg}
                  />
                  {/* <Input
                  placeholder={"Enter Description (EN)"}
                  type="text"
                  name="psconmsg"
                  onChange={formik.handleChange}
                  value={formik.values.psconmsg || ""}
                /> */}
                  {formik.errors.psannmsg && (
                    <FormErrorMessage>
                      {formik.errors.psannmsg}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psannimg"
                  isInvalid={
                    Boolean(formik.errors.psannimg) &&
                    Boolean(formik.touched.psannimg)
                  }
                >
                  <FormLabel>Attachment</FormLabel>
                  <div>
                    <Dragger
                      name="file"
                      style={{ marginBottom: 10 }}
                      fileList={
                        selectedAnnouncementFile
                          ? selectedAnnouncementFile
                          : undefined
                      }
                      disabled={selectedAnnouncementFile.length > 0 ? true : false}
                      onChange={(e: any) => handleFileUpload(e)}
                      customRequest={dummyReq}
                      itemRender={(originNode, file: any, fileList, action) => {
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
                              {fileList.filter(
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
                                      onClick={() => handleDownload(file?.url, file?.name)}
                                    // onClick={() => {
                                    //   window.open(file?.url, "_blank");
                                    // }}
                                    />
                                  </Tooltip>
                                )}
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
                          Drop Files here
                        </Text>
                        <Text>or click to upload</Text>
                      </Flex>
                    </Dragger>
                  </div>
                  {formik.errors.psannimg && (
                    <FormErrorMessage>
                      {formik.errors.psannimg}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            </div>
          </Box>
        </Card>
        <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
          <Box>
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
      </form>
    </>
  );
}

interface UploadedFile {
  uid: string;
  name: string;
  status: string;
  url?: string;
  thumbUrl?: string;
}
