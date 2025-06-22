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
  Tooltip,
  Textarea,
  InputGroup,
  Stack,
  Checkbox,
  Switch,
  Image,
  Tabs,
  TabList,
  IconButton

} from "@chakra-ui/react";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Table from "@app/components/common/Table/Table";
import SubHeader from "@app/components/common/Header/SubHeader";

import {
  DownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined
} from '@ant-design/icons';
import { postBulkUploadFile, postUploadFile } from "@app/redux/app/slice";
const { Dragger } = Upload;
import { download } from "@app/redux/app/slice";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";

// assets
import React, { useEffect, useState, ReactNode } from "react";
import { message, Upload, Typography, UploadFile } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik, FieldArray, Field, FormikProvider } from "formik";
import { getmanageProduct } from "@app/redux/product/slice";
import { fetchProductsR } from "@app/redux/inventory/slice";
import useFetchProductDetail from "@app/hooks/selector/useFetchProductDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageTranCode } from "@app/redux/tranCode/api";
import { ProductSchema } from "@app/components/forms/@schemas/productSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLMerchants from "@app/hooks/selector/useFetchDDLMerchants";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import useFetchProductsR from "@app/hooks/selector/useFetchProductsR";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";

export default function ProductForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Product" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const mchId = props.mchId
  const [detailData] = useFetchProductDetail(id);

  const initialValues = {
    psprduid: "",
    psprdnme: "",
    psprddsc: "",
    psprdimg: "",
    psprdlds: "",
    psmrcuid: "",
    psprdtyp: "",
    psprdcat: "",
    psprdfvg: false,
    psprdhal: false,
    psprdsts: "A",
    psprdsdt: null,
    psprdcid: false,
    psprdlsr: 10,
    psprdstk: 0,
    psprdpri: 0,
    psprdcrd: null,
    psprdrmk: "",
    psprdrtg: 0,
    psprdtak: false,
    psprdtpr: 0,
  };


  const [ddlData] = useFetchDDL({ code: ["YESORNO", "PRODSTS", "PRODCAT", "PRODTYP"] });

  const [ddlData2] = useFetchDDLMerchants();
  const [tabIndex, setTabIndex] = useState(0)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ProductSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });


  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psprduid,
        psprdfvg: detailData?.psprdfvg == "Y" ? true : false,
        psprdhal: detailData?.psprdhal == "Y" ? true : false,
        psprdcid: detailData?.psprdcid == "Y" ? true : false,
        psprdtak: detailData?.psprdtak == "Y" ? true : false,
      });

      if (detailData?.psprdimg) {
        setSelectedImg([
          {
            uid: detailData.psprdimg,
            name: detailData.psprdimg,
            status: "done",
            fileStatus: "old",
            url: genDocumentUrl(detailData.psprdimg, "5"),
            thumbUrl: genDocumentUrl(detailData.psprdimg, "5"),
          },
        ]);
      } else {
        setSelectedImg([]);
      }
    }



  }, [detailData]);


  const handleCidChange = () => {
    formik.setFieldValue("psprdcid", !formik.values.psprdcid);
  };
  const handleTaChange = () => {
    formik.setFieldValue("psprdtak", !formik.values.psprdtak);
  };
  const handleFvgChange = () => {
    formik.setFieldValue("psprdfvg", !formik.values.psprdfvg);
  };
  const handleHalChange = () => {
    formik.setFieldValue("psprdhal", !formik.values.psprdhal);
  };

  useEffect(() => {
    if (!formik.values.psprdcid) {
      formik.values.psprdsts = "A";
    } else {
      if (formik.values.psprdstk == 0) {
        formik.values.psprdsts = "S";
      }
      else if (formik.values.psprdstk <= formik.values.psprdlsr) {
        formik.values.psprdsts = "L";
      } else if (formik.values.psprdstk > formik.values.psprdlsr) {
        formik.values.psprdsts = "A";
      }
    }

  }, [formik.values.psprdlsr, formik.values.psprdcid])

  //Product Image
  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };
  const handleRemoveImg = (file: any) => {
    // Remove the file from the fileList state
    setSelectedImg([]);
    formik.setFieldValue("psprdimg", null)

    //For multiple upload
    setImg([]);
  };
  function genDocumentUrl(filename: string, type?: string) {
    const hostname = process.env.NEXT_PUBLIC_API_URL;
    // const nowTs = new Date().getTime();

    return hostname + `/document/detail?type=${type || ""}&document=${filename}`
  }
  const [img, setImg] = useState<any[]>([]);
  const [selectedImg, setSelectedImg] = useState<
    UploadFile<any>[]
  >([]);
  const handleFileUploadImg = ({ file }: { file: any }) => {
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
      formik.setFieldValue("psprdimg", file?.name)
      //Multiple Upload
      setSelectedImg((previousFile: any) => [
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
      setImg((previousFile: any) => [
        // ...previousFile,
        file.originFileObj]); //For multiple file
    }
    return false;
  };
  const genThumbUrl = (file: any) => {
    return URL.createObjectURL(file);
  };


  async function handleDownload(filename: string, type: number) {
    await sendRequest({
      fn: download({
        filename,
        type,
      }),

    });
  }


  async function onSubmit(data: any) {
    let uploadedImg: string[] = [];

    if (img.length > 0) {
      const formData = new FormData();


      //For Multiple upload purpose
      img.forEach((fileItem, index) => {
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
              uploadedImg.push(fileItem.sysfnm);
            }
          );
        }

        //Add Existing Uploaded File
        (selectedImg).forEach(
          (fileItem: any) => {
            if (fileItem?.fileStatus === "old") uploadedImg.push(fileItem.uid)
          }
        );

        // only 1
        //  console.log("HAHA",uploadedEmailFile)
        data.psprdimg = uploadedImg[0];
      } else {
        return;
      }
    }

    const { success } = await sendRequest({
      fn: getmanageProduct({
        id: mode === "EDIT" ? data.id : "",
        ...data,
        psprdlsr: formik.values.psprdcid ? formik.values.psprdlsr : 0,
        psprdtpr: formik.values.psprdtak ? formik.values.psprdtpr : 0,
        psprdtak: formik.values.psprdtak ? "Y" : "N",
        psprdcid: formik.values.psprdcid ? "Y" : "N",
        psprdfvg: formik.values.psprdfvg ? "Y" : "N",
        psprdhal: formik.values.psprdhal ? "Y" : "N",
        psprdsdt: new Date(),
        psprdcrd: mode == "ADD" ? new Date() : formik.values.psprdcrd,
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

  //------------------------------------------------------------------------
  //Product Restock history - Stock In
  //------------------------------------------------------------------------
  const [fetchParams, setFetchParams] = useState({ prodId: '', psinvsty: '' });
  useEffect(() => {
    if (detailData?.psprduid) {
      if (tabIndex === 1) {
        setFetchParams({ prodId: detailData?.psprduid, psinvsty: "I" });
      } else if (tabIndex === 2) {
        setFetchParams({ prodId: detailData?.psprduid, psinvsty: "O" });
      }
    }
  }, [tabIndex, detailData]);

  const homeData = useAppSelector(selectHome);
  const [dateError, setDateError] = useState(false);

  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);


  // const router = useRouter();
  let [tableData, refreshFn, totalRecords, extra] = useFetchProductsR(fetchParams);


  const [search, setSearch] = useState();
  const [to, setTo] = useState();


  const columns: any[] = [
    {
      title: "Invoice Date",
      dataIndex: "psinvsdt",
      key: "psinvsdt",
    },
    {
      title: "Invoice No.",
      dataIndex: "pssktuid",
      key: "pssktuid",
    },
    {
      title: "Vendor",
      dataIndex: "psinvven",
      key: "psinvven",
    },

    {
      title: "Price",
      dataIndex: "psinvpri",
      key: "psinvpri",

    },
    {
      title: "Quantity",
      dataIndex: "psinvqty",
      key: "psinvqty",

    },



    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.INV_VIEW)) && (

                <Tooltip label='View' fontSize='sm'>

                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="teal"
                    sx={{ _hover: { backgroundColor: Colors.SUCCESS2, color: Colors.BACKGROUND } }}

                    icon={<AiFillEye />}
                    aria-label={"view"}
                    onClick={() => goView(record?.id)}
                  />
                </Tooltip>
              )
            }
            {

              <Tooltip label='Edit' fontSize='sm'>
                <IconButton
                  variant="outline"
                  size={"sm"}
                  borderRadius={2}
                  colorScheme="blue"
                  sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                  icon={<BsPencil />}
                  aria-label={"edit"}
                  onClick={() => goEdit(record?.id)}
                />
              </Tooltip>


            }


            <TableMenu menus={[

              {
                url: `/maintLogs`,
                query: {
                  id: record?.id,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Product Catalogue",
                    href: `/product/Detail?id=${id}&mode=${mode}`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Maintenance Log",
                  },
                ]
              }
            ]} />

          </Space>
        </Flex>
      ),
    },
  ];


  function goView(id: string) {
    router.push({
      pathname: "/product/inventory",

      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  function goAdd() {
    router.push({
      pathname: "/product/inventory",

      query: {
        id: "",
        prduid: detailData?.psprduid,

        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/product/inventory",

      query: {
        id: id,
        prduid: detailData?.psprduid,

        mode: "EDIT"
      },
    });
  }





  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function toOnchange(value: any) {
    setTo(value);
  }

  //------------------------------------------------------------------------
  //Product Restock history - Stock Out
  //------------------------------------------------------------------------


  const [searchOut, setSearchOut] = useState();
  const [toOut, setToOut] = useState();


  const columnsOut: any[] = [
    {
      title: "Date",
      dataIndex: "psinvsdt",
      key: "psinvsdt",
    },
    {
      title: "Order No.",
      dataIndex: "pssktuid",
      key: "pssktuid",
    },
    {
      title: "Member",
      dataIndex: "psinvven",
      key: "psinvven",
    },

    {
      title: "Unit Price",
      dataIndex: "psinvpri",
      key: "psinvpri",

    },
    {
      title: "Quantity",
      dataIndex: "psinvqty",
      key: "psinvqty",

    },


    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.INV_VIEW)) && (

                <Tooltip label='View' fontSize='sm'>

                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="teal"
                    sx={{ _hover: { backgroundColor: Colors.SUCCESS2, color: Colors.BACKGROUND } }}

                    icon={<AiFillEye />}
                    aria-label={"view"}
                    onClick={() => goView(record?.id)}
                  />
                </Tooltip>
              )
            }
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.INV_EDIT)) && (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id)}
                  />
                </Tooltip>

              )
            }


            <TableMenu menus={[

              {
                url: `/maintLogs`,
                query: {
                  id: record?.id,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Products",
                    href: `/product/Detail?id=${id}&mode=${mode}`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Maintenance Log",
                  },
                ]
              }
            ]} />

          </Space>
        </Flex>
      ),
    },
  ];

  function searchOutOnChange(event: any) {
    setSearchOut(event.target.value);
  }

  function toOutOnchange(value: any) {
    setToOut(value);
  }


  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Product
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Product",
              href: `/tranCode`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Product (" + mode + ")",
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
              mode && mode !== "VIEW" && tabIndex == 0 && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
            {
              (homeData?.access && tabIndex == 1 && checkAccessMatrix(homeData?.access, accessType.INV_ADD)) && (
                <Buttons
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            }
          </Space>
        </Box>
      </Flex>
      {mode != "ADD" && formik.values.psprdcid && <Flex mt={4} bgColor="#fff" py={2}>
        <Tabs
          index={tabIndex}
          onChange={(index) => {
            let same = true;



            setTabIndex(index)






          }}>
          <Flex
            bgColor="#fff"
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            gap={5}
          >
            <TabList

              border={0}
            >
              <CustomTabs label="Product Detail" index={0} selectedTabIndex={tabIndex} />
              <CustomTabs label="Stock In" index={1} selectedTabIndex={tabIndex} />
              <CustomTabs label="Stock Out" index={2} selectedTabIndex={tabIndex} />


            </TabList>
          </Flex>
        </Tabs>
      </Flex>}
      {tabIndex == 0 &&
        <>
          <Box display="flex" flexDir="column" gap={6} width="100%">

            <Card
              p={4}
              mt={`${Spacing.containerPx}`}
              className="grid grid-cols-1 gap-6"
            >
              <Box>
                <SubHeader labelText="General Information" />

                <div className="flex flex-col sm:flex-row gap-6">
                  <Box display="flex" flexDir="column" gap={6} width="100%">
                    {mode != "ADD" && (
                      <FormControl
                        id="psprduid"
                        isInvalid={Boolean(formik.errors.psprduid) && Boolean(formik.touched.psprduid)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        {/* <FormLabel>Product*</FormLabel> */}
                        <CustomFormLabel labelText="Product Code" />
                        <Input
                          placeholder={"Enter Product Code"}
                          type="text"
                          name="psprduid"
                          onChange={formik.handleChange}
                          value={formik.values.psprduid || ""}
                          isDisabled={mode === "EDIT"}
                        />
                        {formik.errors.psprduid && (
                          <FormErrorMessage>{formik.errors.psprduid}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                    <FormControl
                      id="psprdnme"
                      isInvalid={Boolean(formik.errors.psprdnme) && Boolean(formik.touched.psprdnme)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Description*</FormLabel> */}
                      <CustomFormLabel labelText="Name" />
                      <Input
                        placeholder={"Enter Name"}
                        type="text"
                        name="psprdnme"
                        onChange={formik.handleChange}
                        value={formik.values.psprdnme || ""}
                      />
                      {formik.errors.psprdnme && (
                        <FormErrorMessage>{formik.errors.psprdnme}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprddsc"
                      isInvalid={Boolean(formik.errors.psprddsc) && Boolean(formik.touched.psprddsc)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Description*</FormLabel> */}
                      <CustomFormLabel labelText="Description" />
                      <Input
                        placeholder={"Enter Description"}
                        type="text"
                        name="psprddsc"
                        onChange={formik.handleChange}
                        value={formik.values.psprddsc || ""}
                      />
                      {formik.errors.psprddsc && (
                        <FormErrorMessage>{formik.errors.psprddsc}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl
                      id="psprdlds"
                      isInvalid={Boolean(formik.errors.psprdlds) && Boolean(formik.touched.psprdlds)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>Local Description</FormLabel>
                      <Input
                        placeholder={"Enter Local Description"}
                        type="text"
                        name="psprdlds"
                        onChange={formik.handleChange}
                        value={formik.values.psprdlds || ""}
                      />
                      {formik.errors.psprdlds && (
                        <FormErrorMessage>{formik.errors.psprdlds}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                      <FormControl
                        id="psprdcat"
                        isInvalid={Boolean(formik.errors.psprdcat) && Boolean(formik.touched.psprdcat)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        <CustomFormLabel labelText="Product Category" />
                        <Select
                          placeholder="Select Product Category"
                          value={formik.values.psprdcat || ""}
                          onChange={formik.handleChange}
                          style={{
                            fontSize: 14,
                          }}
                        // isDisabled={mode === "VIEW" ? true : false}
                        >
                          {ddlData?.PRODCAT?.map((option: DDL_TYPES) => ( //change code
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psprdcat && (
                          <FormErrorMessage>{formik.errors.psprdcat}</FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psprdtyp"
                        isInvalid={Boolean(formik.errors.psprdtyp) && Boolean(formik.touched.psprdtyp)}
                      >
                        <CustomFormLabel labelText="Product Type" />
                        <Select
                          placeholder="Select Product Type"
                          value={formik.values.psprdtyp || ""}
                          onChange={formik.handleChange}
                          style={{
                            fontSize: 14,
                          }}
                        // isDisabled={mode === "VIEW" ? true : false}
                        >
                          {ddlData?.PRODTYP?.map((option: DDL_TYPES) => ( //change code
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>{formik.errors.psprdtyp && (
                          <FormErrorMessage>{formik.errors.psprdtyp}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                      <FormControl
                        id="psprdsts"
                        isInvalid={Boolean(formik.errors.psprdsts) && Boolean(formik.touched.psprdsts)}
                        isReadOnly={mode === "VIEW" ? true : false}
                        isDisabled
                      >
                        {/* <FormLabel>Transaction Type*</FormLabel> */}
                        <CustomFormLabel labelText="Product Status" />
                        <Select
                          placeholder="Select Product Status"
                          value={formik.values.psprdsts || ""}
                          onChange={formik.handleChange}
                          style={{
                            fontSize: 14,
                          }}
                        // isDisabled={mode === "VIEW" ? true : false}
                        >
                          {ddlData?.PRODSTS?.map((option: DDL_TYPES) => ( //change code
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psprdsts && (
                          <FormErrorMessage>{formik.errors.psprdsts}</FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psprdstk"
                        isInvalid={Boolean(formik.errors.psprdstk) && Boolean(formik.touched.psprdstk)}
                        isReadOnly={mode === "VIEW" ? true : false}

                      >

                        <FormLabel>Product Stock Quantity</FormLabel>


                        <Input
                          placeholder={"Enter Product Stock Quantity"}
                          type="number"
                          name="psprdstk"
                          min="0"
                          value={formik.values.psprdstk}
                          isDisabled
                          onChange={formik.handleChange}
                        />
                        {formik.errors.psprdstk && (
                          <FormErrorMessage>{formik.errors.psprdstk}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                  </Box>


                  <Box display="flex" flexDir="column" gap={6} width="100%">




                    <FormControl
                      id="psmrcuid"
                      isInvalid={
                        Boolean(formik.errors.psmrcuid) &&
                        Boolean(formik.touched.psmrcuid)
                      }
                    >
                      <FormLabel>Merchant</FormLabel>
                      <Select
                        placeholder="Please Select Merchant"
                        value={mchId ? mchId : formik.values.psmrcuid}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={mode === "VIEW" ? true : false}
                      >
                        {Array.isArray(ddlData2) &&
                          ddlData2
                            .map((option: any) => (
                              <option
                                key={option.psmrcuid}
                                value={option.psmrcuid}
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
                    <FormControl
                      id="psprdrtg"
                      isInvalid={Boolean(formik.errors.psprdrtg) && Boolean(formik.touched.psprdrtg)}
                      isReadOnly={mode === "VIEW" ? true : false}

                    >
                      <FormLabel>Rating</FormLabel>
                      <Input
                        placeholder={"Enter Rating"}
                        type="number"
                        name="psprdrtg"
                        min="0"
                        value={(formik.values.psprdrtg || formik.values.psprdrtg == 0) ? formik.values.psprdrtg : ""}
                        isDisabled
                        onChange={formik.handleChange}
                      />
                      {formik.errors.psprdrtg && (
                        <FormErrorMessage>{formik.errors.psprdrtg}</FormErrorMessage>
                      )}
                    </FormControl>


                    <FormControl
                      id="psprdimg"
                      isInvalid={
                        Boolean(formik.errors.psprdimg) &&
                        Boolean(formik.touched.psprdimg)
                      }
                    >
                      <FormLabel>Product Image</FormLabel>
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
                          fileList={selectedImg ? selectedImg : undefined}
                          onChange={(e: any) => handleFileUploadImg(e)}
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
                                          onClick={() => handleDownload(file?.uid, 5)}
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
                                        handleRemoveImg(file);
                                      }}
                                    // rev={undefined}
                                    />
                                  </Tooltip>
                                </Space>
                              </Space>
                            );
                          }}
                        >
                          <Flex flexDir={"column"} >
                            <Text fontSize={"md"} fontWeight={"bold"}>
                              Drop Files here
                            </Text>
                            <Text>or click to upload</Text>
                          </Flex>
                        </Dragger>
                      </div>
                      {formik.errors.psprdimg && (
                        <FormErrorMessage>{formik.errors.psprdimg}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl
                      id="psprdrmk"
                      isInvalid={
                        Boolean(formik.errors.psprdrmk) &&
                        Boolean(formik.touched.psprdrmk)
                      }
                      width="100%"
                    >
                      <FormLabel>Remarks</FormLabel>
                      <Textarea
                        placeholder="Enter Remarks"
                        value={formik.values.psprdrmk || ""}
                        name="psprdrmk"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.psprdrmk && (
                        <FormErrorMessage>
                          {formik.errors.psprdrmk}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                      <FormControl
                        id="psprdsdt"
                        isInvalid={Boolean(formik.errors.psprdsdt) && Boolean(formik.touched.psprdsdt)}
                      >
                        <FormLabel>Status Date</FormLabel>
                        <DatePicker
                          format={"DD/MM/YYYY"}
                          style={{ width: "100%" }}
                          value={
                            formik.values.psprdsdt == detailData.psprdsdt
                              ? dayjs(detailData.psprdsdt)
                              : dayjs(new Date())
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "psprdsdt" },
                            })
                          }
                          onBlur={formik.handleBlur}
                          disabled={true}
                        />
                        {formik.errors.psprdsdt && (
                          <FormErrorMessage>{formik.errors.psprdsdt}</FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl
                        id="psprdcrd"
                        isInvalid={Boolean(formik.errors.psprdcrd) && Boolean(formik.touched.psprdcrd)}
                      >
                        <FormLabel>Creation Date</FormLabel>
                        <DatePicker
                          format={"DD/MM/YYYY"}
                          style={{ width: "100%" }}
                          value={
                            formik.values.psprdcrd == detailData.psprdcrd
                              ? dayjs(detailData.psprdcrd)
                              : dayjs(new Date())
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "psprdcrd" },
                            })
                          }
                          onBlur={formik.handleBlur}
                          disabled={true}
                        />
                        {formik.errors.psprdcrd && (
                          <FormErrorMessage>{formik.errors.psprdcrd}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
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
                <SubHeader labelText="Product Configuration" />

                <div className="flex flex-col sm:flex-row gap-6">
                  <Box display="flex" flexDir="column" gap={6} width="100%">
                    <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                      <FormControl
                        id="psprdcid"
                        w={"49%"}
                        isInvalid={
                          Boolean(formik.errors.psprdcid) &&
                          Boolean(formik.touched.psprdcid)
                        }
                        isReadOnly={mode == "VIEW" ? true : false}
                      >
                        <FormLabel whiteSpace={"nowrap"}>Product Is Countable?</FormLabel>
                        <Switch
                          id="psprdcid"
                          name="psprdcid"
                          isChecked={formik.values.psprdcid}
                          onChange={handleCidChange}
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
                        {formik.errors.psprdcid && (
                          <FormErrorMessage>
                            {formik.errors.psprdcid}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psprdlsr"
                        isInvalid={Boolean(formik.errors.psprdlsr) && Boolean(formik.touched.psprdlsr)}
                        isReadOnly={mode === "VIEW" || !formik.values.psprdcid ? true : false}
                      >
                        {
                          formik.values.psprdcid ?
                            <CustomFormLabel labelText="Low Stock Reminder" /> : <FormLabel>Low Stock Reminder</FormLabel>
                        }

                        <Input
                          placeholder={"Enter Low Stock Reminder"}
                          type="number"
                          name="psprdlsr"
                          min="0"
                          value={formik.values.psprdcid ? formik.values.psprdlsr : 0}

                          onChange={formik.handleChange}
                        />
                        {formik.errors.psprdlsr && (
                          <FormErrorMessage>{formik.errors.psprdlsr}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                      <FormControl
                        id="psprdfvg"
                        w={"49%"}
                        isInvalid={
                          Boolean(formik.errors.psprdfvg) &&
                          Boolean(formik.touched.psprdfvg)
                        }
                        isReadOnly={mode == "VIEW" ? true : false}
                      >
                        <FormLabel>For Vegeterian?</FormLabel>
                        <Switch
                          id="psprdfvg"
                          name="psprdfvg"
                          isChecked={formik.values.psprdfvg}
                          onChange={handleFvgChange}
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
                        {formik.errors.psprdfvg && (
                          <FormErrorMessage>
                            {formik.errors.psprdfvg}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psprdhal"
                        w={"49%"}
                        isInvalid={
                          Boolean(formik.errors.psprdhal) &&
                          Boolean(formik.touched.psprdhal)
                        }
                        isReadOnly={mode == "VIEW" ? true : false}
                      >
                        <FormLabel>Is Halal?</FormLabel>
                        <Switch
                          id="psprdhal"
                          name="psprdhal"
                          isChecked={formik.values.psprdhal}
                          onChange={handleHalChange}
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
                        {formik.errors.psprdhal && (
                          <FormErrorMessage>
                            {formik.errors.psprdhal}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>

                  </Box>
                  <Box display="flex" flexDir="column" gap={6} width="100%">
                    <FormControl
                      id="psprdpri"
                      isInvalid={Boolean(formik.errors.psprdpri) && Boolean(formik.touched.psprdpri)}
                      isReadOnly={mode == "VIEW"}
                    >
                      {

                        <CustomFormLabel labelText="Product Price" />
                      }

                      <Stack spacing={4}>
                        <InputGroup>

                          <Input
                            type="text"
                            name="psprdpri"
                            placeholder="Enter Product Price"
                            value={numberWithCommas(formik.values.psprdpri)}
                            pattern={numberPattern}
                            onChange={(event) => {
                              const value = event.target.value;

                              // Check if the value is a valid number or empty
                              if (!value || /^[0-9.,]*$/.test(value)) {
                                formik.handleChange({
                                  target: {
                                    value: parseThousandsToNumber(value),
                                    name: "psprdpri",
                                  },
                                });
                              }
                            }}
                            onBlur={formik.handleBlur}
                          />
                        </InputGroup>
                      </Stack>
                      {formik.errors.psprdpri && (
                        <FormErrorMessage>{formik.errors.psprdpri}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Flex justifyContent="space-between" alignItems="center" gap={5}  >


                      <FormControl
                        id="psprdtak"
                        w={"49%"}
                        isInvalid={
                          Boolean(formik.errors.psprdtak) &&
                          Boolean(formik.touched.psprdtak)
                        }
                        isReadOnly={mode == "VIEW" ? true : false}
                      >
                        <FormLabel>Able to Takeaway</FormLabel>
                        <Switch
                          id="psprdtak"
                          name="psprdtak"
                          isChecked={formik.values.psprdtak}
                          onChange={handleTaChange}
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
                        {formik.errors.psprdtak && (
                          <FormErrorMessage>
                            {formik.errors.psprdtak}
                          </FormErrorMessage>
                        )}
                      </FormControl>


                      <FormControl
                        id="psprdtpr"
                        isInvalid={Boolean(formik.errors.psprdtpr) && Boolean(formik.touched.psprdtpr)}
                        isReadOnly={mode == "VIEW"}
                      >
                        {
                          formik.values.psprdtak ?
                            <CustomFormLabel labelText="Takeaway Charges" /> : <FormLabel>Takeaway Charges</FormLabel>
                        }

                        <Stack spacing={4}>
                          <InputGroup>

                            <Input
                              type="text"
                              name="psprdtpr"
                              placeholder="Enter Takeaway Charges"
                              value={
                                formik.values.psprdtak ? numberWithCommas(formik.values.psprdtpr) : 0}
                              pattern={numberPattern}
                              onChange={(event) => {
                                const value = event.target.value;

                                // Check if the value is a valid number or empty
                                if (!value || /^[0-9.,]*$/.test(value)) {
                                  formik.handleChange({
                                    target: {
                                      value: parseThousandsToNumber(value),
                                      name: "psprdtpr",
                                    },
                                  });
                                }
                              }}
                              onBlur={formik.handleBlur}
                            />
                          </InputGroup>
                        </Stack>
                        {formik.errors.psprdtpr && (
                          <FormErrorMessage>{formik.errors.psprdtpr}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>
                  </Box>
                </div>
              </Box>
            </Card>
          </Box>
        </>
      }

      {tabIndex == 1 &&
        <Box>
          <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>

            {/* <Flex direction={"column"} alignSelf={"center"}>
              <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                Products
              </Text>
              <Breadcrumbs breadcrumbItems={[
                {
                  title: "Products"
                },
              ]} />
            </Flex> */}

          </Flex>
          <Card p={1} mt={4}>
            <Flex bgColor="#fff" justifyContent={"space-between"} pr={3} pl={3} pt={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex">
                <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                  Stock In
                </Text>

              </Box>
            </Flex>
            <Flex bgColor="#fff" justifyContent={"space-between"} pr={3} pl={3} pb={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex">
                <Text color="blue" fontSize={"small"}>
                  Product: {detailData.psprduid} - {detailData.psprdnme}
                </Text>

              </Box>
            </Flex>
            <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex"
              >
                <Space size="middle">
                  <Box display="flex" flexDir={"row"} gap={4} alignItems={"center"}>
                    <Text minW={"35%"}>From Date</Text>

                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-full"
                      placeholder="From Date"
                      onChange={(d) => {
                        // @ts-ignore
                        // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempFromDate(formatDate(d))
                        // else setTempFromDate("")
                        setTempFromDate(d);
                      }}
                      value={tempFromDate}
                    />
                    {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
                  </Box>
                  <FormControl isInvalid={dateError}>
                    <Box display="flex" flexDir="column">
                      <Box
                        display="flex"
                        flexDir={"row"}
                        gap={4}
                        alignItems={"center"}
                      >
                        <Text minW={"35%"}>To Date</Text>

                        <DatePicker
                          format="DD/MM/YYYY"
                          className="w-full"
                          placeholder="To Date"
                          onChange={(d) => {
                            // @ts-ignore
                            // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempToDate(formatDate(d))
                            // else setTempToDate("")

                            setTempToDate(d);
                          }}
                          value={tempToDate}
                        />
                      </Box>
                      {dateError && (
                        <FormErrorMessage>
                          {"From Date cannot be greater than To Date"}
                        </FormErrorMessage>
                      )}
                    </Box>
                  </FormControl>
                </Space>
              </Box>
            </Flex>
            <Table
              columns={columns}
              data={tableData}
              refreshFn={fetchProductsR}
              totalRecords={totalRecords}
              extraParams={{
                from: new Date(tempFromDate),
                to: new Date(tempToDate),
                psprdinv: "I",
                prodId: detailData?.psprduid
              }}
            />
          </Card>
        </Box>
      }

      {tabIndex == 2 &&

        <Box>
          <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>

            {/* <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Products
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Products"
              },
            ]} />
          </Flex> */}

          </Flex>
          <Card p={1} mt={4}>
            <Flex bgColor="#fff" justifyContent={"space-between"} pr={3} pl={3} pt={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex">
                <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                  Stock Out
                </Text>

              </Box>
            </Flex>
            <Flex bgColor="#fff" justifyContent={"space-between"} pr={3} pl={3} pb={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex">
                <Text color="blue" fontSize={"small"}>
                  Product: {detailData.psprduid} - {detailData.psprdnme}
                </Text>

              </Box>
            </Flex>
            <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex"
              >
                <Space size="middle">
                  <Box display="flex" flexDir={"row"} gap={4} alignItems={"center"}>
                    <Text minW={"35%"}>From Date</Text>

                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-full"
                      placeholder="From Date"
                      onChange={(d) => {
                        // @ts-ignore
                        // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempFromDate(formatDate(d))
                        // else setTempFromDate("")
                        setTempFromDate(d);
                      }}
                      value={tempFromDate}
                    />
                    {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
                  </Box>
                  <FormControl isInvalid={dateError}>
                    <Box display="flex" flexDir="column">
                      <Box
                        display="flex"
                        flexDir={"row"}
                        gap={4}
                        alignItems={"center"}
                      >
                        <Text minW={"35%"}>To Date</Text>

                        <DatePicker
                          format="DD/MM/YYYY"
                          className="w-full"
                          placeholder="To Date"
                          onChange={(d) => {
                            // @ts-ignore
                            // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempToDate(formatDate(d))
                            // else setTempToDate("")

                            setTempToDate(d);
                          }}
                          value={tempToDate}
                        />
                      </Box>
                      {dateError && (
                        <FormErrorMessage>
                          {"From Date cannot be greater than To Date"}
                        </FormErrorMessage>
                      )}
                    </Box>
                  </FormControl>
                </Space>
              </Box>
            </Flex>
            <Table
              columns={columnsOut}
              data={tableData}
              refreshFn={fetchProductsR}
              totalRecords={totalRecords}
              extraParams={{
                from: new Date(tempFromDate),
                to: new Date(tempToDate),
                psprdinv: "O",
                prodId: detailData?.psprduid

              }}
            />
          </Card>
        </Box>
      }



      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && tabIndex == 0 && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
            {
              (homeData?.access && tabIndex == 1 && checkAccessMatrix(homeData?.access, accessType.INV_ADD)) && (
                <Buttons
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            }
          </Space>
        </Box>
      </Flex>
    </form>
  );
}



