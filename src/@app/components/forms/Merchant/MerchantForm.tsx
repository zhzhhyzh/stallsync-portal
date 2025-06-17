// Chakra imports
import Colors from "@app/constants/Colors";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  FormControl, Image,
  FormLabel,
  FormErrorMessage,
  NumberInput, Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  HStack,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Checkbox,
  Stack,
  Switch,
  InputGroup,
  Tooltip
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined, ExportOutlined,
  FileOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";
const { Dragger } = Upload;
import SubHeader from "@app/components/common/Header/SubHeader";

import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// assets
import React, { useEffect, useState } from "react";
import { message, Upload, Typography, UploadFile } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import { postBulkUploadFile } from "@app/redux/app/slice";

import { IoChevronBack, IoSave, IoAddSharp, IoCloseCircle } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import { download } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getmanageMerchant, getmerchantDetail } from "@app/redux/merchant/slice";
import useFetchMerchantDetail from "@app/hooks/selector/useFetchMerchantDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { MerchantSchema } from "@app/components/forms/@schemas/merchantSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLMchuser from "@app/hooks/selector/useFetchDDLMchuser";


export default function MerchantForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Merchant" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  const [ddlData1] = useFetchDDLMchuser();

  // Merchant Type
  const [avaAction, setAvaAction] = useState<{ key: string, label: string }[]>([]);
  const [action, setAction] = useState<{ key: string, label: string, status: number }[]>([]);

  function onAddAction(index: number) {
    let _avaAction = [...avaAction];

    setAction([
      ...action,
      {
        ...avaAction[index],
        status: 1,
      }
    ]);

    _avaAction.splice(index, 1);
    setAvaAction(_avaAction);
  }



  function onRemoveAction(index: number) {
    let _action = [...action];

    setAvaAction([
      ...avaAction,
      action[index],
    ]);
    _action.splice(index, 1);
    setAction(_action);
  }

  //SSM Cert
  const handleRemoveSsc = (file: any) => {
    // Remove the file from the fileList state
    setSelectedSsc([]);
    formik.setFieldValue("psmrcssc", null)

    //For multiple upload
    setSsc([]);
  };
  function genDocumentUrl(filename: string, type?: string) {
    const hostname = process.env.NEXT_PUBLIC_API_URL;
    // const nowTs = new Date().getTime();

    return hostname + `/document/detail?type=${type || ""}&document=${filename}`
  }
  const [ssc, setSsc] = useState<any[]>([]);
  const [selectedSsc, setSelectedSsc] = useState<
    UploadFile<any>[]
  >([]);
  const handleFileUploadSsc = ({ file }: { file: any }) => {
    if (file.type.split("/")[0] !== "image") {
      showModal(dispatch, {
        title: "File Upload",
        message: "Only image is accepted",
        status: "error",
      });
      return false;
    }

    if (file.size > 5242880) {
      showModal(dispatch, {
        title: "File Upload",
        message: "File size cannot be more than 5MB",
        status: "error",
      });
    } else {
      // formik.setErrors({})
      formik.setFieldValue("psmrcssc", file?.name)
      //Multiple Upload
      setSelectedSsc((previousFile: any) => [
        // ...previousFile,
        {
          uid: file?.name,
          name: file?.name,
          status: "done",
          fileStatus: "new",
          url: genThumbUrl(file.originFileObj),
          thumbUrl: genThumbUrl(file.originFileObj),
        },
      ]);


      //Multiple Upload
      setSsc((previousFile: any) => [
        // ...previousFile,
        file.originFileObj]); //For multiple file
    }
    return false;
  };
  const genThumbUrl = (file: any) => {
    return URL.createObjectURL(file);
  };

  // Store Front Image
  const handleRemoveSfi = (file: any) => {
    // Remove the file from the fileList state
    setSelectedSfi([]);
    formik.setFieldValue("psmrcsfi", null)

    //For multiple upload
    setSfi([]);
  };

  const [sfi, setSfi] = useState<any[]>([]);
  const [selectedSfi, setSelectedSfi] = useState<
    UploadFile<any>[]
  >([]);
  const handleFileUploadSfi = ({ file }: { file: any }) => {
    if (file.type.split("/")[0] !== "image") {
      showModal(dispatch, {
        title: "File Upload",
        message: "Only image is accepted",
        status: "error",
      });
      return false;
    }

    if (file.size > 5242880) {
      showModal(dispatch, {
        title: "File Upload",
        message: "File size cannot be more than 5MB",
        status: "error",
      });
    } else {
      // formik.setErrors({})
      formik.setFieldValue("psmrcsfi", file?.name)
      //Multiple Upload
      setSelectedSfi((previousFile: any) => [
        // ...previousFile,
        {
          uid: file?.name,
          name: file?.name,
          status: "done",
          fileStatus: "new",
          url: genThumbUrl(file.originFileObj),
          thumbUrl: genThumbUrl(file.originFileObj),
        },
      ]);


      //Multiple Upload
      setSfi((previousFile: any) => [
        // ...previousFile,
        file.originFileObj]); //For multiple file
    }
    return false;
  };


  // Profile Picture
  const handleRemovePpi = (file: any) => {
    // Remove the file from the fileList state
    setSelectedPpi([]);
    formik.setFieldValue("psmrcppi", null)

    //For multiple upload
    setPpi([]);
  };

  const [ppi, setPpi] = useState<any[]>([]);
  const [selectedPpi, setSelectedPpi] = useState<
    UploadFile<any>[]
  >([]);
  const handleFileUploadPpi = ({ file }: { file: any }) => {
    if (file.type.split("/")[0] !== "image") {
      showModal(dispatch, {
        title: "File Upload",
        message: "Only image is accepted",
        status: "error",
      });
      return false;
    }

    if (file.size > 5242880) {
      showModal(dispatch, {
        title: "File Upload",
        message: "File size cannot be more than 5MB",
        status: "error",
      });
    } else {
      // formik.setErrors({})
      formik.setFieldValue("psmrcppi", file?.name)
      //Multiple Upload
      setSelectedPpi((previousFile: any) => [
        // ...previousFile,
        {
          uid: file?.name,
          name: file?.name,
          status: "done",
          fileStatus: "new",
          url: genThumbUrl(file.originFileObj),
          thumbUrl: genThumbUrl(file.originFileObj),
        },
      ]);


      //Multiple Upload
      setPpi((previousFile: any) => [
        // ...previousFile,
        file.originFileObj]); //For multiple file
    }
    return false;
  };

  async function handleDownload(filename: string, type: number) {
    await sendRequest({
      fn: download({
        filename,
        type,
      }),

    });
  }


  const [detailData] = useFetchMerchantDetail(id);

  const initialValues = {
    psmrcnme: null,
    psmrcuid: null,
    psmrcdsc: null,
    psmrclds: null,
    psmrcjdt: null,
    psmrcown: "",
    psmrcssm: null,
    psmrcssc: null,
    psmrcsts: true,
    psmrcbnk: null,
    psmrcacc: null,
    psmrcsfi: null,
    psmrcppi: null,
    psmrcrtg: 0,
    psmrcrmk: null,
    psmrcbnm: null,
    psmrclbl: []
  };
  // Date Processor
  function convertDateToString(date: Date) {
    if (date instanceof Date && !isNaN(date.getTime()))
      return (
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
      );
    else return "";
  }



  const [ddlData] = useFetchDDL({ code: ["YESORNO", "BANK", "MRCTYP"] });

  const handleNPLStatusChange = () => {
    formik.setFieldValue("psmrcsts", !formik.values.psmrcsts);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: MerchantSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psmrcuid,
        psmrcjdt: dayjs(detailData?.psmrcjdt),
      });

      if (detailData?.psavllbl?.length > 0) {
        setAvaAction(detailData?.psavllbl);
      }

      if (detailData?.psmrclbl?.length > 0) {
        setAction(detailData?.psmrclbl);
      }

      if (detailData?.psmrcssc) {
        setSelectedSsc([
          {
            uid: detailData.psmrcssc,
            name: detailData.psmrcssc,
            status: "done",
            fileStatus: "old",
            url: genDocumentUrl(detailData.psmrcssc, "4"),
            thumbUrl: genDocumentUrl(detailData.psmrcssc, "4"),
          },
        ]);
      } else {
        setSelectedSsc([]);
      }

      if (detailData?.psmrcsfi) {
        setSelectedSfi([
          {
            uid: detailData.psmrcsfi,
            name: detailData.psmrcsfi,
            status: "done",
            fileStatus: "old",
            url: genDocumentUrl(detailData.psmrcsfi, "3"),
            thumbUrl: genDocumentUrl(detailData.psmrcsfi, "3"),
          },
        ]);
      } else {
        setSelectedSfi([]);
      }

      if (detailData?.psmrcppi) {
        setSelectedPpi([
          {
            uid: detailData.psmrcppi,
            name: detailData.psmrcppi,
            status: "done",
            fileStatus: "old",
            url: genDocumentUrl(detailData.psmrcppi, "3"),
            thumbUrl: genDocumentUrl(detailData.psmrcppi, "3"),
          },
        ]);
      } else {
        setSelectedPpi([]);
      }

    }
  }, [detailData]);


  useEffect(() => {
    if (mode === "ADD") {
      if (Object.keys(ddlData).length > 0 && ddlData?.MRCTYP?.length > 0) {
        let _temp: { key: string, label: string }[] = [];
        ddlData?.MRCTYP.map((r: DDL_TYPES) => {
          _temp.push({
            key: r.prgecode,
            label: r.prgedesc,
          })
        });
        setAvaAction(_temp);
      }
    }
  }, [ddlData])
  async function onSubmit(data: any) {
    let uploadedSfi: string[] = [];
    let uploadedSsc: string[] = [];
    let uploadedPpi: string[] = [];
    if (ssc.length > 0) {
      const formData = new FormData();


      //For Multiple upload purpose
      ssc.forEach((fileItem, index) => {
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
            (fileItem: any) => {
              uploadedSsc.push(fileItem.sysfnm);
            }
          );
        }

        //Add Existing Uploaded File
        (selectedSsc).forEach(
          (fileItem: any) => {
            if (fileItem?.fileStatus === "old") uploadedSsc.push(fileItem.uid)
          }
        );

        // only 1
        //  console.log("HAHA",uploadedEmailFile)
        data.psmrcssc = uploadedSsc[0];
      } else {
        return;
      }
    }

    if (sfi.length > 0) {
      const formData = new FormData();


      //For Multiple upload purpose
      sfi.forEach((fileItem, index) => {
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
            (fileItem: any) => {
              uploadedSfi.push(fileItem.sysfnm);
            }
          );
        }

        //Add Existing Uploaded File
        (selectedSfi).forEach(
          (fileItem: any) => {
            if (fileItem?.fileStatus === "old") uploadedSfi.push(fileItem.uid)
          }
        );

        // only 1
        //  console.log("HAHA",uploadedEmailFile)
        data.psmrcsfi = uploadedSfi[0];
      } else {
        return;
      }
    }

    if (ppi.length > 0) {
      const formData = new FormData();


      //For Multiple upload purpose
      ppi.forEach((fileItem, index) => {
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
            (fileItem: any) => {
              uploadedPpi.push(fileItem.sysfnm);
            }
          );
        }

        //Add Existing Uploaded File
        (selectedPpi).forEach(
          (fileItem: any) => {
            if (fileItem?.fileStatus === "old") uploadedPpi.push(fileItem.uid)
          }
        );

        // only 1
        //  console.log("HAHA",uploadedEmailFile)
        data.psmrcppi = uploadedPpi[0];
      } else {
        return;
      }
    }


    const { success } = await sendRequest({
      fn: getmanageMerchant({
        id: mode === "EDIT" ? data.id : "", ...data,
        psmrcsts: formik.values.psmrcsts ? "Y" : "N",
        psmrclbl: action.map(a => a.key),
        psmrcjdt: convertDateToString(new Date(data.psmrcjdt))
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update item" : "Add item",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Merchant
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Merchant",
              href: `/merchant`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Merchant (" + mode + ")",
            },
          ]} />
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
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space>
        </Box>
      </Flex>
      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <SubHeader labelText="General Information" />
        <Box>
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">


              <FormControl
                id="psmrcppi"
                isInvalid={
                  Boolean(formik.errors.psmrcppi) &&
                  Boolean(formik.touched.psmrcppi)
                }
              >
                <FormLabel>Store Profile Picture</FormLabel>
                {/* <CustomFormLabel labelText="Profile Picture" /> */}
                <div>
                  <Dragger
                    name="file"
                    style={{ marginBottom: 10 }}
                    // disabled={
                    //   selectedPushFile && selectedPushFile.length > 0
                    //     ? true
                    //     : false
                    // }
                    disabled={mode === "VIEW" ? true : false}
                    fileList={selectedPpi ? selectedPpi : undefined}
                    onChange={(e: any) => handleFileUploadPpi(e)}
                    customRequest={dummyReq}
                    itemRender={(originNode, file, fileList, action) => {
                      const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);


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
                              <Image maxHeight={10} maxWidth={20} src={file.thumbUrl} />
                            ) : (
                              <FileOutlined
                                style={{
                                  marginBottom: "7px",
                                  width: "60px",
                                  color: "gray",
                                }}
                              // rev={undefined}
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
                          <Space style={{ alignSelf: "flex-end" }} size={"small"}>
                            {fileList.filter(
                              (item: any) =>
                                item.uid === file.uid && item.fileStatus === "old"
                            ).length > 0 && (
                                <Tooltip title="Download">
                                  <DownloadOutlined
                                    // rev={undefined}
                                    style={{
                                      color: "gray",
                                      fontSize: 14,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      marginBottom: "6px",
                                    }}
                                    onClick={() => handleDownload(file?.uid, 3)}
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
                                onClick={() => window.open(file?.url, "_blank")}
                              // rev={undefined}
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
                                  handleRemovePpi(file);
                                }}
                              // rev={undefined}
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
                {formik.errors.psmrcppi && (
                  <FormErrorMessage>{formik.errors.psmrcppi}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psmrcuid"
                isInvalid={Boolean(formik.errors.psmrcuid) && Boolean(formik.touched.psmrcuid)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Merchant*</FormLabel> */}
                <CustomFormLabel labelText="Merchant Id" />
                <Input
                  placeholder={"Enter Merchant ID"}
                  type="text"
                  name="psmrcuid"
                  onChange={formik.handleChange}
                  value={formik.values.psmrcuid || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.psmrcuid && (
                  <FormErrorMessage>{formik.errors.psmrcuid}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psmrcnme"
                isInvalid={Boolean(formik.errors.psmrcnme) && Boolean(formik.touched.psmrcnme)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Name" />
                <Input
                  placeholder={"Enter Name"}
                  type="text"
                  name="psmrcnme"
                  onChange={formik.handleChange}
                  value={formik.values.psmrcnme || ""}
                />
                {formik.errors.psmrcnme && (
                  <FormErrorMessage>{formik.errors.psmrcnme}</FormErrorMessage>
                )}
              </FormControl>


            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">

              <FormControl
                id="psmrcsfi"
                isInvalid={
                  Boolean(formik.errors.psmrcsfi) &&
                  Boolean(formik.touched.psmrcsfi)
                }
              >
                <FormLabel>Store Front Image</FormLabel>

                {/* <CustomFormLabel labelText="Store Front Image" /> */}
                <div>
                  <Dragger
                    name="file"
                    style={{ marginBottom: 10 }}
                    // disabled={
                    //   selectedPushFile && selectedPushFile.length > 0
                    //     ? true
                    //     : false
                    // }
                    disabled={mode === "VIEW" ? true : false}
                    fileList={selectedSfi ? selectedSfi : undefined}
                    onChange={(e: any) => handleFileUploadSfi(e)}
                    customRequest={dummyReq}
                    itemRender={(originNode, file, fileList, action) => {
                      const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);


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
                              <Image maxHeight={10} maxWidth={20} src={file.thumbUrl} />
                            ) : (
                              <FileOutlined
                                style={{
                                  marginBottom: "7px",
                                  width: "60px",
                                  color: "gray",
                                }}
                              // rev={undefined}
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
                          <Space style={{ alignSelf: "flex-end" }} size={"small"}>
                            {fileList.filter(
                              (item: any) =>
                                item.uid === file.uid && item.fileStatus === "old"
                            ).length > 0 && (
                                <Tooltip title="Download">
                                  <DownloadOutlined
                                    // rev={undefined}
                                    style={{
                                      color: "gray",
                                      fontSize: 14,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      marginBottom: "6px",
                                    }}
                                    onClick={() => handleDownload(file?.uid, 3)}
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
                                onClick={() => window.open(file?.url, "_blank")}
                              // rev={undefined}
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
                                  handleRemoveSfi(file);
                                }}
                              // rev={undefined}
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
                {formik.errors.psmrcsfi && (
                  <FormErrorMessage>{formik.errors.psmrcsfi}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psmrcdsc"
                isInvalid={Boolean(formik.errors.psmrcdsc) && Boolean(formik.touched.psmrcdsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description" />
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="psmrcdsc"
                  onChange={formik.handleChange}
                  value={formik.values.psmrcdsc || ""}
                />
                {formik.errors.psmrcdsc && (
                  <FormErrorMessage>{formik.errors.psmrcdsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psmrclds"
                isInvalid={Boolean(formik.errors.psmrclds) && Boolean(formik.touched.psmrclds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="psmrclds"
                  onChange={formik.handleChange}
                  value={formik.values.psmrclds || ""}
                />
                {formik.errors.psmrclds && (
                  <FormErrorMessage>{formik.errors.psmrclds}</FormErrorMessage>
                )}
              </FormControl>

            </Box>








          </div>
        </Box>
      </Card>

      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Box>
          <SubHeader labelText="Detail Information" />
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">



              <FormControl
                id="psmrcssm"
                isInvalid={Boolean(formik.errors.psmrcssm) && Boolean(formik.touched.psmrcssm)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="SSM No." />
                <Input
                  placeholder={"Enter SSM No."}
                  type="text"
                  name="psmrcssm"
                  onChange={formik.handleChange}
                  value={formik.values.psmrcssm || ""}
                />
                {formik.errors.psmrcssm && (
                  <FormErrorMessage>{formik.errors.psmrcssm}</FormErrorMessage>
                )}
              </FormControl>


              <FormControl
                id="psmrcssc"
                isInvalid={
                  Boolean(formik.errors.psmrcssc) &&
                  Boolean(formik.touched.psmrcssc)
                }
              >

                <CustomFormLabel labelText="SSM Cert. Image" />
                <div>
                  <Dragger
                    name="file"
                    style={{ marginBottom: 10 }}
                    // disabled={
                    //   selectedPushFile && selectedPushFile.length > 0
                    //     ? true
                    //     : false
                    // }
                    disabled={mode === "VIEW" ? true : false}
                    fileList={selectedSsc ? selectedSsc : undefined}
                    onChange={(e: any) => handleFileUploadSsc(e)}
                    customRequest={dummyReq}
                    itemRender={(originNode, file, fileList, action) => {
                      const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);


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
                              <Image maxHeight={10} maxWidth={20} src={file.thumbUrl} />
                            ) : (
                              <FileOutlined
                                style={{
                                  marginBottom: "7px",
                                  width: "60px",
                                  color: "gray",
                                }}
                              // rev={undefined}
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
                          <Space style={{ alignSelf: "flex-end" }} size={"small"}>
                            {fileList.filter(
                              (item: any) =>
                                item.uid === file.uid && item.fileStatus === "old"
                            ).length > 0 && (
                                <Tooltip title="Download">
                                  <DownloadOutlined
                                    // rev={undefined}
                                    style={{
                                      color: "gray",
                                      fontSize: 14,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      marginBottom: "6px",
                                    }}
                                    onClick={() => handleDownload(file?.uid, 4)}
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
                                onClick={() => window.open(file?.url, "_blank")}
                              // rev={undefined}
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
                                  handleRemoveSsc(file);
                                }}
                              // rev={undefined}
                              />
                            </Tooltip>
                          </Space>
                        </Space>
                      );
                    }}
                  >
                    <Flex flexDir={"column"} pb={10}>
                      <Text fontSize={"md"} fontWeight={"bold"}>
                        Drop Files here
                      </Text>
                      <Text>or click to upload</Text>
                    </Flex>
                  </Dragger>
                </div>
                {formik.errors.psmrcssc && (
                  <FormErrorMessage>{formik.errors.psmrcssc}</FormErrorMessage>
                )}
              </FormControl>
              <div className="flex flex-col sm:flex-row gap-6">
                {mode != "ADD" ?
                  <Box display="flex" flexDir="column" gap={6} width="100%">
                    <FormControl
                      id="psmrcsts"
                      w={"49%"}
                      isInvalid={
                        Boolean(formik.errors.psmrcsts) &&
                        Boolean(formik.touched.psmrcsts)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <FormLabel>Active Status</FormLabel>
                      <Switch
                        id="psmrcsts"
                        name="psmrcsts"
                        isChecked={formik.values.psmrcsts}
                        onChange={handleNPLStatusChange}
                        onBlur={formik.handleBlur}
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          "span.chakra-switch__track:not([data-checked])": {
                            backgroundColor: Colors.DANGER,
                          },
                        }}
                        mt={1}
                      />
                      {formik.errors.psmrcsts && (
                        <FormErrorMessage>
                          {formik.errors.psmrcsts}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                  : ""}
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <FormControl
                    id="psmrcjdt"
                    isInvalid={
                      Boolean(formik.errors.psmrcjdt) &&
                      Boolean(formik.touched.psmrcjdt)
                    }
                  //    isReadOnly
                  >
                    <FormLabel>Join Date</FormLabel>
                    <DatePicker disabled={mode === "VIEW"}
                      format={"DD/MM/YYYY"}
                      style={{ width: "100%" }}
                      value={
                        formik.values.psmrcjdt
                          ? dayjs(formik.values.psmrcjdt)
                          : null
                      }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "psmrcjdt" },
                        })
                      }
                      onBlur={formik.handleBlur}
                    // disabled={true}
                    />
                    {formik.errors.psmrcjdt && (
                      <FormErrorMessage>{formik.errors.psmrcjdt}</FormErrorMessage>
                    )}
                  </FormControl>

                </Box>
              </div>




            </Box>
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="psmrcbnk"
                isInvalid={Boolean(formik.errors.psmrcbnk) && Boolean(formik.touched.psmrcbnk)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Bank" />
                <Select
                  placeholder="Select Bank"
                  value={formik.values.psmrcbnk || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.BANK?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psmrcbnk && (
                  <FormErrorMessage>{formik.errors.psmrcbnk}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psmrcacc"
                isInvalid={Boolean(formik.errors.psmrcacc) && Boolean(formik.touched.psmrcacc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Bank Account No." />
                <Input
                  placeholder={"Enter Bank Account No."}
                  type="text"
                  name="psmrcacc"
                  onChange={formik.handleChange}
                  value={formik.values.psmrcacc || ""}
                />
                {formik.errors.psmrcacc && (
                  <FormErrorMessage>{formik.errors.psmrcacc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psmrcbnm"
                isInvalid={Boolean(formik.errors.psmrcbnm) && Boolean(formik.touched.psmrcbnm)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Bank Name" />
                <Input
                  placeholder={"Enter Bank Name"}
                  type="text"
                  name="psmrcbnm"
                  onChange={formik.handleChange}
                  value={formik.values.psmrcbnm || ""}
                />
                {formik.errors.psmrcbnm && (
                  <FormErrorMessage>{formik.errors.psmrcbnm}</FormErrorMessage>
                )}
              </FormControl>
              {
                mode != "ADD" ?
                  <FormControl
                    id="psmrcrtg"
                    isInvalid={Boolean(formik.errors.psmrcrtg) && Boolean(formik.touched.psmrcrtg)}
                    isReadOnly
                  >
                    <FormLabel>Rating</FormLabel>
                    <Stack spacing={4}>
                      <InputGroup>

                        <Input
                          type="text"
                          name="psmrcrtg"
                          placeholder="Enter Rating"
                          value={numberWithCommas(formik.values.psmrcrtg)}
                          pattern={numberPattern}
                          onChange={(event) => {
                            const value = event.target.value;

                            // Check if the value is a valid number or empty
                            if (!value || /^[0-9.,]*$/.test(value)) {
                              formik.handleChange({
                                target: {
                                  value: parseThousandsToNumber(value),
                                  name: "psmrcrtg",
                                },
                              });
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psmrcrtg && (
                      <FormErrorMessage>{formik.errors.psmrcrtg}</FormErrorMessage>
                    )}
                  </FormControl> : ""
              }

              <FormControl
                id="psmrcown"
                isInvalid={
                  Boolean(formik.errors.psmrcown) &&
                  Boolean(formik.touched.psmrcown)
                }
              >
                <FormLabel>Merchant Owner</FormLabel>
                <Select
                  placeholder="Please Select User"
                  value={formik.values.psmrcown}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {Array.isArray(ddlData1) &&
                    ddlData1
                      .map((option: any) => (
                        <option
                          key={option.psusrunm}
                          value={option.psusrnam}
                        >
                          {option.psusrunm + " - " + option.psusrnam}
                        </option>
                      ))}
                </Select>
                {formik.errors.psmrcown && (
                  <FormErrorMessage>
                    {formik.errors.psmrcown}
                  </FormErrorMessage>
                )}
              </FormControl>

            </Box>
          </div>
        </Box>



      </Card>

      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Box w={{
          base: "100%",
          lg: '49%'
        }}>
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <SubHeader labelText="Merchant Label" />

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text fontSize={"xs"} fontWeight={"semibold"} color={"#526069"} textTransform={"uppercase"}>Type</Text>
              <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} >
                <Space size="small" >
                  <Menu>
                    <MenuButton as={IconButton} icon={<IoAddSharp />}></MenuButton>
                    <MenuList minWidth={"5rem"}>
                      {
                        avaAction && avaAction.length > 0 ? (
                          avaAction.map((r: any, i: number) =>
                            <MenuItem onClick={() => { onAddAction(i) }} >{r.label}</MenuItem>)
                        ) : (
                          <MenuItem>No Available Type</MenuItem>
                        )
                      }
                    </MenuList>
                  </Menu>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Add Type
                  </Text>
                </Space>
              </Box>
            </Box>
            {
              action ? (
                <Box>
                  {
                    action.map((r: any, i: number) => {
                      return (
                        <Box p={2} m={2} display={"flex"} borderWidth={1} borderColor={Colors.GRAY} borderRadius={15} justifyContent={"space-between"} alignItems={"center"}>
                          <Text>{r.key} - {r.label}</Text>
                          <HStack>

                            <IconButton
                              variant={"outline"}
                              // variant="danger"
                              color={Colors.DANGER}
                              icon={<IoCloseCircle size={18} />}
                              aria-label={"delete"}
                              onClick={() => onRemoveAction(i)}
                            />
                          </HStack>
                        </Box>
                      )
                    })
                  }
                </Box>
              ) : (
                <Box></Box>
              )
            }
          </Card>
        </Box>

      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}

