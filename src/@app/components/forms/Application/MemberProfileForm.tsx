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
  FormErrorMessage,
  Stack,
  Switch,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  RadioGroup,
  Radio,
  Textarea,
  color,
  Tabs,
  TabList,
  Tab,
  Image,
  Tooltip,
  Checkbox,
  CloseButton,

} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties } from "react";

import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  selectHome,
  closeGlobalModal,
  openGlobalModal,
  postBulkUploadFile,
} from "@app/redux/app/slice";
import type { DatePickerProps, UploadFile } from "antd";
import {
  AutoComplete,
  DatePicker,
  Form,
  Space,
  Tag,
  Upload,
  Typography,
  Select as AntdSelect,
} from "antd";
import dayjs from "dayjs";
// import {
//   numberWithCommas,
//   parseThousandsToNumber,
//   numberPattern,
// } from "@app/utils/StringUtils";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  FileOutlined,
  ExportOutlined,
} from "@ant-design/icons";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
// import { FormikConfig, FormikTouched } from 'formik';
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";

import {
  getApplicationDetail,
  getApproveApplication,
  getManageApplication,
} from "@app/redux/application/slice";

import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// import { RewardsPromoSchema } from "../@schemas/rewardsPromoSchema";
import { CalendarIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import PeopleImage from "@app/assets/img/people-image.png";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { manageApplication } from "@app/redux/application/api";
import { formatDate } from "@app/utils/DateUtils";
import SubHeader from "@app/components/common/Header/SubHeader";
import useFetchMembers from "@app/hooks/selector/useFetchMembers";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
// import useFetchDDLTier from "@app/hooks/selector/useFetchDDLTier";
// import useFetchDDLUser from "@app/hooks/selector/useFetchDDLUser";
// import useFetchDDLMembers from "@app/hooks/selector/useFetchDDLMembers";
// import useFetchDDLMembershipCodes from "@app/hooks/selector/useFetchDDLMembershipCodes";
const { Dragger } = Upload;
const dummyReq = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};
const MemberProfileForm = (props: any) => {
  const { sendRequest, loading } = useApi({ title: "Member Profile" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  let mode = props.mode;
  const { Option } = AutoComplete;
  const homeData = useAppSelector(selectHome);

  const filterOption = (inputValue: string, option: any) => {
    return option.value.includes(inputValue.trim());
  };
  useEffect(() => {
    props.setLoading(loading);
  }, [loading]);
  // const handleSearch = (value: string) => {
  //   const filteredOptions = Array.isArray(membershipCodesData)?membershipCodesData.filter((item:MembershipCode) =>
  //     String(item.psuidnum).includes(value.toLowerCase())
  //   ):[]
  //   setMembershipCodes(filteredOptions);
  // };


  const [membershipCodes, setMembershipCodes] = useState<any[]>([])

  // const [membershipCodesData] = useFetchDDLMembershipCodes();
  // const [tiers] = useFetchDDLTier();
  // const [users] = useFetchDDLMembers();

  const [memberSource, setMemberSource] = useState<any[]>([]);
  // const membershipCodesData: MembershipCode[] = [
  //   { psuidnum: 'ABC123', psuidrsv: true },
  //   { psuidnum: 'XYZ456', psuidrsv: false },
  //   { psuidnum: 'LMN789', psuidrsv: true },
  // ];

  // useEffect(() => {
  //   if(Array.isArray(membershipCodesData))
  //   setMembershipCodes(membershipCodesData)

  // }, [membershipCodesData])

  const [detailData, onInit, loading2, reset] = useFetchApplicationDetail(
    id,
  );

  const [agents] = useFetchDDLAgent();


  useEffect(() => {
    dispatch(getApplicationDetail({ id }))
  }, [id])

  useEffect(() => {
    reset()
  }, [])
  const initialValues = {
    "submitAction": "",
    "psaplnme": "",
    "psaplidn": "",
    "psaplidt": "NRIC",
    "psapldat": "",
    "psapltyp": "I",
    "psaplsts": "",
    "psaplstd": "",
    "psaplapv": "",
    "psaplrmk": "",
    "psaplnnm": "",
    "psaplrcb": homeData?.psmbruid,
    "psaplrcbdsc": detailData?.psaplrcbdsc,
    "psapldob": "",
    "psaplacd": "",
    "psaplcop": "",
    "psaplicn": "",
    "psapleml": "",
    "psaplphn": "",

    "psmbruid": "",
    "pscifuid": "",
    "psadrad1": "",
    "psadrad2": "",
    "psadrad3": "",
    "psadrad4": "",
    "psadradp": "",
    "psadradc": "",
    "psadrads": "",
    "psadrad1h": "",
    "psadrad2h": "",
    "psadrad3h": "",
    "psadrad4h": "",
    "psadradph": "",
    "psadradch": "",
    "psadradsh": "",

    "psbnkref": "",
    "psbnknme": "",
    "psbnkacn": "",
    "psbnkhol": "",
    "psbnkrgn": "",
    "psbnkdft": "",

    "isSameAsRegAdr": false,
  }
  function convertRecruit() {
    if (!Array.isArray(agents)) {
      return "-"; 
    }
  
    const selectedAgent = agents.find(
      (option: any) => option.psmbruid === formik.values.psaplrcb
    );
  
    return selectedAgent
      ? `${formik.values.psaplrcbdsc} - ${selectedAgent.psmbrnme}`
      : "-";
  }
  
  function convertDateToString(date: Date) {
    if (date instanceof Date && !isNaN(date.getTime()))
      return (
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
      );
    else return "";
  }
  function convertStringToDate(date: String) {
    if (date)
      return new Date(
        parseInt(date.split("-")[2]),
        parseInt(date.split("-")[1]) - 1,
        parseInt(date.split("-")[0])
      );
    else return null;
  } interface MembershipCode {
    psuidnum: string;
    psuidrsv: boolean;
  }

  async function handleDownload(filename: string, type: number) {
    // await sendRequest({
    //   fn: download({
    //     filename,
    //     type,
    //   }),
    // });
  }
  const [emailFile, setEmailFile] = useState<any[]>([]);
  const [selectedEmailFile, setSelectedEmailFile] = useState<UploadFile<any>[]>(
    []
  );
  const [emailFile2, setEmailFile2] = useState<any[]>([]);
  const [selectedEmailFile2, setSelectedEmailFile2] = useState<
    UploadFile<any>[]
  >([]);
  const handleFileUpload = ({ file }: { file: any }) => {
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
      formik.setFieldValue("psaplpic", file?.name);
      //Multiple Upload
      setSelectedEmailFile((previousFile: any) => [
        // ...previousFile,
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

      //Multiple Upload
      setEmailFile((previousFile: any) => [
        // ...previousFile,
        file.originFileObj,
      ]); //For multiple file
    }
    return false;
  };
  const handleFileUpload2 = ({ file }: { file: any }) => {
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
      formik.setFieldValue("psspopic", file?.name);
      //Multiple Upload
      setSelectedEmailFile2((previousFile: any) => [
        // ...previousFile,
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

      //Multiple Upload
      setEmailFile2((previousFile: any) => [
        // ...previousFile,
        file.originFileObj,
      ]); //For multiple file
    }
    return false;
  };
  const genThumbUrl = (file: any) => {
    return URL.createObjectURL(file);
  };
  const [ddlData] = useFetchDDL({
    code: [

      "CUSTTYPE",

      "IDTYPE",
      "ACADEMIC",
      "BANK",
      "STATE",
    ],
  });

  const handleRemove = (file: any) => {
    // Remove the file from the fileList state
    setSelectedEmailFile([]);
    formik.setFieldValue("psaplpic", null);

    //For multiple upload
    setEmailFile([]);
  };
  const handleRemove2 = (file: any) => {
    // Remove the file from the fileList state
    setSelectedEmailFile2([]);
    formik.setFieldValue("psspopic", null);

    //For multiple upload
    setEmailFile2([]);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    //   validationSchema: FeeCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  function genDocumentUrl(filename: string, type?: string) {
    const hostname = process.env.NEXT_PUBLIC_API_URL;
    // const nowTs = new Date().getTime();

    return (
      hostname + `/document/detail?type=${type || ""}&document=${filename}`
    );
  }
  useEffect(() => {
    props.setFormik(formik);

    // if(mode==="EDIT") setSubmit(formik.handleSubmit)
  }, []);
  useEffect(() => {
    props.setFormik(formik);

    // if(mode==="EDIT") setSubmit(formik.handleSubmit)
  }, [formik.values]);

  useEffect(() => {
    if (mode !== "ADD" && id) {
      props.setDetailData(detailData);
      if (detailData && Object.keys(detailData).length === 0) {
        formik.resetForm();
      }
      if (
        typeof detailData === "object" &&
        !Array.isArray(detailData) &&
        detailData !== null &&
        detailData && Object.keys(detailData).length > 0
      ) {
        props.setHeaderInfo({
          number: detailData?.psaplref,
          date: formatDate(detailData?.psapldat, "DD-MM-YYYY"),
          status: detailData?.psaplstsdsc,

        });
        formik.setValues({
          ...detailData,
          psapldob: convertStringToDate(detailData?.psapldob),
        });

      }
    }
  }, [detailData]);

  // useEffect(() => {
  //   if (Array.isArray(users)) {
  //     setMemberSource(users);
  //   }
  // }, [users]);

  async function onSubmit(data: any) {

    data.psadrtyp = "REG";
    data.psadrtyph = "HOME";
    if (
      data.submitAction === "save"
    ) {
      const { result, message: resData } = await sendRequest({
        fn: getManageApplication({
          ...data,
          psapldob: data.psapldob && convertDateToString(new Date(data.psapldob)),
          id: mode === "EDIT" ? id : null,
          // tab: "0",
        }),
        formik,
      });
      if (result == "success") {
        setTimeout(() => {
          showModal(dispatch, {
            title: mode !== "ADD" ? "Update Record" : "Add Record",
            message: mode !== "ADD" ? "Record Updated" : "Record Added",
          });
          // if(mode === "ADD")  router.back();
          // else reset()
          if (mode === "ADD") {
            router.push({
              pathname: homeData?.psusrtyp === "ADM" ? `/application/Detail` : "/applicationAgent/Detail",
              query: {
                id: resData?.application_number,
                mode: "EDIT",
                status: resData?.application_status,
              },
            });
            props.setHeaderInfo({
              number: resData?.application_number,
              date: resData?.application_date,
              status: resData?.application_status,
            });
          } else {
            // router.push("/application");
            props.setHeaderInfo({
              number: resData?.application_number,
              date: resData?.application_date,
              status: resData?.application_status,
            });
          }
          onInit()
        }, 200);
      }
    } else if (data.submitAction === "submit") {
      const { result, message: resData } = await sendRequest({
        fn: getManageApplication({
          ...data,
          psapldob: data.psapldob && convertDateToString(new Date(data.psapldob)),
          id: mode === "EDIT" ? id : null,
        }),
        formik,
      });
      if (result == "success") {
        const { result: result2, message } = await sendRequest({
          fn: getApproveApplication({

            id: mode === "EDIT" ? id : resData.application_number,
            psaplsts: "PEN",
          }),
          formik,
        });
        if (result2 == "success") {
          setTimeout(() => {
            showModal(dispatch, {
              title: "Submit Application",
              message: (
                <>
                  Application with Ref No <b>{resData?.application_number}</b>
                  <br />
                  has been submitted for review.
                </>
              ),
            });
            // if(mode === "ADD")  router.back();
            // else reset()
            // router.push({
            //   pathname: "/application/Detail",
            //   query: {
            //     id: resData?.application_number,
            //     mode: "EDIT",
            //     status: resData?.application_status,
            //   },
            // });
            props.setHeaderInfo({
              number: resData?.application_number,
              date: resData?.application_date,
              status: resData?.application_status,
            });
            onInit()
            router.push(homeData?.psusrtyp === "ADM" ? `/application` : "/applicationAgent",
              '/application')
          }, 200);
        }

      }
    }
  }
  // useEffect(() => {
  //   console.log(formik.errors)
  // }, [formik.errors])

  // const tiers = [
  //     { label: "Silver", value: "S" },
  //     { label: "Gold", value: "G" },
  //     { label: "Platinum", value: "P" },
  // ]
  return (
    <Box>
      <div className="flex flex-col gap-6">
        <Box display="flex" flexDir="row" gap={6} width="100%">
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Flex direction={"column"} flex={1.5} >
              <SubHeader labelText="General Information" />
              <Flex direction={"column"} gap={Spacing.containerPx}>

                <Flex direction={"row"} gap={Spacing.containerPx}>

                  <FormControl
                    id="applicantName"
                    isInvalid={
                      Boolean(formik.errors.psaplnme) &&
                      Boolean(formik.touched.psaplnme)
                    }
                  >
                    <CustomFormLabel labelText="Full Name" />
                    <Input
                      placeholder={"Enter Full Name"}
                      type="text"
                      name="psaplnme"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psaplnme || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psaplnme && (
                      <FormErrorMessage>{formik.errors.psaplnme}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psapltyp"
                    isInvalid={
                      Boolean(formik.errors.psapltyp) &&
                      Boolean(formik.touched.psapltyp)
                    }
                  >
                    <CustomFormLabel labelText="Agent Class" />
                    <Select
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                      placeholder="Select Agent Class"
                      name="psapltyp"
                      value={formik.values.psapltyp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {ddlData?.CUSTTYPE?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psapltyp && (
                      <FormErrorMessage>{formik.errors.psapltyp}</FormErrorMessage>
                    )}
                  </FormControl>

                </Flex>

                <Flex direction={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="applicantNickname"
                    isInvalid={
                      Boolean(formik.errors.psaplnnm) &&
                      Boolean(formik.touched.psaplnnm)
                    }
                  >
                    <FormLabel>Nick Name</FormLabel>
                    <Input
                      placeholder={"Enter Applicant Nickname"}
                      type="text"
                      name="psaplnnm"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psaplnnm || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psaplnnm && (
                      <FormErrorMessage>{formik.errors.psaplnnm}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="dateOfBirth"
                    isInvalid={
                      Boolean(formik.errors.psapldob) &&
                      Boolean(formik.touched.psapldob)
                    }

                  >
                    <CustomFormLabel labelText="DOB / Incorporation" />
                    <DatePicker
                      status={formik.errors.psapldob ? 'error' : ''}

                      disabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                      format={"DD/MM/YYYY"}
                      style={{ width: "100%" }}
                      value={formik.values.psapldob ? dayjs(formik.values.psapldob) : null}
                      onChange={(value) => formik.setFieldValue("psapldob", value)}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.psapldob && (
                      <FormErrorMessage>{formik.errors.psapldob}</FormErrorMessage>
                    )}
                  </FormControl>

                </Flex>

                <Flex direction={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="applicantIdType"
                    isInvalid={
                      Boolean(formik.errors.psaplidt) &&
                      Boolean(formik.touched.psaplidt)
                    }
                  >
                    <CustomFormLabel labelText="ID Type" />
                    <Select
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                      placeholder="Select ID Type"
                      name="psaplidt"
                      value={formik.values.psaplidt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {ddlData?.IDTYPE?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psaplidt && (
                      <FormErrorMessage>{formik.errors.psaplidt}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="highestAcademicQualification"
                    isInvalid={
                      Boolean(formik.errors.psaplacd) &&
                      Boolean(formik.touched.psaplacd)
                    }
                  >
                    <CustomFormLabel labelText="Academic Qualification" />
                    <Select
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                      placeholder="Select Qualification"
                      name="psaplacd"
                      value={formik.values.psaplacd}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {ddlData?.ACADEMIC?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psaplacd && (
                      <FormErrorMessage>{formik.errors.psaplacd}</FormErrorMessage>
                    )}
                  </FormControl>


                </Flex>
                <Flex direction={"row"} gap={Spacing.containerPx}>

                  <FormControl
                    id="ID Number"
                    isInvalid={
                      Boolean(formik.errors.psaplidn) &&
                      Boolean(formik.touched.psaplidn)
                    }
                  >
                    <CustomFormLabel labelText="ID Number" />
                    <Input
                      placeholder={"Enter ID Number"}
                      type="text"
                      name="psaplidn"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psaplidn || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psaplidn && (
                      <FormErrorMessage>{formik.errors.psaplidn}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="currentOccupation"
                    isInvalid={
                      Boolean(formik.errors.psaplcop) &&
                      Boolean(formik.touched.psaplcop)
                    }
                  >
                    <CustomFormLabel labelText="Current Occupation" />
                    <Input
                      placeholder={"Enter Current Occupation"}
                      type="text"
                      name="psaplcop"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psaplcop || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psaplcop && (
                      <FormErrorMessage>{formik.errors.psaplcop}</FormErrorMessage>
                    )}
                  </FormControl>

                </Flex>


                <Flex direction={"row"} gap={Spacing.containerPx}>

                  <FormControl
                    id="psaplrcb"
                    // isInvalid={
                    //   Boolean(formik.errors.psaplrbd) &&
                    //   Boolean(formik.touched.psaplrbd)
                    // }
                    isReadOnly
                  >
                    <FormLabel >Recruited By</FormLabel>
                    <Input
                      placeholder={"Enter Recruited By"}
                      type="text"
                      name="psaplrcb"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={convertRecruit()}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {/* {formik.errors.psaplrbd && (
                    <FormErrorMessage>{formik.errors.psaplrbd}</FormErrorMessage>
                  )} */}
                  </FormControl>
                  <FormControl
                    id="incomeTaxNumber"
                    isInvalid={
                      Boolean(formik.errors.psaplicn) &&
                      Boolean(formik.touched.psaplicn)
                    }
                  >
                    <CustomFormLabel labelText="Income Tax Number" />
                    <Input
                      placeholder={"Enter Income Tax Number"}
                      type="text"
                      name="psaplicn"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psaplicn || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psaplicn && (
                      <FormErrorMessage>{formik.errors.psaplicn}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>


              </Flex>


            </Flex>
          </Card>
        </Box>

        <Box display="flex" flexDir="row" gap={6} width="100%">
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Flex direction={"column"} flex={1.5}>

              <SubHeader labelText="Address & Contact Information" />
              <Flex direction={"column"} gap={Spacing.containerPx}>

                <Flex flexDir="row" gap={Spacing.containerPx}>
                  <Flex flex={1} flexDir="column" gap={Spacing.containerPx}>

                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadrad1"
                        isInvalid={
                          Boolean(formik.errors.psadrad1) &&
                          Boolean(formik.touched.psadrad1)
                        }
                      //    isReadOnly
                      >
                        <CustomFormLabel labelText="Registered Address" />
                        <Input
                          placeholder={"Enter Address Line 1"}
                          type="text"
                          name="psadrad1"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadrad1 || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                        />
                        {formik.errors.psadrad1 && (
                          <FormErrorMessage>
                            {formik.errors.psadrad1}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadrad2"
                        isInvalid={
                          Boolean(formik.errors.psadrad2) &&
                          Boolean(formik.touched.psadrad2)
                        }
                      //    isReadOnly
                      >
                        {/* <CustomFormLabel labelText=""/>Registered Address */}
                        <Input
                          placeholder={"Enter Address Line 2"}
                          type="text"
                          name="psadrad2"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadrad2 || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                        />
                        {formik.errors.psadrad2 && (
                          <FormErrorMessage>
                            {formik.errors.psadrad2}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadradp"
                        isInvalid={
                          Boolean(formik.errors.psadradp) &&
                          Boolean(formik.touched.psadradp)
                        }
                      //    isReadOnly
                      >
                        <CustomFormLabel labelText="Postcode" />
                        <Input
                          placeholder={"Enter Postcode"}
                          type="text"
                          name="psadradp"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadradp || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                        />
                        {formik.errors.psadradp && (
                          <FormErrorMessage>
                            {formik.errors.psadradp}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psadradc"
                        isInvalid={
                          Boolean(formik.errors.psadradc) &&
                          Boolean(formik.touched.psadradc)
                        }
                      //    isReadOnly
                      >
                        <CustomFormLabel labelText="City" />
                        <Input
                          placeholder={"Enter City"}
                          type="text"
                          name="psadradc"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadradc || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                        />
                        {formik.errors.psadradc && (
                          <FormErrorMessage>
                            {formik.errors.psadradc}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadrads"
                        isInvalid={
                          Boolean(formik.errors.psadrads) &&
                          Boolean(formik.touched.psadrads)
                        }
                      //    isReadOnly
                      >
                        <CustomFormLabel labelText="State" />
                        <Select isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                          placeholder="Select State"
                          value={formik.values.psadrads}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {ddlData?.STATE?.map((option: DDL_TYPES) => (
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psadrads && (
                          <FormErrorMessage>
                            {formik.errors.psadrads}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                    </Flex>
                    <FormControl
                      id="psaplphn"
                      isInvalid={
                        Boolean(formik.errors.psaplphn) &&
                        Boolean(formik.touched.psaplphn)
                      }
                    //    isReadOnly
                    >
                      <CustomFormLabel labelText="Handphone No" />
                      <Input
                        placeholder={"Enter Handphone No"}
                        type="text"
                        name="psaplphn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psaplphn || ""}
                        isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                      />
                      {formik.errors.psaplphn && (
                        <FormErrorMessage>
                          {formik.errors.psaplphn}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Flex>

                  <Flex flex={1} flexDir="column" gap={Spacing.containerPx}>
                    {/* <Text fontSize="19pt" fontWeight={"500"}>Address Information</Text> */}

                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadrad1"
                        isInvalid={
                          Boolean(formik.errors.psadrad1h) &&
                          Boolean(formik.touched.psadrad1h)
                        }
                      //    isReadOnly
                      >
                        <Flex dir="row" justifyContent="space-between">
                          <FormLabel>Home Address</FormLabel>
                          <Checkbox
                            isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}

                            onChange={(e: any) => {
                              formik.setFieldValue(
                                "isSameAsRegAdr",
                                e.target.checked
                              );
                              if (e.target.checked) {
                                formik.setFieldValue(
                                  "psadrad1h",
                                  formik.values.psadrad1
                                );
                                formik.setFieldValue(
                                  "psadrad2h",
                                  formik.values.psadrad2
                                );
                                formik.setFieldValue(
                                  "psadradph",
                                  formik.values.psadradp
                                );
                                formik.setFieldValue(
                                  "psadradch",
                                  formik.values.psadradc
                                );
                                formik.setFieldValue(
                                  "psadradsh",
                                  formik.values.psadrads
                                );
                              }
                            }}
                          >
                            <Text fontSize={"sm"}>
                              Same as Registered Address</Text>
                          </Checkbox>
                        </Flex>
                        <Input
                          placeholder={"Enter Address Line 1"}
                          type="text"
                          name="psadrad1h"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadrad1h || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable) || formik.values.isSameAsRegAdr}
                        />
                        {formik.errors.psadrad1h && (
                          <FormErrorMessage>
                            {formik.errors.psadrad1h}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadrad2h"
                        isInvalid={
                          Boolean(formik.errors.psadrad2h) &&
                          Boolean(formik.touched.psadrad2h)
                        }
                      //    isReadOnly
                      >
                        {/* <CustomFormLabel labelText=""/>Registered Address */}
                        <Input
                          placeholder={"Enter Address Line 2"}
                          type="text"
                          name="psadrad2h"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadrad2h || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable) || formik.values.isSameAsRegAdr}
                        />
                        {formik.errors.psadrad2h && (
                          <FormErrorMessage>
                            {formik.errors.psadrad2h}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadradph"
                        isInvalid={
                          Boolean(formik.errors.psadradph) &&
                          Boolean(formik.touched.psadradph)
                        }
                      //    isReadOnly
                      >
                        <FormLabel>Postcode</FormLabel>
                        <Input
                          placeholder={"Enter Postcode"}
                          type="text"
                          name="psadradph"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadradph || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable) || formik.values.isSameAsRegAdr}
                        />
                        {formik.errors.psadradph && (
                          <FormErrorMessage>
                            {formik.errors.psadradph}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psadradch"
                        isInvalid={
                          Boolean(formik.errors.psadradch) &&
                          Boolean(formik.touched.psadradch)
                        }
                      //    isReadOnly
                      >
                        <FormLabel>City</FormLabel>
                        <Input
                          placeholder={"Enter City"}
                          type="text"
                          name="psadradch"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psadradch || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable) || formik.values.isSameAsRegAdr}
                        />
                        {formik.errors.psadradch && (
                          <FormErrorMessage>
                            {formik.errors.psadradch}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psadradsh"
                        isInvalid={
                          Boolean(formik.errors.psadradsh) &&
                          Boolean(formik.touched.psadradsh)
                        }
                      //    isReadOnly
                      >
                        <FormLabel>State</FormLabel>
                        <Select
                          placeholder="Select State"
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable) || formik.values.isSameAsRegAdr}
                          value={formik.values.psadradsh}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {ddlData?.STATE?.map((option: DDL_TYPES) => (
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psadradsh && (
                          <FormErrorMessage>
                            {formik.errors.psadradsh}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex direction={"row"} gap={Spacing.containerPx}>
                      <FormControl
                        id="psapleml"
                        isInvalid={
                          Boolean(formik.errors.psapleml) &&
                          Boolean(formik.touched.psapleml)
                        }
                      //    isReadOnly
                      >
                        <CustomFormLabel labelText="Email Address" />
                        <Input
                          placeholder={"Enter Email Address"}
                          type="text"
                          name="psapleml"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psapleml || ""}
                          isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                        />
                        {formik.errors.psapleml && (
                          <FormErrorMessage>
                            {formik.errors.psapleml}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Card>

        </Box>
        <Box display="flex" flexDir="row" gap={6} width="100%">
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Flex direction={"column"} flex={1.5}>
              <SubHeader labelText="Bank Information" />
              <Flex direction={"column"} gap={Spacing.containerPx}>

                <Flex direction={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="psbnknme"
                    isInvalid={
                      Boolean(formik.errors.psbnknme) &&
                      Boolean(formik.touched.psbnknme)
                    }
                  >
                    <CustomFormLabel labelText="Bank Name" />
                    <Select
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                      placeholder="Select Bank"
                      value={formik.values.psbnknme}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {ddlData?.BANK?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psbnknme && (
                      <FormErrorMessage>{formik.errors.psbnknme}</FormErrorMessage>
                    )}
                  </FormControl>
                  <div style={{ width: '100%' }}></div>
                </Flex>

                <Flex direction={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="psbnkacn"
                    isInvalid={
                      Boolean(formik.errors.psbnkacn) &&
                      Boolean(formik.touched.psbnkacn)
                    }
                  >
                    <CustomFormLabel labelText="Bank Account No." />
                    <Input
                      placeholder={"Enter Bank Account No."}
                      type="text"
                      name="psbnkacn"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psbnkacn || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psbnkacn && (
                      <FormErrorMessage>{formik.errors.psbnkacn}</FormErrorMessage>
                    )}
                  </FormControl>
                  <div style={{ width: '100%' }}></div>
                </Flex>

                <Flex direction={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="psbnkhol"
                    isInvalid={
                      Boolean(formik.errors.psbnkhol) &&
                      Boolean(formik.touched.psbnkhol)
                    }
                  >
                    <CustomFormLabel labelText="Bank Account Name" />
                    <Input
                      placeholder={"Enter Bank Account Name"}
                      type="text"
                      name="psbnkhol"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psbnkhol || ""}
                      isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                    />
                    {formik.errors.psbnkhol && (
                      <FormErrorMessage>{formik.errors.psbnkhol}</FormErrorMessage>
                    )}
                  </FormControl>
                  <div style={{ width: '100%' }}></div>
                </Flex>
              </Flex>
              {/* <Flex direction={"row"} maxH={"100%"} gap={Spacing.containerPx}>
                <FormControl
                  id="psbnkrgn"
                  isInvalid={
                    Boolean(formik.errors.psbnkrgn) &&
                    Boolean(formik.touched.psbnkrgn)
                  }
                >
                  <CustomFormLabel labelText="Bank Account NRIC / Reg No" />
                  <Input
                    placeholder={"Enter NRIC / Reg No"}
                    type="text"
                    name="psbnkrgn"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psbnkrgn || ""}
                    isDisabled={mode === "VIEW" || (detailData && Object.keys(detailData).length > 0 && !detailData?.editable)}
                  />
                  {formik.errors.psbnkrgn && (
                    <FormErrorMessage>{formik.errors.psbnkrgn}</FormErrorMessage>
                  )}
                </FormControl>
                <div style={{ width: '100%' }}></div>
              </Flex> */}
            </Flex>
          </Card>
        </Box>

      </div>

      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onClick={router.back} />

            {mode && mode !== "VIEW" && (
              <Buttons onClick={() => formik.setFieldValue("submitAction", "save")}
                buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
            {mode && mode === "EDIT" && detailData?.editable && detailData?.psaplsts === "NEW" && (
              <Buttons onClick={() => { formik.setFieldValue("submitAction", "submit"); props?.submissionAlert() }}
                buttonDefaultType={"CUSTOM"} buttonLoading={loading} buttonText="Submit" />
            )}



          </Space>
        </Box>
      </Flex>
    </Box>
  );
};

export default MemberProfileForm;
