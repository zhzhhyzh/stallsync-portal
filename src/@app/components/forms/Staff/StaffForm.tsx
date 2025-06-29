// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage, Tooltip, Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Checkbox,
  Switch,
} from "@chakra-ui/react";
const { Dragger } = Upload;
import { postBulkUploadFile } from "@app/redux/app/slice";

import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";


// assets
import React, { useEffect, useState } from "react";
import { message, Upload, Typography, UploadFile } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";
import SubHeader from "@app/components/common/Header/SubHeader";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getmanageStaff, getstaffDetail } from "@app/redux/staff/slice";
import useFetchStaffDetail from "@app/hooks/selector/useFetchStaffDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { StaffSchema } from "@app/components/forms/@schemas/staffSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { download } from "@app/redux/app/slice";

import useFetchDDLAvlUser from "@app/hooks/selector/useFetchDDLAvlUser";
import useFetchDDLMerchants from "@app/hooks/selector/useFetchDDLMerchants";

export default function StaffForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Staff" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchStaffDetail(id);
  const [ddlData2] = useFetchDDLMerchants();

  const initialValues = {
    psstfuid: "",
    psstfnme: "",
    psmrcuid: "",
    psstftyp: "",
    psstfidt: "",
    psstfidn: "",
    psstfprp: "",
    psstfnat: "MY",
    psstfjdt: "",
    psstfsts: true,
    psstfad1: "",
    psstfad2: "",
    psstfpos: "",
    psstfcit: "",
    psstfsta: "",
    psstfsam: false,
    psstfha1: "",
    psstfha2: "",
    psstfhpo: "",
    psstfhci: "",
    psstfhst: "",
    psstfeml: "",
    psstfbnk: "",
    psstfacc: "",
    psstfbnm: "",
    psstfepr: "",
    psstfehp: "",
    psusrunm: "",
    psstfchp: "",


  };

  const handleStatusChange = () => {
    formik.setFieldValue("psstfsts", !formik.values.psstfsts);
  };

  const handleSameChange = () => {
    formik.setFieldValue("psstfsam", !formik.values.psstfsam);
  };

  const [ddlData] = useFetchDDL({ code: ["STAFFTYP", "YESORNO", "NATION", "IDTYPE", "HPPRE", "BANK"] });
  // Date Processor
  function convertDateToString(date: Date) {
    if (date instanceof Date && !isNaN(date.getTime()))
      return (
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
      );
    else return "";
  }

  // Handle Profile Picture

  async function handleDownload(filename: string, type: number) {
    await sendRequest({
      fn: download({
        filename,
        type,
      }),

    });
  }
  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };
  const genThumbUrl = (file: any) => {
    return URL.createObjectURL(file);
  };
  function genDocumentUrl(filename: string, type?: string) {
    const hostname = process.env.NEXT_PUBLIC_API_URL;
    // const nowTs = new Date().getTime();

    return hostname + `/document/detail?type=${type || ""}&document=${filename}`
  }
  const handleRemoveSfi = (file: any) => {
    // Remove the file from the fileList state
    setSelectedSfi([]);
    formik.setFieldValue("psstfprp", null)

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
      formik.setFieldValue("psstfprp", file?.name)
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


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: StaffSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });


  const [ddlData1, reloadDDLData1] = useFetchDDLAvlUser();



  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psstfuid,
        psstfjdt: dayjs(detailData?.psstfjdt),
        psstfsam: detailData?.psstfsam == "Y" ? true : false,
        psstfsts: detailData?.psstfsts == "Y" ? true : false
      });

      if (detailData?.psstfprp) {
        setSelectedSfi([
          {
            uid: detailData.psstfprp,
            name: detailData.psstfprp,
            status: "done",
            fileStatus: "old",
            url: genDocumentUrl(detailData.psstfprp, "3"),
            thumbUrl: genDocumentUrl(detailData.psstfprp, "3"),
          },
        ]);
      } else {
        setSelectedSfi([]);
      }

      // reloadDDLData1(detailData?.psstftyp);
    }
  }, [detailData]);

  useEffect(() => {
    if (detailData?.psstftyp) {
      reloadDDLData1(detailData.psstftyp);
    }
  }, [detailData?.psstftyp]);


  async function onSubmit(data: any) {
    let uploadedSfi: string[] = [];
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
        data.psstfprp = uploadedSfi[0];
      } else {
        return;
      }
    }
    const { success } = await sendRequest({
      fn: getmanageStaff({
        id: mode === "EDIT" ? data.id : "", ...data,
        // psstfjdt: convertDateToString(new Date(data.psstfjdt)),
        psstfsts: formik.values.psstfsts ? "Y" : "N",
        psstfsam: formik.values.psstfsam ? "Y" : "N",
        psstfha1: formik.values.psstfsam ? formik.values.psstfad1 : formik.values.psstfha1,
        psstfha2: formik.values.psstfsam ? formik.values.psstfad2 : formik.values.psstfha2,
        psstfhpo: formik.values.psstfsam ? formik.values.psstfpos : formik.values.psstfhpo,
        psstfhst: formik.values.psstfsam ? formik.values.psstfsta : formik.values.psstfhst,
        psstfhci: formik.values.psstfsam ? formik.values.psstfcit : formik.values.psstfhci,
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
            Staff
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Staff",
              href: `/staff`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Staff (" + mode + ")",
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
        <Box>
          <SubHeader labelText="General Information" />

          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">

              <FormControl
                id="psstfprp"
                isInvalid={
                  Boolean(formik.errors.psstfprp) &&
                  Boolean(formik.touched.psstfprp)
                }
              >
                <FormLabel>Profile Picture</FormLabel>

                {/* <CustomFormLabel labelText="Store Front Image" /> */}
                <div>
                  <Dragger
                    name="file"
                    style={{ marginBottom: 2 }}
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
                                    onClick={() => handleDownload(file?.uid, 2)}
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
                {formik.errors.psstfprp && (
                  <FormErrorMessage>{formik.errors.psstfprp}</FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}>

                {mode != "ADD" ?
                  <FormControl
                    id="psstfuid"
                    isInvalid={Boolean(formik.errors.psstfuid) && Boolean(formik.touched.psstfuid)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Staff*</FormLabel> */}
                    <CustomFormLabel labelText="Staff ID" />
                    <Input
                      placeholder={"Enter Staff ID"}
                      type="text"
                      name="psstfuid"
                      onChange={formik.handleChange}
                      value={formik.values.psstfuid || ""}
                      isDisabled={mode === "EDIT"}
                    />
                    {formik.errors.psstfuid && (
                      <FormErrorMessage>{formik.errors.psstfuid}</FormErrorMessage>
                    )}
                  </FormControl>
                  : ""
                }
                {
                  mode != "ADD" ?
                    <FormControl
                      id="psstfsts"
                      w={"49%"}
                      isInvalid={
                        Boolean(formik.errors.psstfsts) &&
                        Boolean(formik.touched.psstfsts)
                      }
                      isReadOnly={mode == "VIEW" ? true : false}
                    >
                      <FormLabel>Active Status</FormLabel>
                      <Switch
                        id="psstfsts"
                        name="psstfsts"
                        isChecked={formik.values.psstfsts}
                        onChange={handleStatusChange}
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
                      {formik.errors.psstfsts && (
                        <FormErrorMessage>
                          {formik.errors.psstfsts}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    : ""
                }
              </Flex>
              <FormControl
                id="psstfnme"
                isInvalid={Boolean(formik.errors.psstfnme) && Boolean(formik.touched.psstfnme)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Name" />
                <Input
                  placeholder={"Enter Name"}
                  type="text"
                  name="psstfnme"
                  onChange={formik.handleChange}
                  value={formik.values.psstfnme || ""}
                />
                {formik.errors.psstfnme && (
                  <FormErrorMessage>{formik.errors.psstfnme}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psstfeml"
                isInvalid={Boolean(formik.errors.psstfeml) && Boolean(formik.touched.psstfeml)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Email" />
                <Input
                  placeholder={"Enter Email"}
                  type="text"
                  name="psstfeml"
                  onChange={formik.handleChange}
                  value={formik.values.psstfeml || ""}
                />
                {formik.errors.psstfeml && (
                  <FormErrorMessage>{formik.errors.psstfeml}</FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                <FormControl
                  id="psstftyp"
                  isInvalid={Boolean(formik.errors.psstftyp) && Boolean(formik.touched.psstftyp)}
                  isReadOnly={mode === "VIEW" || mode === "EDIT" ? true : false}
                >
                  {/* <FormLabel>Debit/Credit*</FormLabel> */}
                  <CustomFormLabel labelText="StaffsType" />
                  <Select
                    placeholder="Select Staff Type"
                    value={formik.values.psstftyp || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue("psstftyp", value);
                      reloadDDLData1(value);
                    }}
                    style={{
                      fontSize: 14,
                    }}
                    isDisabled={mode === "VIEW" || mode === "EDIT" ? true : false}
                  >
                    {ddlData?.STAFFTYP?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psstftyp && (
                    <FormErrorMessage>{formik.errors.psstftyp}</FormErrorMessage>
                  )}
                </FormControl>





                {mode === "ADD" ?

                  <FormControl
                    id="psusrunm"
                    isInvalid={
                      Boolean(formik.errors.psusrunm) &&
                      Boolean(formik.touched.psusrunm)
                    }
                    isReadOnly={mode === "VIEW" || mode === "EDIT" || formik.values.psstftyp != ""}
                  >{
                      formik.values.psstftyp == "" ? <FormLabel>User Account</FormLabel> : <CustomFormLabel labelText="User Account" />
                    }

                    <Select
                      placeholder="Please Select User Account"
                      value={formik.values.psstftyp != "" ? formik.values.psusrunm : ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isDisabled={mode === "VIEW" || mode === "EDIT" || formik.values.psstftyp == "" ? true : false}
                    >
                      {Array.isArray(ddlData1) &&
                        ddlData1
                          .map((option: any) => (
                            <option
                              key={option.psusrunm}
                              value={option.psusrunm}
                            >
                              {option.psusrunm + " - " + option.psusrnam}
                            </option>
                          ))}
                    </Select>
                    {formik.errors.psusrunm && (
                      <FormErrorMessage>
                        {formik.errors.psusrunm}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  :

                  <FormControl
                    id="psusrunm"
                    isInvalid={
                      Boolean(formik.errors.psusrunm) &&
                      Boolean(formik.touched.psusrunm)
                    }
                    isReadOnly={mode === "VIEW" || mode === "EDIT" || formik.values.psstftyp != ""}
                  > <FormLabel>User Account</FormLabel>
                    <Input
                      placeholder={"Enter Emergency Contact No."}
                      type="text"
                      name="psstfehp"
                      onChange={formik.handleChange}
                      value={`${detailData.psusrunm} - ${detailData.psusrnam} `}
                      isDisabled
                    />
                    {formik.errors.psusrunm && (
                      <FormErrorMessage>
                        {formik.errors.psusrunm}
                      </FormErrorMessage>
                    )}
                  </FormControl>}
              </Flex>

              <FormControl
                id="psmrcuid"
                isInvalid={
                  Boolean(formik.errors.psmrcuid) &&
                  Boolean(formik.touched.psmrcuid)
                }
              >
                <FormLabel>Merchants</FormLabel>
                <Select
                  placeholder="Please Select Merchants"
                  value={formik.values.psmrcuid}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" || formik.values.psstftyp == "A" ? true : false}
                >
                  {Array.isArray(ddlData2) &&
                    ddlData2
                      .map((option: any) => (
                        <option
                          key={option.psmrcuid}
                          value={option.psmrcnme}
                        >
                          {option.psmrcuid + " - " + option.psmrcnme}
                        </option>
                      ))}
                </Select>
                {formik.errors.psmrcuid && (
                  <FormErrorMessage>
                    {formik.errors.psmrcuid}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}>
                <FormControl
                  id="psstfjdt"
                  isInvalid={
                    Boolean(formik.errors.psstfjdt) &&
                    Boolean(formik.touched.psstfjdt)
                  }
                //    isReadOnly
                >
                  <FormLabel>Join Date</FormLabel>
                  <DatePicker disabled={mode === "VIEW"}
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik.values.psstfjdt
                        ? dayjs(formik.values.psstfjdt)
                        : dayjs(new Date())
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psstfjdt" },
                      })
                    }
                    onBlur={formik.handleBlur}
                  // disabled={true}
                  />
                  {formik.errors.psstfjdt && (
                    <FormErrorMessage>{formik.errors.psstfjdt}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psstfsdt"

                >
                  <FormLabel>Status Date</FormLabel>
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    value={dayjs()}

                    onBlur={formik.handleBlur}
                    readOnly={true} // read-only if in VIEW mode
                  />

                </FormControl>

              </Flex>


            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="psstfbnk"
                isInvalid={Boolean(formik.errors.psstfbnk) && Boolean(formik.touched.psstfbnk)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Bank" />
                <Select
                  placeholder="Select Bank"
                  value={formik.values.psstfbnk || ""}
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
                {formik.errors.psstfbnk && (
                  <FormErrorMessage>{formik.errors.psstfbnk}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psstfbnm"
                isInvalid={Boolean(formik.errors.psstfbnm) && Boolean(formik.touched.psstfbnm)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Bank User Name" />
                <Input
                  placeholder={"Enter Bank User Name"}
                  type="text"
                  name="psstfbnm"
                  onChange={formik.handleChange}
                  value={formik.values.psstfbnm || ""}
                />
                {formik.errors.psstfbnm && (
                  <FormErrorMessage>{formik.errors.psstfbnm}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psstfacc"
                isInvalid={Boolean(formik.errors.psstfacc) && Boolean(formik.touched.psstfacc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Bank Account" />
                <Input
                  placeholder={"Enter Bank Account"}
                  type="text"
                  name="psstfacc"
                  onChange={formik.handleChange}
                  value={formik.values.psstfacc || ""}
                />
                {formik.errors.psstfacc && (
                  <FormErrorMessage>{formik.errors.psstfacc}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psstfepr"
                isInvalid={Boolean(formik.errors.psstfepr) && Boolean(formik.touched.psstfepr)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Contact No. Prefix" />
                <Select
                  placeholder="Select Contact No. Prefix"
                  value={formik.values.psstfepr || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.HPPRE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psstfepr && (
                  <FormErrorMessage>{formik.errors.psstfepr}</FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}>
                <FormControl
                  id="psstfchp"
                  isInvalid={Boolean(formik.errors.psstfchp) && Boolean(formik.touched.psstfchp)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Description*</FormLabel> */}
                  <CustomFormLabel labelText="Current Contact No." />
                  <Input
                    placeholder={"Enter Current Contact No."}
                    type="text"
                    name="psstfchp"
                    onChange={formik.handleChange}
                    value={formik.values.psstfchp || ""}
                  />
                  {formik.errors.psstfchp && (
                    <FormErrorMessage>{formik.errors.psstfchp}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psstfehp"
                  isInvalid={Boolean(formik.errors.psstfehp) && Boolean(formik.touched.psstfehp)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Description*</FormLabel> */}
                  <CustomFormLabel labelText="Emergency Contact No." />
                  <Input
                    placeholder={"Enter Emergency Contact No."}
                    type="text"
                    name="psstfehp"
                    onChange={formik.handleChange}
                    value={formik.values.psstfehp || ""}
                  />
                  {formik.errors.psstfehp && (
                    <FormErrorMessage>{formik.errors.psstfehp}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <FormControl
                id="psstfnat"
                isInvalid={Boolean(formik.errors.psstfnat) && Boolean(formik.touched.psstfnat)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Nationality" />
                <Select
                  placeholder="Select Nationality"
                  value={formik.values.psstfnat || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.NATION?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psstfnat && (
                  <FormErrorMessage>{formik.errors.psstfnat}</FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}>


                <FormControl
                  id="psstfidt"
                  isInvalid={Boolean(formik.errors.psstfidt) && Boolean(formik.touched.psstfidt)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Debit/Credit*</FormLabel> */}
                  <CustomFormLabel labelText="ID Type" />
                  <Select
                    placeholder="Select ID Type"
                    value={formik.values.psstfidt || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  // isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.IDTYPE?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psstfidt && (
                    <FormErrorMessage>{formik.errors.psstfidt}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psstfidn"
                  isInvalid={Boolean(formik.errors.psstfidn) && Boolean(formik.touched.psstfidn)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Description*</FormLabel> */}
                  <CustomFormLabel labelText="ID Number" />
                  <Input
                    placeholder={"Enter ID Number"}
                    type="text"
                    name="psstfidn"
                    onChange={formik.handleChange}
                    value={formik.values.psstfidn || ""}
                  />
                  {formik.errors.psstfidn && (
                    <FormErrorMessage>{formik.errors.psstfidn}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>



            </Box>








          </div>
        </Box>
      </Card>

      <div className="flex flex-col sm:flex-row gap-6">
        <Box display="flex" flexDir="column" gap={6} width="100%">
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box>
              <SubHeader labelText="Current Address" />
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <FormControl
                    id="psstfad1"
                    isInvalid={Boolean(formik.errors.psstfad1) && Boolean(formik.touched.psstfad1)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Line Address 1" />
                    <Input
                      placeholder={"Enter Line Address 1"}
                      type="text"
                      name="psstfad1"
                      onChange={formik.handleChange}
                      value={formik.values.psstfad1 || ""}
                    />
                    {formik.errors.psstfad1 && (
                      <FormErrorMessage>{formik.errors.psstfad1}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psstfad2"
                    isInvalid={Boolean(formik.errors.psstfad2) && Boolean(formik.touched.psstfad2)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Line Address 2" />
                    <Input
                      placeholder={"Enter Line Address 2"}
                      type="text"
                      name="psstfad2"
                      onChange={formik.handleChange}
                      value={formik.values.psstfad2 || ""}
                    />
                    {formik.errors.psstfad2 && (
                      <FormErrorMessage>{formik.errors.psstfad2}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psstfpos"
                    isInvalid={Boolean(formik.errors.psstfpos) && Boolean(formik.touched.psstfpos)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="PostCode" />
                    <Input
                      placeholder={"Enter Postcode"}
                      type="text"
                      name="psstfpos"
                      onChange={formik.handleChange}
                      value={formik.values.psstfpos || ""}
                    />
                    {formik.errors.psstfpos && (
                      <FormErrorMessage>{formik.errors.psstfpos}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    id="psstfcit"
                    isInvalid={Boolean(formik.errors.psstfcit) && Boolean(formik.touched.psstfcit)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="City" />
                    <Input
                      placeholder={"Enter City"}
                      type="text"
                      name="psstfcit"
                      onChange={formik.handleChange}
                      value={formik.values.psstfcit || ""}
                    />
                    {formik.errors.psstfcit && (
                      <FormErrorMessage>{formik.errors.psstfcit}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    id="psstfsta"
                    isInvalid={Boolean(formik.errors.psstfsta) && Boolean(formik.touched.psstfsta)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="State" />
                    <Input
                      placeholder={"Enter State"}
                      type="text"
                      name="psstfsta"
                      onChange={formik.handleChange}
                      value={formik.values.psstfsta || ""}
                    />
                    {formik.errors.psstfsta && (
                      <FormErrorMessage>{formik.errors.psstfsta}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </div>
            </Box>
          </Card>
        </Box>
        <Box display="flex" flexDir="column" gap={6} width="100%">
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box>
              <Flex justifyContent="space-between" alignItems="center" gap={"35%"}  >
                <Box whiteSpace="nowrap">
                  <SubHeader labelText="Home Address" />
                </Box>
                <FormControl
                  id="psstfsam"

                  isInvalid={
                    Boolean(formik.errors.psstfsam) &&
                    Boolean(formik.touched.psstfsam)
                  }
                  isReadOnly={mode == "VIEW" ? true : false}
                >
                  <Flex alignItems="center" gap={2}>
                    <Box whiteSpace="nowrap">
                      <FormLabel >Same Address</FormLabel>
                    </Box>
                    <Switch
                      id="psstfsam"
                      name="psstfsam"
                      isChecked={formik.values.psstfsam}
                      onChange={handleSameChange}
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
                  </Flex>

                  {formik.errors.psstfsam && (
                    <FormErrorMessage>
                      {formik.errors.psstfsam}
                    </FormErrorMessage>
                  )}
                </FormControl>

              </Flex>


              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <FormControl
                    id="psstfha1"
                    isInvalid={Boolean(formik.errors.psstfha1) && Boolean(formik.touched.psstfha1)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Address Line 1" />
                    <Input
                      placeholder={"Enter Address Line 1"}
                      type="text"
                      name="psstfha1"
                      onChange={formik.handleChange}
                      value={formik.values.psstfsam ? formik.values.psstfad1 : formik.values.psstfha1}
                    />
                    {formik.errors.psstfha1 && (
                      <FormErrorMessage>{formik.errors.psstfha1}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    id="psstfha2"
                    isInvalid={Boolean(formik.errors.psstfha2) && Boolean(formik.touched.psstfha2)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Address Line 2" />
                    <Input
                      placeholder={"Enter Address Line 2"}
                      type="text"
                      name="psstfha2"
                      onChange={formik.handleChange}
                      value={formik.values.psstfsam ? formik.values.psstfad2 : formik.values.psstfha2}
                    />
                    {formik.errors.psstfha2 && (
                      <FormErrorMessage>{formik.errors.psstfha2}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psstfhpo"
                    isInvalid={Boolean(formik.errors.psstfhpo) && Boolean(formik.touched.psstfhpo)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="PostCode" />
                    <Input
                      placeholder={"Enter PostCode"}
                      type="text"
                      name="psstfhpo"
                      onChange={formik.handleChange}
                      value={formik.values.psstfsam ? formik.values.psstfpos : formik.values.psstfhpo}
                    />
                    {formik.errors.psstfhpo && (
                      <FormErrorMessage>{formik.errors.psstfhpo}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psstfhci"
                    isInvalid={Boolean(formik.errors.psstfhci) && Boolean(formik.touched.psstfhci)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="City" />
                    <Input
                      placeholder={"Enter City"}
                      type="text"
                      name="psstfhci"
                      onChange={formik.handleChange}
                      value={formik.values.psstfsam ? formik.values.psstfcit : formik.values.psstfhci}
                    />
                    {formik.errors.psstfhci && (
                      <FormErrorMessage>{formik.errors.psstfhci}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psstfhst"
                    isInvalid={Boolean(formik.errors.psstfhst) && Boolean(formik.touched.psstfhst)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="State" />
                    <Input
                      placeholder={"Enter State"}
                      type="text"
                      name="psstfhst"
                      onChange={formik.handleChange}
                      value={formik.values.psstfsam ? formik.values.psstfsta : formik.values.psstfhst}
                    />
                    {formik.errors.psstfhst && (
                      <FormErrorMessage>{formik.errors.psstfhst}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </div>
            </Box>
          </Card>
        </Box>
      </div>


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

