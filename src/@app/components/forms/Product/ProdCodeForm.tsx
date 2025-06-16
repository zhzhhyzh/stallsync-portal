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
// import { postRemoveFile,postUploadFile } from "@app/redux/app/slice";


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
import { getManageProdCode, getProdCodeDetail } from "@app/redux/prodCode/slice";
import useFetchProdCodeDetail from "@app/hooks/selector/useFetchProdCodeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageProdCode } from "@app/redux/prodCode/api";
import { ProdCodeAddSchema, ProdCodeUpdateSchema } from "../@schemas/prodCodeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function ProdCodeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Product Code" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const prquecde = props.prquecde;
  const mode = props.mode;
  const setLoading = props.setLoading
  const setSubmit = props.setSubmit

  useEffect(() => {
    if (mode === "EDIT")
      setLoading(loading)
  }, [loading])


  const [detailData] = useFetchProdCodeDetail(id);

  const initialValues = {
    psprdcde: "",
    psprddsc: null,
    psprdlds: null,
    psprdsts: true,
    psprdstd: null,
    psprdggc: null,
    psprdlgc: null,
    psprdagm: null,
    psprdagn: null,
    psprdalm: null,
    psprdaln: null,
    psprdtv1: null,
    psprdtv2: null,
    psprdtv3: null,
    psprdtv4: null,
    psprdram: null,
    psprdran: null,
    psprdpcd: "FIXINSTALM",
    psprdpfv: null,
    psprdpft: null,
    psprdfpd: "M",
    psprditb: null,
    psprdmoi: null,
    psprdba: null,
    psprdamm: null,
    psprdaip: "N",
    psprdafe: "N",
    psprdsp1: false,
    psprdsp2: false,
    psprdsp3: false,
    psprdsp4: false,
    psprdsp5: false,
    psprddr1: "Y",
    psprddr2: "Y",
    psprddr3: "Y",
    psprddr4: "Y",
    psprddo1: null,
    psprddo2: null,
    psprddo3: null,
    psprddo4: null,
    psprdnpm: null,
    psprdnpd: null,
    psprdlar: false,
    psprdabr: 0,
    psprdabt: null,
    psprduap: false,
    psprdprm: "U",
  };


  const [ddlData] = useFetchDDL({ code: ["PRDPAYCD", "PRDFRQCD", "YESORNO", "PRDGLGRP", "PRDLNGRP", "PRDINTBSE", "PRDYRBASE", "PRDAMOR", "PRDINTMOD", "PRDPYRND", "PRDFRSTPAY", "ACRBALTYP"] });
  const handleSwitch1 = () => {
    formik.setFieldValue("psprdsts", !formik.values.psprdsts);
  };

  const handleSwitch2 = () => {
    formik.setFieldValue("psprdsp1", !formik.values.psprdsp1);
  };

  const handleSwitch3 = () => {
    formik.setFieldValue("psprdsp2", !formik.values.psprdsp2);
  };

  const handleSwitch4 = () => {
    formik.setFieldValue("psprdsp3", !formik.values.psprdsp3);
  };

  const handleSwitch5 = () => {
    formik.setFieldValue("psprdsp4", !formik.values.psprdsp4);
  };

  const handleSwitch6 = () => {
    formik.setFieldValue("psprdsp5", !formik.values.psprdsp5);
  };

  const handleSwitch7 = () => {
    formik.setFieldValue("psprduap", !formik.values.psprduap);
  };

  const handleSwitch = () => {
    formik.setFieldValue("psprdlar", !formik.values.psprdlar);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: mode === "ADD" ? ProdCodeAddSchema : ProdCodeUpdateSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    // if(mode==="EDIT") setSubmit(formik.handleSubmit)
  }, [formik])

  useEffect(() => {
    if (mode !== "ADD" && id) {
      if (Object.keys(detailData).length === 0) {
        formik.resetForm();
      }
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData.psprdcde,
          psprdstd: detailData.psprdstd ? dayjs(formatDate(new Date(detailData.psprdstd), "DD/MM/YYYY"), "DD/MM/YYYY") : dayjs(formatDate()),
          // psprdfpd: detailData.psprdfpd ? dayjs(formatDate(new Date(detailData.psprdfpd), "DD/MM/YYYY"), "DD/MM/YYYY") : dayjs(formatDate()),
          psprdsts: detailData?.psprdsts === "Y" ? true : false,
          psprdlar: detailData?.psprdlar === "Y" ? true : false,
          psprduap: detailData?.psprduap === "Y" ? true : false,
          psprdsp1: detailData?.psprdsp1 === "Y" ? true : false,
          psprdsp2: detailData?.psprdsp2 === "Y" ? true : false,
          psprdsp3: detailData?.psprdsp3 === "Y" ? true : false,
          psprdsp4: detailData?.psprdsp4 === "Y" ? true : false,
          psprdsp5: detailData?.psprdsp5 === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageProdCode({
        id: mode === "EDIT" ? data.id : "", ...data,
        psprdsp5: formik.values.psprdsp5 === true ? "Y" : "N",
        psprdsp4: formik.values.psprdsp4 === true ? "Y" : "N",
        psprdsp3: formik.values.psprdsp3 === true ? "Y" : "N",
        psprdsp2: formik.values.psprdsp2 === true ? "Y" : "N",
        psprdsp1: formik.values.psprdsp1 === true ? "Y" : "N",
        psprdlar: formik.values.psprdlar === true ? "Y" : "N",
        psprdsts: formik.values.psprdsts === true ? "Y" : "N",
        psprduap: formik.values.psprduap === true ? "Y" : "N",
        //  psprdpft: null,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update record" : "Add record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }
  useEffect(() => {
    console.log(formik.errors)
  }, [formik.errors])

  return (
    <form onSubmit={formik.handleSubmit} id="form1">
      {/* {mode === "ADD" &&  */}
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Product Code
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Product Code",
              href: `/productCodes`
            },
            {
              title: `Product Code (${mode})`
            }
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
      {/* } */}
      <div className="flex flex-col md:flex-row gap-6 " >

        <Box display="flex" flexDir="column" gap={6} width={"100%"}>
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box>
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={5} width="100%">
                  <Text fontSize={"19pt"} fontWeight="500" mb={1}>
                    General Information
                  </Text>
                  <FormControl
                    id="psprdcde"
                    isInvalid={Boolean(formik.errors.psprdcde) && Boolean(formik.touched.psprdcde)}
                    isReadOnly={mode === "VIEW" ? true : false}
                    width="100%"
                  >
                    {/* <FormLabel>Product Code*</FormLabel> */}
                    <CustomFormLabel labelText="Product Code" />
                    <Input
                      placeholder={"Enter Product Code"}
                      type="text"
                      name="psprdcde"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    {/* <FormLabel>Product Description*</FormLabel> */}
                    <CustomFormLabel labelText="Product Description" />
                    <Input
                      placeholder={"Enter Description"}
                      type="text"
                      name="psprddsc"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    {/* <FormLabel>Local Description*</FormLabel> */}
                    <CustomFormLabel labelText="Local Description" />
                    <Input
                      placeholder={"Enter Local Description"}
                      type="text"
                      name="psprdlds"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psprdlds || ""}
                    />
                    {formik.errors.psprdlds && (
                      <FormErrorMessage>{formik.errors.psprdlds}</FormErrorMessage>
                    )}
                  </FormControl>



                  <Box display="flex" flexDir="row" gap={9} width="100%">

                    <FormControl
                      id="psprdsts"
                      isInvalid={Boolean(formik.errors.psprdsts) && Boolean(formik.touched.psprdsts)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>Active</FormLabel>
                      {/* <Switch
                        onChange={(e) => formik.setFieldValue("psprdsts", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdsts === "Y"}
                        id="psprdsts"
                        name="psprdsts"
                        isDisabled={mode === "ADD"}
                        // isChecked={formik.values.psprdsts}
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprdsts === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                            backgroundColor: formik.values.psprdsts === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprdsts === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprdsts === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprdsts === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}
                      /> */}
                      <Switch
                        id="psprdsts"
                        size='lg'
                        name="psprdsts"
                        isChecked={formik.values.psprdsts}
                        onChange={handleSwitch1}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />
                      {formik.errors.psprdsts && (
                        <FormErrorMessage>{formik.errors.psprdsts}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdstd"
                      isInvalid={Boolean(formik.errors.psprdstd) && Boolean(formik.touched.psprdstd)}
                    >
                      <FormLabel>Status Date</FormLabel>
                      <DatePicker disabled value={formik.values.psprdstd ? formik.values.psprdstd : dayjs(new Date())} format={"DD/MM/YYYY"} onChange={(date) => formik.setFieldValue('psprdstd', date)} className="w-full" />
                      {formik.errors.psprdstd && (
                        <FormErrorMessage>{formik.errors.psprdstd && "Invalid Date"}</FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>

                  <Box display="flex" flexDir="row" gap={9} width="100%">
                    <FormControl
                      id="psprdggc"
                      isInvalid={Boolean(formik.errors.psprdggc) && Boolean(formik.touched.psprdggc)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>GL Group Code*</FormLabel> */}
                      <CustomFormLabel labelText="GL Group Code" />
                      <Select
                        placeholder="Select GL Group Code"
                        value={formik.values.psprdggc || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.PRDGLGRP?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdggc && (
                        <FormErrorMessage>{formik.errors.psprdggc}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdlgc"
                      isInvalid={Boolean(formik.errors.psprdlgc) && Boolean(formik.touched.psprdlgc)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Loan Group Code*</FormLabel> */}
                      <CustomFormLabel labelText="Loan Group Code" />
                      <Select
                        placeholder="Select Loan Group Code"
                        value={formik.values.psprdlgc || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.PRDLNGRP?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdlgc && (
                        <FormErrorMessage>{formik.errors.psprdlgc}</FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              </div>
            </Box>
          </Card>
          <Card
            p={4}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
            h={"75%"}
            pb={0}
          // bgColor="black"
          >
            <Box>
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={6} width="100%" pb={"16.5pt"}>
                  <Text fontSize={"19pt"} fontWeight="500" mb={1}>
                    Product Eligibility Rule
                  </Text>



                  <div style={{ gap: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>

                    <FormLabel></FormLabel>

                    <FormLabel textAlign={"right"}>Minimum</FormLabel>
                    <FormLabel textAlign={"right"} >Maximum</FormLabel>

                    <FormLabel marginTop="auto" marginBottom={"auto"}>Borrower Age</FormLabel>


                    <FormControl
                      id="psprdagn"
                      isInvalid={Boolean(formik.errors.psprdagn) && Boolean(formik.touched.psprdagn)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <Input
                        placeholder={"Enter Min Age"}
                        type="number"
                        min="0"

                        name="psprdagn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={(formik.values.psprdagn || formik.values.psprdagn == 0) ? formik.values.psprdagn : ""}
                      />
                      {formik.errors.psprdagn && (
                        <FormErrorMessage>{formik.errors.psprdagn}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdagm"
                      isInvalid={Boolean(formik.errors.psprdagm) && Boolean(formik.touched.psprdagm)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <Input
                        placeholder={"Enter Max Age"}
                        type="number"
                        min="0"
                        name="psprdagm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={(formik.values.psprdagm || formik.values.psprdagm == 0) ? formik.values.psprdagm : ""}
                      />
                      {formik.errors.psprdagm && (
                        <FormErrorMessage>{formik.errors.psprdagm}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormLabel marginTop="auto" marginBottom={"auto"}>Approved Limit</FormLabel>

                    <FormControl
                      id="psprdaln"
                      isInvalid={Boolean(formik.errors.psprdaln) && Boolean(formik.touched.psprdaln)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <Input
                        placeholder={"Enter Min Limit"}
                        type="number"
                        min="0"

                        name="psprdaln"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={(formik.values.psprdaln || formik.values.psprdaln == 0) ? formik.values.psprdaln : ""}
                      />
                      {formik.errors.psprdaln && (
                        <FormErrorMessage>{formik.errors.psprdaln}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdalm"
                      isInvalid={Boolean(formik.errors.psprdalm) && Boolean(formik.touched.psprdalm)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <Input
                        placeholder={"Enter Max Limit"}
                        type="number"
                        min="0"

                        name="psprdalm"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={(formik.values.psprdalm || formik.values.psprdalm == 0) ? formik.values.psprdalm : ""}
                      />
                      {formik.errors.psprdalm && (
                        <FormErrorMessage>{formik.errors.psprdalm}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormLabel marginTop="auto" marginBottom={"auto"}>Tenure</FormLabel><Box gap={3} display="flex" flexDir="row">
                      <FormControl
                        id="psprdtv3"
                        isInvalid={Boolean(formik.errors.psprdtv3) && Boolean(formik.touched.psprdtv3)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        <Input
                          // placeholder={"Enter Tenure Value Minimum"}
                          type="number"
                          min="0"

                          name="psprdtv3"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={(formik.values.psprdtv3 || formik.values.psprdtv3 == 0) ? formik.values.psprdtv3 : ""}
                        />

                      </FormControl>
                      <FormControl
                        id="psprdtv4"
                        w={"150%"}
                        isInvalid={Boolean(formik.errors.psprdtv4) && Boolean(formik.touched.psprdtv4)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        <Select
                          placeholder=" "

                          // placeholder="Select Eligibility Rules - Tenure Terms Minimum"
                          value={formik.values.psprdtv4 || ""}
                          onChange={(event) => { formik.setFieldValue("psprdtv2", event.target.value); formik.setFieldValue("psprdtv4", event.target.value); }}
                          style={{
                            fontSize: 14,
                          }}
                        // isDisabled={mode === "VIEW" ? true : false}
                        >
                          {ddlData?.PRDFRQCD?.map((option: DDL_TYPES) => ( //change code
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psprdtv4 && (
                          <FormErrorMessage>{formik.errors.psprdtv4}</FormErrorMessage>
                        )}
                      </FormControl>

                    </Box>
                    <Box display="flex" flexDir="column" gap={1}>
                      <Box display="flex" flexDir="row" gap={3}>


                        <FormControl
                          id="psprdtv1"
                          isInvalid={Boolean(formik.errors.psprdtv1) && Boolean(formik.touched.psprdtv1)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          <Input
                            // placeholder={"Enter Tenure Value Maximum"}
                            type="number"
                            name="psprdtv1"
                            min="0"

                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={(formik.values.psprdtv1 || formik.values.psprdtv1 == 0) ? formik.values.psprdtv1 : ""}
                          />
                          {formik.errors.psprdtv1 && (
                            <FormErrorMessage>{formik.errors.psprdtv1}</FormErrorMessage>
                          )}
                        </FormControl>           <FormControl
                          id="psprdtv2"
                          isInvalid={Boolean(formik.errors.psprdtv2) && Boolean(formik.touched.psprdtv2)}
                          isReadOnly={mode === "VIEW" ? true : false}
                          w={"150%"}

                        >
                          <Select
                            // placeholder="Select Eligibility Rules - Tenure Terms Maximum"
                            placeholder=" "
                            value={formik.values.psprdtv2 || ""}
                            onChange={(event) => { formik.setFieldValue("psprdtv2", event.target.value); formik.setFieldValue("psprdtv4", event.target.value); }}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.PRDFRQCD?.map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psprdtv2 && (
                            <FormErrorMessage>{formik.errors.psprdtv2}</FormErrorMessage>
                          )}
                        </FormControl>

                      </Box>
                      <FormControl
                        id="psprdtv3"
                        isInvalid={Boolean(formik.errors.psprdtv3) && Boolean(formik.touched.psprdtv3)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        {formik.errors.psprdtv3 && (
                          <FormErrorMessage>{formik.errors.psprdtv3}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>
                    <FormLabel marginTop="auto" marginBottom={"auto"}>Rate</FormLabel>

                    <FormControl
                      id="psprdran"
                      isInvalid={Boolean(formik.errors.psprdran) && Boolean(formik.touched.psprdran)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <Input
                        placeholder={"Enter Min Rate"}
                        type="number"
                        min="0"

                        name="psprdran"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={(formik.values.psprdran || formik.values.psprdran == 0) ? formik.values.psprdran : ""}
                      />
                      {formik.errors.psprdran && (
                        <FormErrorMessage>{formik.errors.psprdran}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdram"
                      isInvalid={Boolean(formik.errors.psprdram) && Boolean(formik.touched.psprdram)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <Input
                        placeholder={"Enter Max Rate"}
                        type="number"
                        min="0"

                        name="psprdram"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={(formik.values.psprdram || formik.values.psprdram == 0) ? formik.values.psprdram : ""}
                      />
                      {formik.errors.psprdram && (
                        <FormErrorMessage>{formik.errors.psprdram}</FormErrorMessage>
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
            h={"100%"}
            px={4}
          >
            <Box >
              <div className="flex flex-col sm:flex-row gap-6">

                <Box display="flex" flexDir="column" gap={8} width="100%">
                  <Text fontSize={"19pt"} fontWeight="500" mb={1}>
                    Product Specific
                  </Text>

                  <Box display="flex" flexDir="row" gap={5} width="100%" px={6}>

                    <FormControl
                      id="psprdsp1"
                      isInvalid={Boolean(formik.errors.psprdsp1) && Boolean(formik.touched.psprdsp1)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>KPKT</FormLabel>
                      {/* <Switch
                        onChange={(e) => formik.setFieldValue("psprdsp1", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdsp1 === "Y"}
                        id="psprdsp1"
                        name="psprdsp1"
                        // isChecked={formik.values.psprdsp1}
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprdsp1 === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                            backgroundColor: formik.values.psprdsp1 === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprdsp1 === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprdsp1 === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprdsp1 === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}
                      /> */}
                      <Switch
                        id="psprdsp1"
                        size='lg'
                        name="psprdsp1"
                        isChecked={formik.values.psprdsp1}
                        onChange={handleSwitch2}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />

                      {formik.errors.psprdsp1 && (
                        <FormErrorMessage>{formik.errors.psprdsp1}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdsp2"
                      isInvalid={Boolean(formik.errors.psprdsp2) && Boolean(formik.touched.psprdsp2)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>Secured</FormLabel>
                      {/* <Switch onChange={(e) => formik.setFieldValue("psprdsp2", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdsp2 === "Y"}
                        id="psprdsp2"
                        name="psprdsp2"
                        // isChecked={formik.values.psprdsp2}
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprdsp2 === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                            backgroundColor: formik.values.psprdsp2 === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprdsp2 === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprdsp2 === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprdsp2 === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}
                      /> */}
                      <Switch
                        id="psprdsp2"
                        size='lg'
                        name="psprdsp2"
                        isChecked={formik.values.psprdsp2}
                        onChange={handleSwitch3}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />
                      {formik.errors.psprdsp2 && (
                        <FormErrorMessage>{formik.errors.psprdsp2}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdsp3"
                      isInvalid={Boolean(formik.errors.psprdsp3) && Boolean(formik.touched.psprdsp3)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel style={{ whiteSpace: 'nowrap' }}>Buy Now Pay Later</FormLabel>
                      {/* <Switch onChange={(e) => formik.setFieldValue("psprdsp3", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdsp3 === "Y"}
                        isDisabled={true}
                        id="psprdsp3"
                        name="psprdsp3"
                        // isChecked={formik.values.psprdsp3}
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprdsp3 === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            backgroundColor: formik.values.psprdsp3 === "Y" ? '#0ecc95' : "#f6f7fb                          ",
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprdsp3 === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprdsp3 === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprdsp3 === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}

                      /> */}
                      <Switch
                        id="psprdsp3"
                        size='lg'
                        name="psprdsp3"
                        isChecked={formik.values.psprdsp3}
                        onChange={handleSwitch4}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />
                      {formik.errors.psprdsp3 && (
                        <FormErrorMessage>{formik.errors.psprdsp3}</FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>


                  <Box display="flex" flexDir="row" gap={5} width="100%" px={6}>
                    <FormControl
                      id="psprdsp4"
                      isInvalid={Boolean(formik.errors.psprdsp4) && Boolean(formik.touched.psprdsp4)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>Revolving</FormLabel>
                      {/* <Switch onChange={(e) => formik.setFieldValue("psprdsp4", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdsp4 === "Y"}
                        isDisabled={true}

                        id="psprdsp4"
                        name="psprdsp4"
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprdsp4 === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                            backgroundColor: formik.values.psprdsp4 === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprdsp4 === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprdsp4 === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprdsp4 === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}
                      /> */}
                      <Switch
                        id="psprdsp4"
                        size='lg'
                        name="psprdsp4"
                        isChecked={formik.values.psprdsp4}
                        onChange={handleSwitch5}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />

                      {formik.errors.psprdsp4 && (
                        <FormErrorMessage>{formik.errors.psprdsp4}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psprdsp5"
                      isInvalid={Boolean(formik.errors.psprdsp5) && Boolean(formik.touched.psprdsp5)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel style={{ whiteSpace: 'nowrap' }}>Staff Loan</FormLabel>
                      {/* <Switch onChange={(e) => formik.setFieldValue("psprdsp5", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdsp5 === "Y"}
                        id="psprdsp5"
                        name="psprdsp5"
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprdsp5 === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                            backgroundColor: formik.values.psprdsp5 === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprdsp5 === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprdsp5 === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprdsp5 === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}
                      /> */}
                      <Switch
                        id="psprdsp5"
                        size='lg'
                        name="psprdsp5"
                        isChecked={formik.values.psprdsp5}
                        onChange={handleSwitch6}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />
                      {formik.errors.psprdsp5 && (
                        <FormErrorMessage>{formik.errors.psprdsp5}</FormErrorMessage>
                      )}
                    </FormControl>
                    <div style={{ width: '100%' }}></div>
                  </Box>


                </Box>
              </div>
            </Box>
          </Card>
        </Box>

        <Box display="flex" flexDir="column" gap={6} width={"100%"}>

          <Card
            p={4}
            pb={5}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box >
              <div className="flex flex-col sm:flex-row gap-6 ">
                <Box display="flex" flexDir="column" gap={6} width="100%"  >
                  <Text fontSize={"19pt"} fontWeight="500" mb={1}>
                    Interest Pricing Configuration
                  </Text>

                  <Box display="flex" flexDir="column" gap={6}  >
                    <Box display="flex" flexDir="row" gap={6}  width="100%"  >

                      <Box display="flex" flexDir="column" gap={6}  width="100%">
                        <FormControl
                          id="psprditb"
                          isInvalid={Boolean(formik.errors.psprditb) && Boolean(formik.touched.psprditb)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          {/* <FormLabel>Interest Base*</FormLabel> */}
                          <CustomFormLabel labelText="Interest Base" />
                          <Select
                            placeholder=" Select Interest Base"
                            value={formik.values.psprditb || ""}
                            onChange={formik.handleChange}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.PRDINTBSE?.map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psprditb && (
                            <FormErrorMessage>{formik.errors.psprditb}</FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="psprdba"
                          isInvalid={Boolean(formik.errors.psprdba) && Boolean(formik.touched.psprdba)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          {/* <FormLabel>Year Basis*</FormLabel> */}
                          <CustomFormLabel labelText="Year Basis" />
                          <Select
                            placeholder="Select Year Basis"
                            value={formik.values.psprdba || ""}
                            onChange={formik.handleChange}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.PRDYRBASE?.map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psprdba && (
                            <FormErrorMessage>{formik.errors.psprdba}</FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="psprdabt"
                          isInvalid={Boolean(formik.errors.psprdabt) && Boolean(formik.touched.psprdabt)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          {/* <FormLabel>Year Basis*</FormLabel> */}
                          <CustomFormLabel labelText="Accrual Balance Type" />
                          <Select
                            placeholder="Accrual Balance Type"
                            value={formik.values.psprdabt || ""}
                            onChange={formik.handleChange}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.ACRBALTYP?.map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psprdabt && (
                            <FormErrorMessage>{formik.errors.psprdabt}</FormErrorMessage>
                          )}
                        </FormControl>

                        <Box display="flex" flexDir="column" gap={2} width="100%"
                          pb={10}>
                          <FormControl
                            id="psprdaip"
                            isInvalid={Boolean(formik.errors.psprdaip) && Boolean(formik.touched.psprdaip)}
                            isReadOnly={mode === "VIEW" ? true : false}
                          >
                            {/* <FormLabel>Accrue On Interest Payable Indicator</FormLabel> */}
                            <FormLabel>
                              Accrual Balance </FormLabel>
                            <Checkbox _checked={{
                              "& .chakra-checkbox__control": { background: "#8c98e8", borderColor: "#8c98e8" },
                            }}

                              onChange={(e) => formik.setFieldValue('psprdaip', e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdaip === "Y"}>Accrue On Interest Payable</Checkbox>
                            {formik.errors.psprdaip && (
                              <FormErrorMessage>{formik.errors.psprdaip}</FormErrorMessage>
                            )}
                          </FormControl>
                          <FormControl
                            id="psprdafe"
                            isInvalid={Boolean(formik.errors.psprdafe) && Boolean(formik.touched.psprdafe)}
                            isReadOnly={mode === "VIEW" ? true : false}
                            pb={2}
                          >
                            {/* <FormLabel>Accrue On Fee</FormLabel> */}
                            <Checkbox _checked={{
                              "& .chakra-checkbox__control": { background: "#0ecc95", borderColor: "#0ecc95" },
                            }} onChange={(e) => formik.setFieldValue('psprdafe', e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdafe === "Y"}>Accrue On Fee</Checkbox>

                            {formik.errors.psprdafe && (
                              <FormErrorMessage>{formik.errors.psprdafe}</FormErrorMessage>
                            )}
                          </FormControl>

                        </Box>


                      </Box>
                      <Box display="flex" flexDir="column" gap={6} width="100%">
                        <FormControl
                          id="psprdmoi"
                          isInvalid={Boolean(formik.errors.psprdmoi) && Boolean(formik.touched.psprdmoi)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          {/* <FormLabel>Mode of Interest*</FormLabel> */}
                          <CustomFormLabel labelText="Mode of Interest" />
                          <Select
                            placeholder="Select Mode of Interest"
                            value={formik.values.psprdmoi || ""}
                            onChange={formik.handleChange}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {formik.values.psprditb === "FLTRT" ? ddlData?.PRDINTMOD?.filter((option: DDL_TYPES) => option.prgecode === "AOLNS" || option.prgecode === "DCLNS").map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            )) :
                              formik.values.psprditb === "RDBAL" &&
                              ddlData?.PRDINTMOD?.filter((option: DDL_TYPES) => option.prgecode !== "AOLNS" && option.prgecode !== "DCLNS").map((option: DDL_TYPES) => ( //change code
                                <option key={option.prgecode} value={option.prgecode}>
                                  {option.prgedesc}
                                </option>
                              ))


                            }
                          </Select>
                          {formik.errors.psprdmoi && (
                            <FormErrorMessage>{formik.errors.psprdmoi}</FormErrorMessage>
                          )}
                        </FormControl>


                        <FormControl
                          id="psprdamm"
                          isInvalid={Boolean(formik.errors.psprdamm) && Boolean(formik.touched.psprdamm)}
                          isReadOnly={mode === "VIEW" ? true : false}
                          isDisabled={formik.values.psprditb !== "FLTRT"}
                        >
                          {/* <FormLabel>Amortization Method*</FormLabel> */}
                          <CustomFormLabel labelText="Amortization Method" />
                          <Select
                            placeholder="Select Amortization Method"
                            value={formik.values.psprdamm || ""}
                            onChange={formik.handleChange}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.PRDAMOR?.map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psprdamm && (
                            <FormErrorMessage>{formik.errors.psprdamm}</FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="psprdabr"
                          isInvalid={Boolean(formik.errors.psprdabr) && Boolean(formik.touched.psprdabr)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          {formik.values.psprdabt == "003" ? <CustomFormLabel labelText="Accrual Balance Reduction %" /> : <FormLabel>Accrual Balance Reduction %</FormLabel>}
                          <Input
                            placeholder={"Enter Accrual Balance Reduction %"}
                            type="number"
                            min="0"

                            name="psprdabr"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.psprdabr}
                            isDisabled={formik.values.psprdabt == "003" ? false : true}
                          />
                          {formik.errors.psprdabr && (
                            <FormErrorMessage>{formik.errors.psprdabr}</FormErrorMessage>
                          )}
                        </FormControl>
                        <FormControl
                          id="psprdlar"
                          width="120%"
                          isInvalid={Boolean(formik.errors.psprdlar) && Boolean(formik.touched.psprdlar)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          <FormLabel>Less Arrears When Compute Interest</FormLabel>
                          {/* <Switch
                            isDisabled={true}
                            onChange={(e) => formik.setFieldValue("psprdlar", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprdlar === "Y"}
                            id="psprdlar"
                            name="psprdlar"
                            // isChecked={formik.values.psprdsp1}
                            size="lg"
                            colorScheme={"green"}
                            sx={{
                              ".chakra-switch__thumb": {
                                backgroundColor: formik.values.psprdlar === "Y" ? 'white' : '#abafb2',
                              },
                              '.chakra-switch__track': {
                                paddingTop: '3px',
                                paddingBottom: '3px',
                                paddingLeft: '7px',
                                paddingRight: '7px',
                                backgroundColor: formik.values.psprdlar === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                              },
                              '.chakra-switch__track::after': {
                                // content: formik.values.psprdlar === "Y" ? '"Yes"' : '"No"',
                                color: formik.values.psprdlar === "Y" ? 'white' : '#abafb2',
                                display: 'block',
                                position: 'absolute',
                                transform: 'translate(-50%,-50%)',
                                top: "37.5%", // calc half of height
                                left: formik.values.psprdlar === "Y" ? '28%' : '70%',
                                fontWeight: 'bold',
                                fontSize: '2xs',
                              },
                            }}
                          /> */}
                          <Switch
                            id="psprdlar"
                            size='lg'
                            name="psprdlar"
                            isChecked={formik.values.psprdlar}
                            onChange={handleSwitch}
                            onBlur={formik.handleBlur}
                            colorScheme={"green"}
                            sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                          />

                          {formik.errors.psprdlar && (
                            <FormErrorMessage>{formik.errors.psprdlar}</FormErrorMessage>
                          )}
                        </FormControl>

                      </Box>
                    </Box>

                  </Box>





                </Box>
              </div>
            </Box>
          </Card>
          <Card
            h={"100%"}

            p={3}
            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
          >
            <Box>
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <Text fontSize={"19pt"} fontWeight="500" mb={1}>
                    Payment Configuration
                  </Text>

                  <Box display="flex" flexDir="row" gap={9} width="100%">
                    <FormControl
                      flex={1.4}
                      id="psprdpcd"
                      isInvalid={Boolean(formik.errors.psprdpcd) && Boolean(formik.touched.psprdpcd)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Payment Code*</FormLabel> */}
                      <CustomFormLabel labelText="Payment Code" />
                      <Select
                        placeholder="Select Payment Code"
                        value={formik.values.psprdpcd || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.PRDPAYCD?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdpcd && (
                        <FormErrorMessage>{formik.errors.psprdpcd}</FormErrorMessage>
                      )}
                    </FormControl>
                    <Box display="flex" flex={1} flexDir="column">
                      <FormLabel>Payment Frequency</FormLabel>
                      <Box display="flex" flexDir="row" gap={3}>
                        <FormControl
                          id="psprdpfv"
                          isInvalid={Boolean(formik.errors.psprdpfv) && Boolean(formik.touched.psprdpfv)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          <Input
                            // placeholder={"Enter Product Payment Frequency Value"}
                            type="number"
                            min="0"

                            name="psprdpfv"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={(formik.values.psprdpfv || formik.values.psprdpfv == 0) ? formik.values.psprdpfv : ""}
                          />
                          {formik.errors.psprdpfv && (
                            <FormErrorMessage>{formik.errors.psprdpfv}</FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl
                          id="psprdpft"
                          isInvalid={Boolean(formik.errors.psprdpft) && Boolean(formik.touched.psprdpft)}
                          isReadOnly={mode === "VIEW" ? true : false}
                        >
                          <Select
                            // placeholder="Select Product Payment Frequency Terms"
                            placeholder=" "
                            value={formik.values.psprdpft || ""}
                            onChange={formik.handleChange}
                            style={{
                              fontSize: 14,
                            }}
                          // isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.PRDFRQCD?.map((option: DDL_TYPES) => ( //change code
                              <option key={option.prgecode} value={option.prgecode}>
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psprdpft && (
                            <FormErrorMessage>{formik.errors.psprdpft}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Box>

                    </Box>


                  </Box>


                  <Box display="flex" flexDir="row" gap={9} width="100%">
                    <FormControl
                      flex={1.4}

                      id="psprdfpd"
                      isInvalid={Boolean(formik.errors.psprdfpd) && Boolean(formik.touched.psprdfpd)}
                    >
                      <FormLabel>Auto Set 1st Payment Due Date</FormLabel>
                      <Select
                        placeholder="Select Auto Set 1st Payment Due Date"
                        value={formik.values.psprdfpd || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.PRDFRSTPAY?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdfpd && (
                        <FormErrorMessage>{formik.errors.psprdfpd}</FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      flex={1}
                      id="psprduap"
                      isInvalid={Boolean(formik.errors.psprduap) && Boolean(formik.touched.psprduap)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      <FormLabel>Use Advanced Payment</FormLabel>
                      {/* <Switch
                        onChange={(e) => formik.setFieldValue("psprduap", e.target.checked ? "Y" : "N")} isChecked={formik.values.psprduap === "Y"}
                        id="psprduap"
                        name="psprduap"
                        // isChecked={formik.values.psprdsp1}
                        size="lg"
                        colorScheme={"green"}
                        sx={{
                          ".chakra-switch__thumb": {
                            backgroundColor: formik.values.psprduap === "Y" ? 'white' : '#abafb2',
                          },
                          '.chakra-switch__track': {
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            paddingLeft: '7px',
                            paddingRight: '7px',
                            backgroundColor: formik.values.psprduap === "Y" ? '#0ecc95' : "#f6f7fb                          ",

                          },
                          '.chakra-switch__track::after': {
                            // content: formik.values.psprduap === "Y" ? '"Yes"' : '"No"',
                            color: formik.values.psprduap === "Y" ? 'white' : '#abafb2',
                            display: 'block',
                            position: 'absolute',
                            transform: 'translate(-50%,-50%)',
                            top: "37.5%", // calc half of height
                            left: formik.values.psprduap === "Y" ? '28%' : '70%',
                            fontWeight: 'bold',
                            fontSize: '2xs',
                          },
                        }}
                      /> */}
                      <Switch
                        id="psprduap"
                        size='lg'
                        name="psprduap"
                        isChecked={formik.values.psprduap}
                        onChange={handleSwitch7}
                        onBlur={formik.handleBlur}
                        colorScheme={"green"}
                        sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.GRAY } }}
                      />

                      {formik.errors.psprduap && (
                        <FormErrorMessage>{formik.errors.psprduap}</FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDir="row" gap={9} width="100%">
                    <FormControl
                      id="psprdprm"
                      flex={1.4}

                      isInvalid={Boolean(formik.errors.psprdprm) && Boolean(formik.touched.psprdprm)}
                    >
                      {/* <FormLabel>Payment Rounding Method*</FormLabel> */}
                      <CustomFormLabel labelText="Payment Rounding Method" />
                      <Select
                        placeholder="Select Payment Rounding Method"
                        value={formik.values.psprdprm || ""}
                        onChange={formik.handleChange}
                        style={{
                          fontSize: 14,
                        }}
                      // isDisabled={mode === "VIEW" ? true : false}
                      >
                        {ddlData?.PRDPYRND?.map((option: DDL_TYPES) => ( //change code
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}
                      </Select>
                      {formik.errors.psprdprm && (
                        <FormErrorMessage>{formik.errors.psprdprm}</FormErrorMessage>
                      )}
                    </FormControl>
                    <div style={{ width: "100%", flex: 1 }}> </div>
                  </Box>


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
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={1} width ="100%">  
                  <Text fontSize={"19pt"} fontWeight="500" mb={1}>
                    Delinquency Configuration
                  </Text>

                  <Box alignItems={"center"} display="flex" flexDir="row" gap={6} width="100%">
                    <FormLabel pl={"10px"} flex={1} fontSize={"xl"} fontWeight="normal" mb={1}>
                      Pastdue Reminder
                    </FormLabel> <FormLabel py={"10px"} pl={"10px"} flex={1} fontSize={"xl"} fontWeight="normal" mb={1}>
                      Days In Overdue
                    </FormLabel>
                  </Box>
                  <Box alignItems={"center"} display="flex" flexDir="row" gap={6} width="100%">
                    <FormLabel bgColor={"#f3f7fa"} flex={1} py={"10px"} pl={"10px"} fontSize={"xl"} fontWeight="normal" mb={1}>
                      1st Past due Reminder
                    </FormLabel>                    <Box flex={1}
                    >
                      <FormControl
                        id="psprddo1"
                        isInvalid={Boolean(formik.errors.psprddo1) && Boolean(formik.touched.psprddo1)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        <Input
                          width={"35%"}
                          // placeholder={"Enter 1st Past due Reminder"}
                          type="number"
                          min="0"

                          name="psprddo1"
                          onChange={formik.handleChange}
                          value={(formik.values.psprddo1 || formik.values.psprddo1 == 0) ? formik.values.psprddo1 : ""}
                        />

                        {formik.errors.psprddo1 && (
                          <FormErrorMessage>{formik.errors.psprddo1}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>

                  </Box>
                  <Box alignItems={"center"} display="flex" flexDir="row" gap={6} width="100%">
                    <FormLabel bgColor={"#f3f7fa"} py={"10px"} pl={"10px"} flex={1} fontSize={"xl"} fontWeight="normal" mb={1}>
                      2nd Past due Reminder
                    </FormLabel><Box flex={1}>
                      <FormControl
                        id="psprddo2"
                        isInvalid={Boolean(formik.errors.psprddo2) && Boolean(formik.touched.psprddo2)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      ><Input
                          width={"35%"}

                          // placeholder={"Enter 2nd Past due Reminder"}
                          type="number"
                          min="0"

                          name="psprddo2"
                          onChange={formik.handleChange}
                          value={(formik.values.psprddo2 || formik.values.psprddo2 == 0) ? formik.values.psprddo2 : ""}
                        />
                        {formik.errors.psprddo2 && (
                          <FormErrorMessage>{formik.errors.psprddo2}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>

                  </Box>
                  <Box alignItems={"center"} display="flex" flexDir="row" gap={6} width="100%">
                    <FormLabel bgColor={"#f3f7fa"} py={"10px"} pl={"10px"} flex={1} fontSize={"xl"} fontWeight="normal" mb={1}>
                      3rd Past due Reminder
                    </FormLabel>
                    <Box flex={1}
                    >
                      <FormControl
                        id="psprddo3"
                        isInvalid={Boolean(formik.errors.psprddo3) && Boolean(formik.touched.psprddo3)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        <Input
                          w={"35%"}
                          // placeholder={"Enter 3rd Past due Reminder"}
                          type="number"
                          min="0"

                          name="psprddo3"
                          onChange={formik.handleChange}
                          value={(formik.values.psprddo3 || formik.values.psprddo3 == 0) ? formik.values.psprddo3 : ""}
                        />
                        {formik.errors.psprddo3 && (
                          <FormErrorMessage>{formik.errors.psprddo3}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>

                  </Box>
                  <Box mb={3} alignItems={"center"} display="flex" flexDir="row" gap={6} width="100%">
                    <FormLabel bgColor={"#f3f7fa"} py={"10px"} pl={"10px"} flex={1} fontSize={"xl"} fontWeight="normal" mb={1}>
                      4th Past due Reminder
                    </FormLabel> <Box flex={1}
                    >

                      <FormControl
                        id="psprddo4"
                        isInvalid={Boolean(formik.errors.psprddo4) && Boolean(formik.touched.psprddo4)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      ><Input
                          w={"35%"}
                          // placeholder={"Enter 4th Past due Reminder"}
                          type="number"
                          min="0"

                          name="psprddo4"
                          onChange={formik.handleChange}
                          value={(formik.values.psprddo4 || formik.values.psprddo4 == 0) ? formik.values.psprddo4 : ""}
                        />
                        {formik.errors.psprddo4 && (
                          <FormErrorMessage>{formik.errors.psprddo4}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>
                  </Box>

                  <Box mb={3} alignItems={"center"} display="flex" flexDir="row" width="100%">

                  <FormLabel textAlign={"left"} style={{flex:1, width:"100%" }}> </FormLabel>

                    <FormLabel textAlign={"left"} style={{flex:1 }} ml={16}>Tenure In Month</FormLabel>
                    <FormLabel textAlign={"left"} style={{ flex:1,  }}>Tenure in Days</FormLabel>
                    </Box>
                    <Box mb={3} alignItems={"center"}  display="flex" flexDir="row" gap={0} width="100%">

                    <FormLabel  marginTop="auto" marginBottom={"25px"} style={{ flex:1, }} marginLeft={"2"} marginRight={"30"} p={0} m={0}>No of days past due to turn npl</FormLabel>


                    <FormControl
                    style={{ flex:0.75 }}
                      id="psprdnpm"
                      isInvalid={Boolean(formik.errors.psprdnpm) && Boolean(formik.touched.psprdnpm)}
                      isReadOnly={mode === "VIEW" ? true : false}

                    >
                      {/* <FormLabel>Days Past Due to turn NPL (Month)</FormLabel> */}
                      <Input
                        // placeholder={"Enter Days Past Due to turn NPL (Month)"}
                        type="number"
                        name="psprdnpm"
                        min="0"

                        onChange={formik.handleChange}
                        value={formik.values.psprdnpm || ""}
                      />
                      {formik.errors.psprdnpm && (
                        <FormErrorMessage>{formik.errors.psprdnpm}</FormErrorMessage>
                      )}

                      <div style={{ gap: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>

                      </div>
                      <FormLabel></FormLabel>
                    </FormControl>
                    <FormControl
                    ml={3}
                    mb={2}
                                        style={{ flex:0.75 }}

                      id="psprdnpd"
                      isInvalid={Boolean(formik.errors.psprdnpd) && Boolean(formik.touched.psprdnpd)}
                      isReadOnly={mode === "VIEW" ? true : false}
                    >
                      {/* <FormLabel>Days Past Due to turn NPL (Tenure In Days)</FormLabel> */}
                      <Input
                        // placeholder={"Enter Days Past Due to turn NPL (Month)"}
                        type="number"
                        name="psprdnpd"
                        min="0"

                        onChange={formik.handleChange}
                        value={formik.values.psprdnpd || ""}
                      />
                      {formik.errors.psprdnpd && (
                        <FormErrorMessage>{formik.errors.psprdnpd}</FormErrorMessage>
                      )}
                    </FormControl>

                    </Box>




                </Box>
              </div>
            </Box>
          </Card>
        </Box>
      </div >

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
    </form >
  );
}
