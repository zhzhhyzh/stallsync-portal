// Chakra imports
import Colors from "@app/constants/Colors";
import {
  numberWithCommas,
  numberPattern,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  FormControl, Stack,
  InputGroup,
  FormLabel,
  FormErrorMessage, RadioGroup, Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Checkbox,
  Switch, Divider
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
import { getmanageDsagent, getdsagentDetail } from "@app/redux/dsagent/slice";
import useFetchDsagentDetail from "@app/hooks/selector/useFetchDsagentDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { DsagentSchema } from "@app/components/forms/@schemas/dsagentSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import SubHeader from "@app/components/common/Header/SubHeader";
import useFetchDDLDsagent from "@app/hooks/selector/useFetchDDLDsAgent";



export default function DsagentForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Agent Designation" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchDsagentDetail(id);
  const [dsagent, hh, hha] = useFetchDDLDsagent();
  const handleStatusChange = () => {
    formik.setFieldValue("psdsgsts", !formik.values.psdsgsts);
  };

  const handleStatusChange2 = () => {
    formik.setFieldValue("psdsgtue", !formik.values.psdsgtue);
  };
  const handleStatusChange3 = () => {
    formik.setFieldValue("psdsgmid", !formik.values.psdsgmid);
  };
  const initialValues = {
    psdsgcde: null,
    psdsgsqn: null,
    psdsgdsc: null,
    psdsglds: null,
    psdsgpre: null,
    psdsgsts: true,
    psdsgtue: true,
    psdsgmid: true,
    psdsgstd: null,
    psdsgvfq: null,
    psdsgvfv: null,
    psdsgagf: null,
    psdsgaft: null,
    psdsgmts: null,

    //Uplevel
    psdsgugs: null,
    psdsgups: null,
    psdsgusd: null,
    psdsgunr: null,
    psdsguss: null,
    psdsgupn: null,
    psdsgupr: null,
    psdsgsst: null,
    psdsgnst: null,

    //Maintain
    psdsgmgs: null,
    psdsgmps: null,
    psdsgmsd: null,
    psdsgmnr: null,
    psdsgmss: null,
    psdsgmdr: null,
    psdsgmpn: null,
    psdsgmpr: null,
    psdsgmpd: null,
    psdsgmmt: null,
    psdsgmnt: null,


  };


  const [ddlData] = useFetchDDL({ code: ["FEETYPE", "YESORNO", "TERMS", "SALETYPE"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: DsagentSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psdsgcde,
        psdsgsts: detailData.psdsgsts == "Y" ? true : false,
        psdsgtue: detailData.psdsgtue == "Y" ? true : false,
        psdsgmid: detailData.psdsgmid == "Y" ? true : false,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getmanageDsagent({
        id: mode === "EDIT" ? data.id : "", ...data,
        psdsgsqn: Number(formik.values.psdsgsqn) ? Number(formik.values.psdsgsqn) : 1,
        psdsgsts: formik.values.psdsgsts ? "Y" : "N",
        psdsgtue: formik.values.psdsgtue ? "Y" : "N",
        psdsgmid: formik.values.psdsgmid ? "Y" : "N",
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
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Agent Designation
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Designation Agent",
              href: `/dsagent`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Agent Designation (" + mode + ")",
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
                id="psdsgcde"
                isInvalid={Boolean(formik.errors.psdsgcde) && Boolean(formik.touched.psdsgcde)}
                isReadOnly={mode === "VIEW" || mode === "EDIT" ? true : false}
              >
                {/* <FormLabel>Agent Designation*</FormLabel> */}
                <CustomFormLabel labelText="Agent Desgination Code" />
                <Input
                  placeholder={"Enter Agent Desgination Code"}
                  type="text"
                  name="psdsgcde"
                  onChange={formik.handleChange}
                  value={formik.values.psdsgcde || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.psdsgcde && (
                  <FormErrorMessage>{formik.errors.psdsgcde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psdsgdsc"
                isInvalid={Boolean(formik.errors.psdsgdsc) && Boolean(formik.touched.psdsgdsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description" />
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="psdsgdsc"
                  onChange={formik.handleChange}
                  value={formik.values.psdsgdsc || ""}
                />
                {formik.errors.psdsgdsc && (
                  <FormErrorMessage>{formik.errors.psdsgdsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psdsglds"
                isInvalid={Boolean(formik.errors.psdsglds) && Boolean(formik.touched.psdsglds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                {/* <CustomFormLabel labelText="Local Description" /> */}
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="psdsglds"
                  onChange={formik.handleChange}
                  value={formik.values.psdsglds || ""}
                />
                {formik.errors.psdsglds && (
                  <FormErrorMessage>{formik.errors.psdsglds}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psdsgsqn"
                isInvalid={Boolean(formik.errors.psdsgsqn) && Boolean(formik.touched.psdsgsqn)}
              >
                <FormLabel>Tier Sequence</FormLabel>
                <Stack spacing={4}>
                  <InputGroup>
                    <Input
                      type="text"
                      name="psdsgsqn"
                      placeholder="Enter Tier Sequence"
                      value={numberWithCommas(formik.values.psdsgsqn)}
                      pattern={numberPattern}
                      onChange={(event) => {
                        const value = event.target.value;

                        // Check if the value is a valid number or empty
                        if (!value || /^[0-9.,]*$/.test(value)) {
                          formik.handleChange({
                            target: {
                              value: parseThousandsToNumber(value),
                              name: "psdsgsqn",
                            },
                          });
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                </Stack>
                {formik.errors.psdsgsqn && (
                  <FormErrorMessage>{formik.errors.psdsgsqn}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psdsgpre"
                isInvalid={Boolean(formik.errors.psdsgpre) && Boolean(formik.touched.psdsgpre)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Designation Prefix</FormLabel>
                {/* <CustomFormLabel labelText="Local Description" /> */}
                <Input
                  placeholder={"Enter Designation Prefix"}
                  type="text"
                  name="psdsgpre"
                  onChange={formik.handleChange}
                  value={formik.values.psdsgpre || ""}
                />
                {formik.errors.psdsgpre && (
                  <FormErrorMessage>{formik.errors.psdsgpre}</FormErrorMessage>
                )}
              </FormControl>



            </Box>
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <div className="flex flex-col sm:flex-row gap-6">

                {
                  // mode !== 'ADD' && (
                  <FormControl
                    id="psdsgsts"
                    isInvalid={Boolean(formik.errors.psdsgsts) && Boolean(formik.touched.psdsgsts)}
                  >
                    <FormLabel>Active</FormLabel>
                    <Switch
                      id="psdsgsts"
                      name="psdsgsts"
                      isChecked={formik.values.psdsgsts}
                      onChange={handleStatusChange}
                      onBlur={formik.handleBlur}
                      size="md"
                      colorScheme={"green"}
                      sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                    />
                    {formik.errors.psdsgsts && (
                      <FormErrorMessage>
                        {formik.errors.psdsgsts}
                      </FormErrorMessage>
                    )}
                  </FormControl>


                  // )
                }



                {/* {mode === "EDIT" ?  */}
                <FormControl
                  id="psdsgstd"
                  isInvalid={Boolean(formik.errors.psdsgstd) && Boolean(formik.touched.psdsgstd)}
                >
                  <FormLabel>Status Date</FormLabel>
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik.values.psdsgstd == detailData.psdsgstd
                        ? dayjs(detailData.psdsgstd)
                        : dayjs(new Date())
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psdsgstd" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    disabled={true}
                  />
                  {formik.errors.psdsgstd && (
                    <FormErrorMessage>{formik.errors.psdsgstd}</FormErrorMessage>
                  )}
                </FormControl>
                {/* : null   } */}
              </div>
              <FormControl
                id="psdsgmts"
                isInvalid={Boolean(formik.errors.psdsgmts) && Boolean(formik.touched.psdsgmts)}
              >
                <FormLabel>Maintain Sales (Annual)</FormLabel>
                <Stack spacing={4}>
                  <InputGroup>
                    <Input
                      type="text"
                      name="psdsgmts"
                      placeholder="Enter Maintain Sales (Annual)"
                      value={numberWithCommas(formik.values.psdsgmts)}
                      pattern={numberPattern}
                      onChange={(event) => {
                        const value = event.target.value;

                        // Check if the value is a valid number or empty
                        if (!value || /^[0-9.,]*$/.test(value)) {
                          formik.handleChange({
                            target: {
                              value: parseThousandsToNumber(value),
                              name: "psdsgmts",
                            },
                          });
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                </Stack>
                {formik.errors.psdsgmts && (
                  <FormErrorMessage>{formik.errors.psdsgmts}</FormErrorMessage>
                )}
              </FormControl>
              <div className="flex flex-col sm:flex-row gap-6">
                <FormControl
                  id="psdsgvfq"
                  isInvalid={Boolean(formik.errors.psdsgvfq) && Boolean(formik.touched.psdsgvfq)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Validity Frequency" />
                  <Input
                    placeholder={"Enter Validity Frequency"}
                    type="text"
                    name="psdsgvfq"
                    onChange={formik.handleChange}
                    value={formik.values.psdsgvfq || ""}
                  />
                  {formik.errors.psdsgvfq && (
                    <FormErrorMessage>{formik.errors.psdsgvfq}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psdsgvfv"
                  isInvalid={Boolean(formik.errors.psdsgvfv) && Boolean(formik.touched.psdsgvfv)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Validity Term" />
                  <Select
                    placeholder="Select Validity Term"
                    value={formik.values.psdsgvfv || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  // isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.TERMS?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psdsgvfv && (
                    <FormErrorMessage>{formik.errors.psdsgvfv}</FormErrorMessage>
                  )}
                </FormControl>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">

                <FormControl
                  id="psdsgagf"
                  isInvalid={Boolean(formik.errors.psdsgagf) && Boolean(formik.touched.psdsgagf)}
                >
                  <FormLabel>Agent Fee</FormLabel>
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="psdsgagf"
                        placeholder="Enter Agent Fee"
                        value={numberWithCommas(formik.values.psdsgagf)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "psdsgagf",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.psdsgagf && (
                    <FormErrorMessage>{formik.errors.psdsgagf}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psdsgaft"
                  isInvalid={Boolean(formik.errors.psdsgaft) && Boolean(formik.touched.psdsgaft)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Agent fee Type*</FormLabel> */}
                  <CustomFormLabel labelText="Agent Fee Type" />
                  <Select
                    placeholder="Select Agent fee Type"
                    value={formik.values.psdsgaft || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  // isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.FEETYPE?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psdsgaft && (
                    <FormErrorMessage>{formik.errors.psdsgaft}</FormErrorMessage>
                  )}
                </FormControl>
              </div>



            </Box>
          </div>



        </Box>
      </Card>
      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >

        {/* <Text fontSize="19pt" fontWeight={"500"}  >
          Promotion Eligibility Rules
        </Text> */}
        <SubHeader className="no-wrap" labelText="Promotion Eligibility Rules" />


        <FormControl
          id="psdsgtue"
          isInvalid={Boolean(formik.errors.psdsgtue) && Boolean(formik.touched.psdsgtue)}
        >
          <Flex alignItems="center" >
            <FormLabel mb={5}>Tier Up Eligibility</FormLabel>
            <Switch
              id="psdsgtue"
              name="psdsgtue"
              isChecked={formik.values.psdsgtue}
              onChange={handleStatusChange2}
              onBlur={formik.handleBlur}
              size="md"
              colorScheme="green"
              sx={{
                'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER },
              }}
            />
          </Flex>
          {formik.errors.psdsgtue && (
            <FormErrorMessage>{formik.errors.psdsgtue}</FormErrorMessage>
          )}
        </FormControl>


        <div className="flex flex-col sm:flex-row gap-6">

          <Box display="flex" flexDir="column" gap={6} width="100%">
            <FormControl
              id="psdsgugs"
              isInvalid={Boolean(formik.errors.psdsgugs) && Boolean(formik.touched.psdsgugs)}
            >
             {formik.values.psdsgtue? <CustomFormLabel labelText="Group Sales"/>: <FormLabel>Group Sales</FormLabel>} 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgugs"
                    placeholder="Group Sales"
                    value={numberWithCommas(formik.values.psdsgugs)}
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgugs",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgugs && (
                <FormErrorMessage>{formik.errors.psdsgugs}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgunr"
              isInvalid={Boolean(formik.errors.psdsgunr) && Boolean(formik.touched.psdsgunr)}
            >
               {formik.values.psdsgtue? <CustomFormLabel labelText="New Recruits"/>: <FormLabel>New Recruits</FormLabel>  } 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    name="psdsgunr"
                    placeholder="Enter New Recruits"
                    value={numberWithCommas(formik.values.psdsgunr)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgunr",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgunr && (
                <FormErrorMessage>{formik.errors.psdsgunr}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              id="psdsgupn"
              isInvalid={Boolean(formik.errors.psdsgupn) && Boolean(formik.touched.psdsgupn)}
            >
               {formik.values.psdsgtue? <CustomFormLabel labelText="No. of Promotion"/>:<FormLabel>No. of Promotion</FormLabel>   } 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    name="psdsgupn"
                    placeholder="Enter No. of Promotion"
                    value={numberWithCommas(formik.values.psdsgupn)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgupn",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgupn && (
                <FormErrorMessage>{formik.errors.psdsgupn}</FormErrorMessage>
              )}
            </FormControl>

          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">

            <FormControl
              id="psdsgups"
              isInvalid={Boolean(formik.errors.psdsgups) && Boolean(formik.touched.psdsgups)}
            >
             {formik.values.psdsgtue? <CustomFormLabel labelText="Personal Sales"/>:   <FormLabel>Personal Sales</FormLabel> } 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    name="psdsgups"
                    placeholder="Enter Personal Sales"
                    value={numberWithCommas(formik.values.psdsgups)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgups",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgups && (
                <FormErrorMessage>{formik.errors.psdsgups}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsguss"
              isInvalid={Boolean(formik.errors.psdsguss) && Boolean(formik.touched.psdsguss)}
            >
             {formik.values.psdsgtue? <CustomFormLabel labelText="No. Of Sales"/>:  <FormLabel>No. Of Sales</FormLabel>  } 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    type="text"
                    name="psdsguss"
                    placeholder="Enter No. of Sales"
                    value={numberWithCommas(formik.values.psdsguss)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsguss",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsguss && (
                <FormErrorMessage>{formik.errors.psdsguss}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgupr"
              isInvalid={Boolean(formik.errors.psdsgupr) && Boolean(formik.touched.psdsgupr)}
              isReadOnly={mode === "VIEW" ? true : false}
            >
               {formik.values.psdsgtue? <CustomFormLabel labelText="Promotion Designation" className="nowrap"/>:  <FormLabel style={{ whiteSpace: "nowrap" }}>Promotion Designation</FormLabel>} 
              {/* <Select
                placeholder="Select Promotion Designation"
                value={formik.values.psdsgupr || ""}
                onChange={formik.handleChange}
                style={{
                  fontSize: 14,
                }}
              // isDisabled={mode === "VIEW" ? true : false}
              >
                {ddlData?.PRDSG?.map((option: DDL_TYPES) => ( //change code
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select> */}
              <Select
                placeholder="Please Select Promotion Desgination"
                value={formik.values.psdsgupr || ""}
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                
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
              {formik.errors.psdsgupr && (
                <FormErrorMessage>{formik.errors.psdsgupr}</FormErrorMessage>
              )}
            </FormControl>
          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">
            <FormControl
              id="psdsgsst"
              isInvalid={Boolean(formik.errors.psdsgsst) && Boolean(formik.touched.psdsgsst)}
              isReadOnly={mode === "VIEW" ? true : false}
            >
               {formik.values.psdsgtue? <CustomFormLabel labelText="Sales Type"/>: <FormLabel>Sales Type</FormLabel> } 
              {/* <CustomFormLabel labelText="Sales Type" /> */}
              <Select
                placeholder="Select Sales Type"
                value={formik.values.psdsgsst || ""}
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    onChange={formik.handleChange}
                style={{
                  fontSize: 14,
                }}
              // isDisabled={mode === "VIEW" ? true : false}
              >
                {ddlData?.SALETYPE?.map((option: DDL_TYPES) => ( //change code
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select>
              {formik.errors.psdsgsst && (
                <FormErrorMessage>{formik.errors.psdsgsst}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgnst"
              isInvalid={Boolean(formik.errors.psdsgnst) && Boolean(formik.touched.psdsgnst)}
              isReadOnly={mode === "VIEW" ? true : false}
            >
              {formik.values.psdsgtue? <CustomFormLabel labelText="Sales Type"/>:  <FormLabel>Sales Type</FormLabel> } 
              {/* <CustomFormLabel labelText="Sales Type" /> */}
              <Select
                placeholder="Select Sales Type"
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    value={formik.values.psdsgnst || ""}
                onChange={formik.handleChange}
                style={{
                  fontSize: 14,
                }}
              // isDisabled={mode === "VIEW" ? true : false}
              >
                {ddlData?.SALETYPE?.map((option: DDL_TYPES) => ( //change code
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select>
              {formik.errors.psdsgnst && (
                <FormErrorMessage>{formik.errors.psdsgnst}</FormErrorMessage>
              )}
            </FormControl>

          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">

            <FormControl
              id="psdsgusd"
              isInvalid={Boolean(formik.errors.psdsgusd) && Boolean(formik.touched.psdsgusd)}
            >
               {formik.values.psdsgtue? <CustomFormLabel labelText="Duration (Month)"/>:  <FormLabel>Duration (Month)</FormLabel> } 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgusd"
                    placeholder="Enter Duration (Month)"
                    isDisabled={mode=="VIEW" || !formik.values.psdsgtue}
                    value={numberWithCommas(formik.values.psdsgusd)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgusd",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgusd && (
                <FormErrorMessage>{formik.errors.psdsgusd}</FormErrorMessage>
              )}
            </FormControl>
            {/* 

           */}
          </Box>

        </div>
      </Card>
      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >

        <SubHeader labelText="Maintaining Level Eligibility Rules"/>
        <FormControl
          id="psdsgmid"
          isInvalid={Boolean(formik.errors.psdsgmid) && Boolean(formik.touched.psdsgmid)}
        >
          <Flex alignItems="center" >
            <FormLabel mb={5}>Maintaining Level Eligibility</FormLabel>
            <Switch
              id="psdsgmid"
              name="psdsgmid"
              isChecked={formik.values.psdsgmid}
              onChange={handleStatusChange3}
              onBlur={formik.handleBlur}
              size="md"
              colorScheme="green"
              sx={{
                'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER },
              }}
            />
          </Flex>
          {formik.errors.psdsgmid && (
            <FormErrorMessage>{formik.errors.psdsgmid}</FormErrorMessage>
          )}
        </FormControl>

        <div className="flex flex-col sm:flex-row gap-6">
          <Box display="flex" flexDir="column" gap={6} width="100%">
            <FormControl
              id="psdsgmgs"
              isInvalid={Boolean(formik.errors.psdsgmgs) && Boolean(formik.touched.psdsgmgs)}
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}

            >
             {formik.values.psdsgmid?<CustomFormLabel labelText="Group Sales"/>: <FormLabel>Group Sales</FormLabel>} 
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgmgs"
                    placeholder="Group Sales"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    value={numberWithCommas(formik.values.psdsgmgs)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmgs",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmgs && (
                <FormErrorMessage>{formik.errors.psdsgmgs}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgmnr"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmnr) && Boolean(formik.touched.psdsgmnr)}
            >
              
              {formik.values.psdsgmid?<CustomFormLabel labelText="New Recruits"/>: <FormLabel>New Recruits</FormLabel>}
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgmnr"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    placeholder="Enter New Recruits"
                    value={numberWithCommas(formik.values.psdsgmnr)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmnr",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmnr && (
                <FormErrorMessage>{formik.errors.psdsgmnr}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              id="psdsgmpn"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmpn) && Boolean(formik.touched.psdsgmpn)}
            >
              {formik.values.psdsgmid?<CustomFormLabel labelText="No. of Promotion"/>: <FormLabel>No. of Promotion</FormLabel>  }
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgmpn"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    placeholder="Enter No. of Promotion"
                    value={numberWithCommas(formik.values.psdsgmpn)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmpn",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmpn && (
                <FormErrorMessage>{formik.errors.psdsgmpn}</FormErrorMessage>
              )}
            </FormControl>

          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">

            <FormControl
              id="psdsgmps"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmps) && Boolean(formik.touched.psdsgmps)}
            >
              {formik.values.psdsgmid?<CustomFormLabel labelText="Personal Sales"/>:  <FormLabel>Personal Sales</FormLabel> }
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    type="text"
                    name="psdsgmps"
                    placeholder="Enter Personal Sales"
                    value={numberWithCommas(formik.values.psdsgmps)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmps",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmps && (
                <FormErrorMessage>{formik.errors.psdsgmps}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgmss"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmss) && Boolean(formik.touched.psdsgmss)}
            >
               {formik.values.psdsgmid?<CustomFormLabel labelText="No. Of Sales"/>:<FormLabel>No. Of Sales</FormLabel>  }
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgmss"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    placeholder="Enter No. of Sales"
                    value={numberWithCommas(formik.values.psdsgmss)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmss",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmss && (
                <FormErrorMessage>{formik.errors.psdsgmss}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgmpr"
              isInvalid={Boolean(formik.errors.psdsgmpr) && Boolean(formik.touched.psdsgmpr)}
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}

            >
               {formik.values.psdsgmid?<CustomFormLabel className="nowrap" labelText="Promotion Designation"/>: <FormLabel style={{ whiteSpace: "nowrap" }}>Promotion Designation</FormLabel> }
              {/* <Select
                placeholder="Select Promotion Designation"
                value={formik.values.psdsgmpr || ""}
                onChange={formik.handleChange}
                style={{
                  fontSize: 14,
                }}
              // isDisabled={mode === "VIEW" ? true : false}
              >
                {ddlData?.PRDSG?.map((option: DDL_TYPES) => ( //change code
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select> */}
              <Select
                placeholder="Please Select Promotion Desgination"
                value={formik.values.psdsgmpr || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isDisabled={mode === "VIEW" || !formik.values.psdsgmid}

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
              {formik.errors.psdsgmpr && (
                <FormErrorMessage>{formik.errors.psdsgmpr}</FormErrorMessage>
              )}
            </FormControl>
          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">
            <FormControl
              id="psdsgmmt"
              isInvalid={Boolean(formik.errors.psdsgmmt) && Boolean(formik.touched.psdsgmmt)}
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}

            >
              {/* <FormLabel>Sales Type*</FormLabel> */}
              {formik.values.psdsgmid?<CustomFormLabel labelText="Sales Type"/>: <FormLabel>Sales Type</FormLabel>  }

              {/* <CustomFormLabel labelText="Sales Type" /> */}
              <Select
                placeholder="Select Sales Type"
                value={formik.values.psdsgmmt || ""}
                onChange={formik.handleChange}
                style={{
                  fontSize: 14,
                }}
                isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
              // isDisabled={mode === "VIEW" ? true : false}
              >
                {ddlData?.SALETYPE?.map((option: DDL_TYPES) => ( //change code
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select>
              {formik.errors.psdsgmmt && (
                <FormErrorMessage>{formik.errors.psdsgmmt}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgmnt"
              isInvalid={Boolean(formik.errors.psdsgmnt) && Boolean(formik.touched.psdsgmnt)}
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}

            >
              {/* <FormLabel>Sales Type*</FormLabel> */}
              {/* <CustomFormLabel labelText="Sales Type" /> */}
              {formik.values.psdsgmid?<CustomFormLabel labelText="Sales Type"/>:  <FormLabel>Sales Type</FormLabel> }

              <Select
                placeholder="Select Sales Type"
                value={formik.values.psdsgmnt || ""}
                onChange={formik.handleChange}
                style={{
                  fontSize: 14,
                }}
                isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
              >
                {ddlData?.SALETYPE?.map((option: DDL_TYPES) => ( //change code
                  <option key={option.prgecode} value={option.prgecode}>
                    {option.prgedesc}
                  </option>
                ))}
              </Select>
              {formik.errors.psdsgmnt && (
                <FormErrorMessage>{formik.errors.psdsgmnt}</FormErrorMessage>
              )}
            </FormControl>

          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">

            <FormControl
              id="psdsgmsd"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmsd) && Boolean(formik.touched.psdsgmsd)}
            >
               {formik.values.psdsgmid?<CustomFormLabel labelText="Duration (Month)"/>: <FormLabel>Duration (Month)</FormLabel> }
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgmsd"
                    placeholder="Enter Duration (Month)"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    value={numberWithCommas(formik.values.psdsgmsd)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmsd",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmsd && (
                <FormErrorMessage>{formik.errors.psdsgmsd}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="psdsgmdr"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmdr) && Boolean(formik.touched.psdsgmdr)}
            >
             {formik.values.psdsgmid?<CustomFormLabel labelText="Duration (Month)"/>:  <FormLabel>Duration (Month)</FormLabel>  }
              <Stack spacing={4}>
                <InputGroup>

                  <Input
                    type="text"
                    name="psdsgmdr"
                    placeholder="Enter Duration (Month)"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    value={numberWithCommas(formik.values.psdsgmdr)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmdr",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmdr && (
                <FormErrorMessage>{formik.errors.psdsgmdr}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl
              id="psdsgmpd"
              isReadOnly={!formik.values.psdsgmid || mode == "VIEW"}
              isInvalid={Boolean(formik.errors.psdsgmpd) && Boolean(formik.touched.psdsgmpd)}
            >
               {formik.values.psdsgmid?<CustomFormLabel labelText="Duration (Month)"/>: <FormLabel>Duration (Month)</FormLabel> }
              <Stack spacing={4}>
                <InputGroup>
                  <Input
                    type="text"
                    name="psdsgmpd"
                    placeholder="Enter Duration (Month)"
                    isDisabled={mode === "VIEW" || !formik.values.psdsgmid}
                    value={numberWithCommas(formik.values.psdsgmpd)}
                    pattern={numberPattern}
                    onChange={(event) => {
                      const value = event.target.value;

                      // Check if the value is a valid number or empty
                      if (!value || /^[0-9.,]*$/.test(value)) {
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(value),
                            name: "psdsgmpd",
                          },
                        });
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                </InputGroup>
              </Stack>
              {formik.errors.psdsgmpd && (
                <FormErrorMessage>{formik.errors.psdsgmpd}</FormErrorMessage>
              )}
            </FormControl>
          </Box>

        </div>

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

