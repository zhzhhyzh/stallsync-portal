// Chakra imports
import Colors from "@app/constants/Colors";
import {
  numberWithCommas,
  numberPattern,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import {
  Box,
  Flex, Divider,
  Text,
  Input,
  Button,
  Select, Stack, InputGroup,
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
  Switch,
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";


// assets
import React, { useEffect, useState } from "react";
import { message, Upload, } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getmanageProdCom, getprodComDetail } from "@app/redux/prodCom/slice";
import useFetchProdComDetail from "@app/hooks/selector/useFetchProdComDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { ProdComSchema } from "@app/components/forms/@schemas/prodComSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLDsagent from "@app/hooks/selector/useFetchDDLDsAgent";
import SubHeader from "@app/components/common/Header/SubHeader";
import useFetchDDLTransCode from "@app/hooks/selector/useFetchDDLTransCode";


export default function prodComForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Product Comission" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchProdComDetail(id);
  const prodCode = String(router.query?.prodCode);

  const initialValues = {
    psprdcde: prodCode,
    pscomstp: null,
    pscomdsg: "",
    pscomfyr: null,
    pscomsyr: null,
    pscomtyr: null,
    pscomofy: null,
    pscomosy: null,
    pscomoty: null,
    pscomefd: null,
    pscomsts: true,
    pscomstd: null,
    pscomftc: '',
    pscomstc: '',
    pscomttc: '',
    pscomoct: '',
    pscomost: '',
    pscomott: '',
    pscombbn: false,
    pscombbt: '',
    pscombbp: null,

  };

  const [dsagent, hh, hhs] = useFetchDDLDsagent();
  const [trancode] = useFetchDDLTransCode();

  const [ddlData] = useFetchDDL({ code: ["SALETYPE", "YESORNO"] });

  const handleStatusChange = () => {
    formik.setFieldValue("pscomsts", !formik.values.pscomsts);
  };
  const handleStatusChange2 = () => {
    formik.setFieldValue("pscombbn", !formik.values.pscombbn);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ProdComSchema,
    onSubmit: (values) => {
      
      onSubmit(values);
    },
  });

  const formatToTwoDecimals = (value: any) => {
    const numericValue = Number(value); // Convert to number
    return isNaN(numericValue) ? value : numericValue.toFixed(2); // Handle non-numeric values
  };

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.id,
        pscomefd: dayjs(detailData?.pscomefd),
        pscomsts: detailData?.pscomsts == 'Y' ? true : false,
        pscombbn: detailData?.pscombbn == 'Y' ? true : false,
        pscomfyr: formatToTwoDecimals(detailData?.pscomfyr ),
        pscomsyr: formatToTwoDecimals(detailData?.pscomsyr ),
        pscomtyr: formatToTwoDecimals(detailData?.pscomtyr ),
        pscomofy: formatToTwoDecimals(detailData?.pscomofy ),
        pscomosy: formatToTwoDecimals(detailData?.pscomosy ),
        pscomoty: formatToTwoDecimals(detailData?.pscomoty ),
      });
    }
  }, [detailData]);

  const tabIndex = String(router.query?.tabIndex)

 

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: getmanageProdCom({
        id: mode === "EDIT" ? data.id : "", ...data,
        pscomsts: formik.values.pscomsts ? "Y" : "N",
        pscombbn: formik.values.pscombbn ? "Y" : "N",

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
          pathname: "/prod/Detail",
          query: {
            id: prodCode,
            tabIndex,
            mode: "EDIT"
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
            Agent Commission Detail
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Trust Fund Product",
              href: `/prod`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Product Detail",
              href: `/prod/Detail?id=${prodCode}&mode=EDIT`
            },
            {
              title: "Agent Commsion Detail (" + mode + ")",
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
              buttonDefaultType={"BACK"} onclick={() =>
                router.push({
                  pathname: "/prod/Detail",
                  query: {
                    id: prodCode,
                    mode: "EDIT",
                    tabIndex,
                  },
                })

              }




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
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="psprdcde"
                isInvalid={Boolean(formik.errors.psprdcde) && Boolean(formik.touched.psprdcde)}
                isReadOnly
              >
                {/* <FormLabel>Transaction Code*</FormLabel> */}
                <CustomFormLabel labelText="Product Code" />
                <Input
                  placeholder={"Enter Product Code"}
                  type="text"
                  name="psprdcde"
                  onChange={formik.handleChange}
                  value={formik.values.psprdcde}
                  isDisabled

                />
                {formik.errors.psprdcde && (
                  <FormErrorMessage>{formik.errors.psprdcde}</FormErrorMessage>
                )}
              </FormControl>
              {/* <div className="flex flex-col sm:flex-row gap-6"> */}

              <FormControl
                id="pscomdsg"
                isInvalid={
                  Boolean(formik.errors.pscomdsg) &&
                  Boolean(formik.touched.pscomdsg)
                }
              >
                <CustomFormLabel labelText="Designation Agent" />
                <Select
                  placeholder="Please Select Agent Designation"
                  value={formik.values.pscomdsg}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "EDIT" ? true : false}
                >
                  {Array.isArray(dsagent) &&
                    dsagent.map((option: any) => (
                      <option
                        key={option.psdsgcde}
                        value={option.psdsgcde}
                      >
                        {option.psdsgcde + " - " + option.psdsgdsc}
                      </option>
                    ))}
                </Select>
                {formik.errors.pscomdsg && (
                  <FormErrorMessage>
                    {formik.errors.pscomdsg}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pscomstp"
                isInvalid={Boolean(formik.errors.pscomstp) && Boolean(formik.touched.pscomstp)}
                isReadOnly={mode === "EDIT" ? true : false}
              >
                {/* <FormLabel>Sales Type*</FormLabel> */}
                <CustomFormLabel labelText="Sales Type" />
                <Select
                  placeholder="Select Sales Type"
                  value={formik.values.pscomstp || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                  isDisabled={mode === "EDIT" ? true : false}
                >
                  {ddlData?.SALETYPE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pscomstp && (
                  <FormErrorMessage>{formik.errors.pscomstp}</FormErrorMessage>
                )}
              </FormControl>
              {/* </div> */}
              <FormControl
                id="pscomefd"
                isInvalid={Boolean(formik.errors.pscomefd) && Boolean(formik.touched.pscomefd)}
              >
                {/* <FormLabel>Invoice Date</FormLabel> */}
                <CustomFormLabel labelText="Effective Date" />

                < DatePicker
                  value={formik.values.pscomefd?formik.values.pscomefd: dayjs()} format={"DD/MM/YYYY"} onChange={(date: any) => formik.setFieldValue('pscomefd', date)} className="w-full" />

                {formik.errors.pscomefd && (
                  <FormErrorMessage>
                    {formik.errors.pscomefd && "Invalid Date"}
                  </FormErrorMessage>
                )}
              </FormControl>



            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">

              {/* <FormControl
                id="pscomefd"
                isInvalid={
                  Boolean(formik.errors.pscomefd) &&
                  Boolean(formik.touched.pscomefd)
                }
              >
                <CustomFormLabel labelText="Effective Date" />
                <DatePicker
                  id="pscomefd"
                  name="pscomefd"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  value={
                    formik.values.pscomefd
                      ? dayjs(formik.values.pscomefd)
                      : dayjs()
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "pscomefd" },
                    })
                  }
                  inputReadOnly={mode == "VIEW" ? true : false}
                  open={mode == "VIEW" ? false : undefined}
                  allowClear={mode == "VIEW" ? false : true}
                />
                {formik.errors.pscomefd && (
                  <FormErrorMessage>
                    {formik.errors.pscomefd}
                  </FormErrorMessage>
                )}
              </FormControl> */}
              {/* <SubHeader labelText="Personal Sales Commision"/> */}
              <Flex alignItems={"center"} flexDirection={"row"} >
                <Divider orientation='vertical' height={"15px"}
                  borderWidth="2px" borderColor="#6392D6" mr={2} opacity={"100%"} />

                <Text fontSize="15pt" fontWeight={"500"} color={"#6392D6"}>
                  Personal Sales Commision
                </Text>
              </Flex>

              <Box display="flex" flexDir="row" gap={6} width="100%">

                <FormControl
                  id="pscomfyr"
                  isInvalid={Boolean(formik.errors.pscomfyr) && Boolean(formik.touched.pscomfyr)}
                >
                  {
                    formik.values.pscomsts ? <CustomFormLabel labelText="First Year" /> : <FormLabel>First Year</FormLabel>

                  }
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscomfyr"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscomfyr)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscomfyr",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscomfyr && (
                    <FormErrorMessage>{formik.errors.pscomfyr}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscomsyr"
                  isInvalid={Boolean(formik.errors.pscomsyr) && Boolean(formik.touched.pscomsyr)}
                >
                  <FormLabel>Second Year</FormLabel>
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscomsyr"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscomsyr)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscomsyr",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscomsyr && (
                    <FormErrorMessage>{formik.errors.pscomsyr}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pscomtyr"
                  isInvalid={Boolean(formik.errors.pscomtyr) && Boolean(formik.touched.pscomtyr)}
                >
                  <FormLabel>Third Year</FormLabel>
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscomtyr"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscomtyr)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscomtyr",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscomtyr && (
                    <FormErrorMessage>{formik.errors.pscomtyr}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" flexDir="row" gap={6} width="100%">

                <FormControl
                  id="pscomftc"
                  isInvalid={
                    Boolean(formik.errors.pscomftc) &&
                    Boolean(formik.touched.pscomftc)
                  }
                >
                  {formik.values.pscomsts ? <CustomFormLabel labelText="Transaction Code" /> : <FormLabel>Transaction Code</FormLabel>}
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscomftc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscomftc && (
                    <FormErrorMessage>
                      {formik.errors.pscomftc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscomstc"
                  isInvalid={
                    Boolean(formik.errors.pscomstc) &&
                    Boolean(formik.touched.pscomstc)
                  }
                >
                  {
                    formik.values.pscomsyr == null || formik.values.pscomsyr == 0 ? <FormLabel>Transaction Code</FormLabel> : <CustomFormLabel labelText="Transaction Code" />
                  }
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscomstc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.values.pscomsyr == null ? true : false}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscomstc && (
                    <FormErrorMessage>
                      {formik.errors.pscomstc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscomttc"
                  isInvalid={
                    Boolean(formik.errors.pscomttc) &&
                    Boolean(formik.touched.pscomttc)
                  }
                >
                  {
                    formik.values.pscomtyr == null || formik.values.pscomtyr == 0 ? <FormLabel>Transaction Code</FormLabel> : <CustomFormLabel labelText="Transaction Code" />
                  }
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscomttc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.values.pscomtyr == null ? true : false}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscomttc && (
                    <FormErrorMessage>
                      {formik.errors.pscomttc}
                    </FormErrorMessage>
                  )}
                </FormControl>

              </Box>
              {/* <SubHeader labelText="Overriding Sales Commision"/> */}
              <Flex alignItems={"center"} flexDirection={"row"} >
                <Divider orientation='vertical' height={"15px"}
                  borderWidth="2px" borderColor="#6392D6" mr={2} opacity={"100%"} />

                <Text fontSize="15pt" fontWeight={"500"} color={"#6392D6"}>
                  Overriding Sales Commision
                </Text>
              </Flex>
              <Box display="flex" flexDir="row" gap={6} width="100%">

                <FormControl
                  id="pscomofy"
                  isInvalid={Boolean(formik.errors.pscomofy) && Boolean(formik.touched.pscomofy)}
                >
                  <FormLabel>First Year</FormLabel>
                  {/* <CustomFormLabel labelText="First Year" /> */}

                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscomofy"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscomofy)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscomofy",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscomofy && (
                    <FormErrorMessage>{formik.errors.pscomofy}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscomosy"
                  isInvalid={Boolean(formik.errors.pscomosy) && Boolean(formik.touched.pscomosy)}
                >
                  <FormLabel>Second Year</FormLabel>
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscomosy"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscomosy)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscomosy",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscomosy && (
                    <FormErrorMessage>{formik.errors.pscomosy}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="pscomoty"
                  isInvalid={Boolean(formik.errors.pscomoty) && Boolean(formik.touched.pscomoty)}
                >
                  <FormLabel>Third Year</FormLabel>
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscomoty"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscomoty)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscomoty",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscomoty && (
                    <FormErrorMessage>{formik.errors.pscomoty}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box display="flex" flexDir="row" gap={6} width="100%">


                <FormControl
                  id="pscomoct"
                  isInvalid={
                    Boolean(formik.errors.pscomoct) &&
                    Boolean(formik.touched.pscomoct)
                  }
                >
                  {
                    formik.values.pscomofy == null || formik.values.pscomofy == 0 ? <FormLabel>Transaction Code</FormLabel> : <CustomFormLabel labelText="Transaction Code" />
                  }
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscomoct}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.values.pscomofy == null ? true : false}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscomoct && (
                    <FormErrorMessage>
                      {formik.errors.pscomoct}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscomost"
                  isInvalid={
                    Boolean(formik.errors.pscomost) &&
                    Boolean(formik.touched.pscomost)
                  }
                >
                  {
                    formik.values.pscomosy == null || formik.values.pscomosy == 0 ? <FormLabel>Transaction Code</FormLabel> : <CustomFormLabel labelText="Transaction Code" />
                  }
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscomost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.values.pscomosy == null ? true : false}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscomost && (
                    <FormErrorMessage>
                      {formik.errors.pscomost}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscomott"
                  isInvalid={
                    Boolean(formik.errors.pscomott) &&
                    Boolean(formik.touched.pscomott)
                  }
                >
                  {
                    formik.values.pscomoty == null || formik.values.pscomoty == 0 ? <FormLabel>Transaction Code</FormLabel> : <CustomFormLabel labelText="Transaction Code" />
                  }
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscomott}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.values.pscomoty == null ? true : false}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscomott && (
                    <FormErrorMessage>
                      {formik.errors.pscomott}
                    </FormErrorMessage>
                  )}
                </FormControl>

              </Box>
              <div className="flex flex-col sm:flex-row gap-6">

                {
                  // mode !== 'ADD' && 
                  (
                    <FormControl
                      id="pscomsts"
                      isInvalid={Boolean(formik.errors.pscomsts) && Boolean(formik.touched.pscomsts)}
                    >
                      <FormLabel>Commission Status</FormLabel>
                      <Switch
                        id="pscomsts"
                        name="pscomsts"
                        isChecked={formik.values.pscomsts}
                        onChange={handleStatusChange}
                        onBlur={formik.handleBlur}
                        size="md"
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                      />
                      {formik.errors.pscomsts && (
                        <FormErrorMessage>
                          {formik.errors.pscomsts}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}  {
                  // mode !== 'ADD' && 
                  (

                    <FormControl
                      id="pscomstd"
                      isInvalid={
                        Boolean(formik.errors.pscomstd) &&
                        Boolean(formik.touched.pscomstd)
                      }
                      isReadOnly={true}
                    >
                      <CustomFormLabel labelText="Status Date" />
                      <DatePicker
                        id="pscomstd"
                        name="pscomstd"
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        value={
                          formik.values.pscomstd
                            ? dayjs(formik.values.pscomstd)
                            : dayjs()
                        }
                        // onChange={(value) =>
                        //   formik.handleChange({
                        //     target: { value, name: "pscomstd" },
                        //   })
                        // }
                        inputReadOnly
                        open={false}
                        allowClear={false}
                        disabled
                      />
                      {/* {formik.errors.pscomstd && (
                        <FormErrorMessage>
                          {formik.errors.pscomstd}
                        </FormErrorMessage>
                      )} */}
                    </FormControl>
                  )
                }
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <FormControl
                  id="pscombbn"
                  isInvalid={Boolean(formik.errors.pscombbn) && Boolean(formik.touched.pscombbn)}
                >
                  <FormLabel>Builder Bonus</FormLabel>
                  <Switch
                    id="pscombbn"
                    name="pscombbn"
                    isChecked={formik.values.pscombbn}
                    onChange={handleStatusChange2}
                    onBlur={formik.handleBlur}
                    size="md"
                    colorScheme={"green"}
                    sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                  />
                  {formik.errors.pscombbn && (
                    <FormErrorMessage>
                      {formik.errors.pscombbn}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscombbp"
                  isInvalid={Boolean(formik.errors.pscombbp) && Boolean(formik.touched.pscombbp)}
                >

                  {
                    !formik.values.pscombbn ? <FormLabel>Builder Bonus %</FormLabel> : <CustomFormLabel labelText="Builder Bonus %" />
                  }
                  {/* <CustomFormLabel labelText="First Year" /> */}

                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="pscombbp"
                        // placeholder="Enter referee amount"
                        value={numberWithCommas(formik.values.pscombbp)}
                        pattern={numberPattern}
                        isDisabled={!formik.values.pscombbn}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "pscombbp",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.pscombbp && (
                    <FormErrorMessage>{formik.errors.pscombbp}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="pscombbt"
                  isInvalid={
                    Boolean(formik.errors.pscombbt) &&
                    Boolean(formik.touched.pscombbt)
                  }
                >
                  {
                    !formik.values.pscombbn ? <FormLabel>Transaction Code</FormLabel> : <CustomFormLabel labelText="Transaction Code" />
                  }
                  <Select
                    placeholder="Please Select Transaction Code"
                    value={formik.values.pscombbt}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={!formik.values.pscombbn ? true : false}
                  >
                    {Array.isArray(trancode) &&
                      trancode.map((option: any) => (
                        <option
                          key={option.pstrnscd}
                          value={option.pstrnscd}
                        >
                          {option.pstrnscd + " - " + option.pstrndsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.pscombbt && (
                    <FormErrorMessage>
                      {formik.errors.pscombbt}
                    </FormErrorMessage>
                  )}
                </FormControl>

              </div>
            </Box>









          </div>
        </Box>
      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.push({
                pathname: "/prod/Detail",
                query: {
                  id: prodCode,
                  tabIndex,
                  mode: "EDIT"

                },
              })
              }
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

