// Chakra imports
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Colors from "@app/constants/Colors";
import {
  numberWithCommas,
  numberPattern,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import Table from "@app/components/common/Table/Table";

import {
  Box,
  Flex,
  Text,
  Input, Stack,
  InputGroup,
  IconButton,
  Button, Tooltip,
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
  Checkbox,
  Switch, Tabs, TabList, Tab,
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";


// assets
import React, { useEffect, useState, CSSProperties } from "react";
import { message, Upload, } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getManageProd, getProdDetail } from "@app/redux/prod/slice";
import useFetchProdDetail from "@app/hooks/selector/useFetchProdDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageProd } from "@app/redux/prod/api";
import { ProdSchema } from "@app/components/forms/@schemas/prodSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchProdComs from "@app/hooks/selector/useFetchProdComs";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { BsEye, BsPencil } from "react-icons/bs";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { fetchProdCom, getremoveProdCom } from "@app/redux/prodCom/slice";
import SubHeader from "@app/components/common/Header/SubHeader";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";



export default function prodForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Trust Fund Product" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [tabIndex, setTabIndexx] = useState(0);
  const [tableData, refreshFn, totalRecords, extra] = useFetchProdComs(props.id);

  const homeData = useAppSelector(selectHome);
  const [detailData] = useFetchProdDetail(id);
  const kan = String(router.query?.tabIndex);
  useEffect(() => {
    if (kan == "1") {
      setTabIndexx(1)
    } else setTabIndexx(0)
  }, [kan])
  const customHeaderCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 60
  };

  const customDataCellStyle: CSSProperties = {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: 12,
  };
  const initialValues = {
    psprdcde: null,
    psprddsc: null,
    psprdccr: null,
    psprdiss: null,
    psprddmg: null,
    psprdmin: null,
    psprdmul: 0,
    psprdfsz: 0,
    psprdpmd: null,
    psprdten: 0,
    psprdoa1: null,
    psprdoa2: null,
    psprdoa3: null,
    psprdoa4: null,
    psprdopc: null,
    psprdoct: null,
    psprdost: null,
    psprdocn: null,
    psprdotl: null,
    psprdoex: null,
    psprdoem: null,
    psprdows: null,
    psprddac: null,
    psprdda2: null,
    psprddtp: null,
    psprdsdd: null



  };


  const [ddlData] = useFetchDDL({ code: ["CURRCD", "DEVTERM", "STATE", "COUNTRY", 'DAYCLOSE', 'CLDTYPE', 'SUBMITDD'] });

  function goAdd() {
    router.push({
      pathname: "/prod/prodComDetail",
      query: {
        id: "",
        prodCode: id,
        tabIndex: tabIndex,

        mode: "ADD"
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/prod/prodComDetail",
      query: {
        id: id,
        prodCode: props.id,
        tabIndex: tabIndex,
        mode: "EDIT"
      },
    });
  }
  const columns: any[] = [
    {
      title: "Agent Desgination",
      dataIndex: "pscomdsg",
      key: "pscomdsg",
      render: (_: any, record: any) => (
        <Text>{`${record.pscomdsgdsc}`}</Text>
      )
    },
    {
      title: "Sale Type",
      dataIndex: "pscomstp",
      key: "pscomstp",
      render: (_: any, record: any) => (
        <Text>{`${record.pscomstpdsc}`}</Text>
      )
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ paddingLeft: '0px' }}>Personal Commision</div>
          <div>
            <span style={{ paddingLeft: '0px' }}>1st Year</span>
            <span style={{ paddingLeft: '25px' }}>2nd Year</span>
            <span style={{ paddingLeft: '25px' }}>3rd Year</span>
          </div>
        </div>
      ),
      dataIndex: "pscomfyr",
      key: "pscomfyr",
      render: (_: any, record: any) => {
        const formatToTwoDecimals = (value: any) => {
          const numericValue = Number(value); // Convert to number
          return isNaN(numericValue) ? value : numericValue.toFixed(2); // Handle non-numeric values
        };
        const numberStyle: React.CSSProperties = {
          display: "inline-block",

          width: "80px",
        };

        return (
          <div style={{ textAlign: "center" }}>
            <div>
              <span style={{ ...numberStyle, paddingLeft: '15px' }}>{formatToTwoDecimals(record.pscomfyr)}</span>
              <span style={{ ...numberStyle, paddingLeft: '20px' }}>{formatToTwoDecimals(record.pscomsyr)}</span>
              <span style={{ ...numberStyle, paddingLeft: '25px' }}>{formatToTwoDecimals(record.pscomtyr)}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Builder Bonus",
      dataIndex: "pscombbp",
      key: "pscombbp",
      render: (_: any, record: any) => {
        const formatToTwoDecimals = (value: any) => {
          const numericValue = Number(value); // Convert to number
          return isNaN(numericValue) ? value : numericValue.toFixed(2); // Handle non-numeric values
        };

        return (
          <div style={{ textAlign: "center" }}>
            <Text>{formatToTwoDecimals(record.pscombbp ? record.pscombbp : 0)}</Text>
          </div>

        );
      }
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ paddingLeft: '0px' }}>Overriding Commission</div>
          <div>
            <span style={{ paddingLeft: '0px' }}>1st Year</span>
            <span style={{ paddingLeft: '25px' }}>2nd Year</span>
            <span style={{ paddingLeft: '25px' }}>3rd Year</span>
          </div>
        </div>
      ),
      dataIndex: "pscomofy",
      key: "pscomofy",
      render: (_: any, record: any) => {
        const formatToTwoDecimals = (value: any) => {
          const numericValue = Number(value); // Convert to number
          return isNaN(numericValue) ? value : numericValue.toFixed(2); // Handle non-numeric values
        };
        const numberStyle: React.CSSProperties = {
          display: "inline-block",

          width: "80px",
        };


        return (
          <div style={{ textAlign: "center" }}>
            <div>
              <span style={{ ...numberStyle, paddingLeft: '15px' }}>{formatToTwoDecimals(record.pscomofy)}</span>
              <span style={{ ...numberStyle, paddingLeft: '20px' }}>{formatToTwoDecimals(record.pscomosy)}</span>
              <span style={{ ...numberStyle, paddingLeft: '25px' }}>{formatToTwoDecimals(record.pscomoty)}</span>
            </div>
          </div>
        );
      },
    },
    // {
    //   title: "Overrding Agent Commision",
    //   dataIndex: "pscomocr",
    //   key: "pscomocr",
    // },

    {
      title: "Effective Date",
      dataIndex: "pscomefd",
      key: "pscomefd",
    },
    {
      title: <div style={customHeaderCellStyle}>ACTIONS</div>,
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <div style={customDataCellStyle}>
          <Space size="small">
            {/* {
                      (homeData?.access && checkAccessMatrix(homeData?.access, accessType.prodCom_VIEW)) && (
                          <Tooltip label='View' fontSize='sm'>
                              <IconButton
                                  variant="outline"
                                  size={"sm"}
                                  borderRadius={2}
                                  colorScheme="blue"
                                  sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                                  icon={<BsEye />}
                                  aria-label={"view"}
                                  onClick={() => goView(record?.id)}
                              />
                          </Tooltip>
                      )
                  } */}
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_EDIT)) && (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="yellow"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id)}
                  />
                </Tooltip>
              )
            }
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_DEL)) && (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.pscomdsg, record?.pscomdsgdsc)}
                  />
                </Tooltip>
              )
            }

            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psprdcde,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Trust Fund Product - Commision",
                      href: `/prod/Detail`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ]
                },

              ]}
            />
          </Space>
        </div>
      ),
    },

  ];

  function alertRemove(id: string, desc: string, decsORI: string) {
    dispatch(
      openGlobalModal({
        title: "Delete record",
        message: RemoveDetail(desc, decsORI),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => onRemove(id, decsORI),
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

  async function onRemove(id: string, desc: string) {
    const { success } = await sendRequest({
      fn: getremoveProdCom({ id, desc }),
    });

    if (success) {
      dispatch(refreshTable())
      setTimeout(() => {
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record deleted",
        });
      }, 200);
    }
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ProdSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psprdcde,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageProd({
        id: mode === "EDIT" ? data.id : "", ...data,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update item" : "Add item",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.push({
          pathname: "/prod",
          query: {


          },
        })
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Trust Fund Product
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Trust Fund Product",
              href: `/prod`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Trust Fund Product (" + mode + ")",
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
          {/* <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"}  
                />
              )}
          </Space> */}
          <Space size="small">
            {tabIndex == 0 && (
              <>
                <Buttons
                  buttonDefaultType={"BACK"} buttonLoading={loading} onclick={() => router.push({
                    pathname: "/prod",
                    query: {


                    },
                  })}
                />
                {
                  mode && mode !== "VIEW" && (
                    <Buttons
                      buttonDefaultType={"SAVE"} buttonLoading={loading}
                    />
                  )}
              </>)}

            {tabIndex == 1 && (
              <Box
                display={"flex"}
                alignSelf={"center"}
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
              >
                {
                  (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) && (
                    <Buttons
                      buttonDefaultType={"ADD"} onclick={() => goAdd()}
                    />
                  )
                }
              </Box>
            )
            }
          </Space>
        </Box>
      </Flex>
      {mode !== "ADD" && <Flex mt={4} bgColor="#fff" py={2}>
        <Tabs index={tabIndex} onChange={(index) => setTabIndexx(index)}>
          <Flex
            bgColor="#fff"
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            gap={5}
          >
            <TabList
              border={0}
            >
              {/* <Tab
                key={`promo-tab-1`}
                py={3}
                whiteSpace={"nowrap"}
                ml={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                fontWeight={"medium"}
                paddingBottom={"3px"}
                borderBottomWidth={2}
              >
                Product Code
              </Tab> */}
              <CustomTabs label="Product Code" index={0} selectedTabIndex={tabIndex} />
              {
                (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                <>
                  {/* <Tab
                    key={`promo-tab-2`}
                    py={3}
                    whiteSpace={"nowrap"}
                    ml={{
                      base: 0,
                      md: Spacing.containerPx,
                    }}
                       fontWeight={"medium"}
                paddingBottom={"3px"}
                borderBottomWidth={2}

                  >
                    Commision
                  </Tab> */}
                  <CustomTabs label="Commision" index={1} selectedTabIndex={tabIndex} />


                </>

              }
            </TabList>
          </Flex>
        </Tabs>
      </Flex>}
      {tabIndex === 0 && (
        <>


          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box>
              {/* <Text fontSize="19pt" fontWeight={"500"} >
              General Information
            </Text> */}
              <SubHeader labelText="General Information" />
              <div className="flex flex-col sm:flex-row gap-6">

                <Box display="flex" flexDir="column" gap={6} width="100%">

                  <FormControl
                    id="psprdcde"
                    isInvalid={Boolean(formik.errors.psprdcde) && Boolean(formik.touched.psprdcde)}
                    isReadOnly={mode === "VIEW" || mode === "EDIT" ? true : false}
                  >
                    {/* <FormLabel>Trust Fund Product*</FormLabel> */}
                    <CustomFormLabel labelText="Product Code" />
                    <Input
                      placeholder={"Enter Product Code"}
                      type="text"
                      name="psprdcde"
                      onChange={formik.handleChange}
                      value={formik.values.psprdcde || ""}
                      isDisabled={mode === "EDIT"}
                    />
                    {formik.errors.psprdcde && (
                      <FormErrorMessage>{formik.errors.psprdcde}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprddsc"
                    isInvalid={Boolean(formik.errors.psprddsc) && Boolean(formik.touched.psprddsc)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Product Description" />
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
                    id="psprdccr"
                    isInvalid={Boolean(formik.errors.psprdccr) && Boolean(formik.touched.psprdccr)}
                  >
                    {/* <FormLabel>Affect Code 1*</FormLabel> */}
                    <CustomFormLabel labelText="Currency Code" />
                    <Select
                      placeholder="Select Currency Code"
                      value={formik.values.psprdccr || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {ddlData?.CURRCD?.map((option: DDL_TYPES) => ( //change code
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>{formik.errors.psprdccr && (
                      <FormErrorMessage>{formik.errors.psprdccr}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprdiss"
                    isInvalid={Boolean(formik.errors.psprdiss) && Boolean(formik.touched.psprdiss)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Local Description</FormLabel> */}
                    <CustomFormLabel labelText="Issuer" />
                    <Input
                      placeholder={"Enter Issuer"}
                      type="text"
                      name="psprdiss"
                      onChange={formik.handleChange}
                      value={formik.values.psprdiss || ""}
                    />
                    {formik.errors.psprdiss && (
                      <FormErrorMessage>{formik.errors.psprdiss}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprddmg"
                    isInvalid={Boolean(formik.errors.psprddmg) && Boolean(formik.touched.psprddmg)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <FormLabel>Distribution Manager</FormLabel>
                    {/* <CustomFormLabel labelText="Distribution Manager" /> */}
                    <Input
                      placeholder={"Enter Distribution Manager"}
                      type="text"
                      name="psprddmg"
                      onChange={formik.handleChange}
                      value={formik.values.psprddmg || ""}
                    />
                    {formik.errors.psprddmg && (
                      <FormErrorMessage>{formik.errors.psprddmg}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprdfsz"
                    isInvalid={Boolean(formik.errors.psprdfsz) && Boolean(formik.touched.psprdfsz)}
                  >
                    <FormLabel>Fund Size</FormLabel>
                    <Stack spacing={4}>
                      <InputGroup>
                        {/* <InputLeftElement
                      pointerEvents="none"
                      color="gray.600"
                      fontSize="0.8em"
                      children="RM"
                    /> */}
                        <Input
                          type="text"
                          name="psprdfsz"
                          // placeholder="Enter referee amount"
                          value={numberWithCommas(formik.values.psprdfsz)}
                          pattern={numberPattern}
                          onChange={(event) =>
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(event.target.value),
                                name: "psprdfsz",
                              },
                            })
                          }
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psprdfsz && (
                      <FormErrorMessage>{formik.errors.psprdfsz}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>

                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <FormControl
                    id="psprdmin"
                    isInvalid={Boolean(formik.errors.psprdmin) && Boolean(formik.touched.psprdmin)}
                  >
                    <FormLabel>Min Placement Amount</FormLabel>
                    <Stack spacing={4}>
                      <InputGroup>
                        {/* <InputLeftElement
                      pointerEvents="none"
                      color="gray.600"
                      fontSize="0.8em"
                      children="RM"
                    /> */}
                        <Input
                          type="text"
                          name="psprdmin"
                          // placeholder="Enter referee amount"
                          value={numberWithCommas(formik.values.psprdmin)}
                          pattern={numberPattern}
                          onChange={(event) =>
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(event.target.value),
                                name: "psprdmin",
                              },
                            })
                          }
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psprdmin && (
                      <FormErrorMessage>{formik.errors.psprdmin}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprdmul"
                    isInvalid={Boolean(formik.errors.psprdmul) && Boolean(formik.touched.psprdmul)}
                  >
                    <FormLabel>Multiple of</FormLabel>
                    <Stack spacing={4}>
                      <InputGroup>
                        {/* <InputLeftElement
                      pointerEvents="none"
                      color="gray.600"
                      fontSize="0.8em"
                      children="RM"
                    /> */}
                        <Input
                          type="text"
                          name="psprdmul"
                          // placeholder="Enter referee amount"
                          value={numberWithCommas(formik.values.psprdmul)}
                          pattern={numberPattern}
                          onChange={(event) =>
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(event.target.value),
                                name: "psprdmul",
                              },
                            })
                          }
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psprdmul && (
                      <FormErrorMessage>{formik.errors.psprdmul}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprdten"
                    isInvalid={Boolean(formik.errors.psprdten) && Boolean(formik.touched.psprdten)}
                  >
                    <FormLabel>Tenure (Year)</FormLabel>
                    <Stack spacing={4}>
                      <InputGroup>
                        {/* <InputLeftElement
                      pointerEvents="none"
                      color="gray.600"
                      fontSize="0.8em"
                      children="RM"
                    /> */}
                        <Input
                          type="text"
                          name="psprdten"
                          // placeholder="Enter referee amount"
                          value={numberWithCommas(formik.values.psprdten)}
                          pattern={numberPattern}
                          onChange={(event) =>
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(event.target.value),
                                name: "psprdten",
                              },
                            })
                          }
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psprdten && (
                      <FormErrorMessage>{formik.errors.psprdten}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprdpmd"
                    isInvalid={Boolean(formik.errors.psprdpmd) && Boolean(formik.touched.psprdpmd)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <FormLabel>Payment Deliverable</FormLabel>
                    {/* <CustomFormLabel labelText="Payment Deliverable" /> */}
                    <Select
                      placeholder="Select Payment Deliverable"
                      value={formik.values.psprdpmd || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {ddlData?.DEVTERM?.map((option: DDL_TYPES) => ( //change code
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psprdpmd && (
                      <FormErrorMessage>{formik.errors.psprdpmd}</FormErrorMessage>
                    )}
                  </FormControl>

                  <div className="flex flex-col sm:flex-row gap-6">

                    <FormControl
                      id="psprddac"
                      isInvalid={Boolean(formik.errors.psprddac) && Boolean(formik.touched.psprddac)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Sales Type*</FormLabel> */}
                      <CustomFormLabel labelText="Closing Day 1" />
                      <Select
                        placeholder="Select Closing Day 1"
                        value={formik.values.psprddac || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.DAYCLOSE?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprddac && (
                        <FormErrorMessage>{formik.errors.psprddac}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprddtp"
                      isInvalid={Boolean(formik.errors.psprddtp) && Boolean(formik.touched.psprddtp)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Sales Type*</FormLabel> */}
                      <CustomFormLabel labelText="Closing Day Type" />
                      <Select
                        placeholder="Select Closing Day Type"
                        value={formik.values.psprddtp || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.CLDTYPE?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprddtp && (
                        <FormErrorMessage>{formik.errors.psprddtp}</FormErrorMessage>
                      )}
                    </FormControl>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6">

                    <FormControl
                      id="psprdda2"
                      isInvalid={Boolean(formik.errors.psprdda2) && Boolean(formik.touched.psprdda2)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>Closing Day 2</FormLabel>
                      {/* <CustomFormLabel labelText="Day Closing 2" /> */}
                      <Select
                        placeholder="Select Closing Day 2"
                        value={formik.values.psprdda2 || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.DAYCLOSE?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdda2 && (
                        <FormErrorMessage>{formik.errors.psprdda2}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdsdd"
                      isInvalid={Boolean(formik.errors.psprdsdd) && Boolean(formik.touched.psprdsdd)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Sales Type*</FormLabel> */}
                      <CustomFormLabel labelText="Submission Due Date" />
                      <Select
                        placeholder="Select Submission Due Date"
                        value={formik.values.psprdsdd || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.SUBMITDD?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdsdd && (
                        <FormErrorMessage>{formik.errors.psprdsdd}</FormErrorMessage>
                      )}
                    </FormControl>
                  </div>

                </Box>


              </div>
              {/* <Text fontSize="19pt" fontWeight={"500"} pt={30} >
              Address & Contact Information
            </Text> */}



            </Box>
          </Card>
          <Box display="flex" flexDir="row" gap={6} width="100%">

            <Card
              p={4}
              mt={`${Spacing.containerPx}`}
              className="grid grid-cols-1 gap-6"
            >
              <Box mt={"15px"} width="100%">
                <SubHeader labelText="Address Information" />


              </Box>

              <div className="flex flex-col sm:flex-row gap-6">

                <Box display="flex" flexDir="column" gap={6} width="100%">

                  <FormControl
                    id="psprdoa1"
                    isInvalid={Boolean(formik.errors.psprdoa1) && Boolean(formik.touched.psprdoa1)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >

                    <CustomFormLabel labelText="Office Address Line 1" />
                    <Input
                      placeholder={"Enter Office Address Line 1"}
                      type="text"
                      name="psprdoa1"
                      onChange={formik.handleChange}
                      value={formik.values.psprdoa1 || ""}
                    />
                    {formik.errors.psprdoa1 && (
                      <FormErrorMessage>{formik.errors.psprdoa1}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    id="psprdoa2"
                    isInvalid={Boolean(formik.errors.psprdoa2) && Boolean(formik.touched.psprdoa2)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >

                    <FormLabel>Office Address Line 2</FormLabel>
                    <Input
                      placeholder={"Enter Office Address Line 2"}
                      type="text"
                      name="psprdoa2"
                      onChange={formik.handleChange}
                      value={formik.values.psprdoa2 || ""}
                    />
                    {formik.errors.psprdoa2 && (
                      <FormErrorMessage>{formik.errors.psprdoa2}</FormErrorMessage>
                    )}
                  </FormControl>

                  {/* <FormControl
                id="psprdoa3"
                isInvalid={Boolean(formik.errors.psprdoa3) && Boolean(formik.touched.psprdoa3)}
                isReadOnly={mode === "VIEW" ? true : false}
              >

                <FormLabel>Office Address Line 3</FormLabel>
                <Input
                  placeholder={"Enter Office Address Line 3"}
                  type="text"
                  name="psprdoa3"
                  onChange={formik.handleChange}
                  value={formik.values.psprdoa3 || ""}
                />
                {formik.errors.psprdoa3 && (
                  <FormErrorMessage>{formik.errors.psprdoa3}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psprdoa4"
                isInvalid={Boolean(formik.errors.psprdoa4) && Boolean(formik.touched.psprdoa4)}
                isReadOnly={mode === "VIEW" ? true : false}
              >

                <FormLabel>Office Address Line 4</FormLabel>
                <Input
                  placeholder={"Enter Office Address Line 4"}
                  type="text"
                  name="psprdoa4"
                  onChange={formik.handleChange}
                  value={formik.values.psprdoa4 || ""}
                />
                {formik.errors.psprdoa4 && (
                  <FormErrorMessage>{formik.errors.psprdoa4}</FormErrorMessage>
                )}
              </FormControl> */}
                  <div className="flex flex-col sm:flex-row gap-6">

                    <FormControl
                      id="psprdopc"
                      isInvalid={Boolean(formik.errors.psprdopc) && Boolean(formik.touched.psprdopc)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >

                      <CustomFormLabel labelText="Postcode" />
                      <Input
                        placeholder={"Enter Postcode"}
                        type="text"
                        name="psprdopc"
                        onChange={formik.handleChange}
                        value={formik.values.psprdopc || ""}
                      />
                      {formik.errors.psprdopc && (
                        <FormErrorMessage>{formik.errors.psprdopc}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl
                      id="psprdoct"
                      isInvalid={Boolean(formik.errors.psprdoct) && Boolean(formik.touched.psprdoct)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >

                      <CustomFormLabel labelText="City" />
                      <Input
                        placeholder={"Enter City"}
                        type="text"
                        name="psprdoct"
                        onChange={formik.handleChange}
                        value={formik.values.psprdoct || ""}
                      />
                      {formik.errors.psprdoct && (
                        <FormErrorMessage>{formik.errors.psprdoct}</FormErrorMessage>
                      )}
                    </FormControl>

                  </div>
                  <div className="flex flex-col sm:flex-row gap-6">

                    <FormControl
                      id="psprdost"
                      isInvalid={Boolean(formik.errors.psprdost) && Boolean(formik.touched.psprdost)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>State</FormLabel> */}
                      <CustomFormLabel labelText="State" />

                      <Select
                        placeholder="Select State"
                        value={formik.values.psprdost || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.STATE?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdost && (
                        <FormErrorMessage>{formik.errors.psprdost}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdocn"
                      isInvalid={Boolean(formik.errors.psprdocn) && Boolean(formik.touched.psprdocn)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Country Code</FormLabel> */}
                      <CustomFormLabel labelText="Country" />
                      <Select
                        placeholder="Select Country"
                        value={formik.values.psprdocn || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.COUNTRY?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdocn && (
                        <FormErrorMessage>{formik.errors.psprdocn}</FormErrorMessage>
                      )}
                    </FormControl>
                  </div>
                </Box>

              </div>



            </Card>
            <Card
              p={4}
              mt={`${Spacing.containerPx}`}
              className="grid grid-cols-1 gap-6"
            >
              <Box mt={"15px"} width="100%">
                <SubHeader labelText="Contact Information" />

              </Box>
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <FormControl
                  id="psprdotl"
                  isInvalid={Boolean(formik.errors.psprdotl) && Boolean(formik.touched.psprdotl)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >

                  <CustomFormLabel labelText="Office No." />
                  <Input
                    placeholder={"Enter Office No."}
                    type="text"
                    name="psprdotl"
                    onChange={formik.handleChange}
                    value={formik.values.psprdotl || ""}
                  />
                  {formik.errors.psprdotl && (
                    <FormErrorMessage>{formik.errors.psprdotl}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psprdoex"
                  isInvalid={Boolean(formik.errors.psprdoex) && Boolean(formik.touched.psprdoex)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >

                  {/* <CustomFormLabel labelText="Office No. Extension" /> */}
                  <FormLabel>Office No. Extension</FormLabel>
                  <Input
                    placeholder={"Enter Office No. Extension"}
                    type="text"
                    name="psprdoex"
                    onChange={formik.handleChange}
                    value={formik.values.psprdoex || ""}
                  />
                  {formik.errors.psprdoex && (
                    <FormErrorMessage>{formik.errors.psprdoex}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psprdoem"
                  isInvalid={Boolean(formik.errors.psprdoem) && Boolean(formik.touched.psprdoem)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >

                  <CustomFormLabel labelText="Office Email" />
                  <Input
                    placeholder={"Enter Office Email"}
                    type="text"
                    name="psprdoem"
                    onChange={formik.handleChange}
                    value={formik.values.psprdoem || ""}
                  />
                  {formik.errors.psprdoem && (
                    <FormErrorMessage>{formik.errors.psprdoem}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psprdows"
                  isInvalid={Boolean(formik.errors.psprdows) && Boolean(formik.touched.psprdows)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >

                  <CustomFormLabel labelText="Website" />
                  <Input
                    placeholder={"Enter Website"}
                    type="text"
                    name="psprdows"
                    onChange={formik.handleChange}
                    value={formik.values.psprdows || ""}
                  />
                  {formik.errors.psprdows && (
                    <FormErrorMessage>{formik.errors.psprdows}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>

            </Card>

          </Box>
        </>
      )}
      {tabIndex === 1 && (

        <Box>

          <Card p={1} mt={4}>
            <Flex bgColor="#fff" justifyContent={"space-between"} pr={3} pl={3} pt={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex">
                {/* <Text fontSize={"3xl"} fontWeight="500" mb={1}>
                  Agent Commision Listing
                </Text> */}
                <SubHeader labelText="Agent Commision Listing" />

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
                  {/* <Input
                    type="text"
                    name="search"
                    onChange={searchOnChange}
                    placeholder="Search"
                    value={search}
                  />

                  <DatePicker
                    id="to"
                    name="to"
                    placeholder="Select Date"
                    className="w-full"
                    format={"DD/MM/YYYY"}
                    value={to}
                    onChange={toOnchange}
                  /> */}

                </Space>
              </Box>
            </Flex>
            <Table
              columns={columns}
              data={tableData}
              refreshFn={fetchProdCom}
              totalRecords={totalRecords}
              extraParams={{

                search: props.id,

              }}
            />
          </Card>
        </Box>

      )}

      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          {/* <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space> */}
          <Space size="small">
            {tabIndex == 0 && (
              <>
                <Buttons
                  buttonDefaultType={"BACK"} buttonLoading={loading} onclick={() => router.push({
                    pathname: "/prod",
                    query: {


                    },
                  })}
                />
                {
                  mode && mode !== "VIEW" && (
                    <Buttons
                      buttonDefaultType={"SAVE"} buttonLoading={loading}
                    />
                  )}
              </>)}

            {tabIndex == 1 && (
              <Box
                display={"flex"}
                alignSelf={"center"}
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
              >
                {/* {
                  (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PRODUCTR_ADD)) && (
                    <Buttons
                      buttonDefaultType={"ADD"} onclick={() => goAdd()}
                    />
                  )
                } */}
              </Box>
            )
            }
          </Space>
        </Box>
      </Flex>
    </form>
  );
}

const RemoveDetail = (item: string, itemDesc: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
