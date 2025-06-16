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
import { getManageFeeCode, getFeeCodeDetail } from "@app/redux/feeCode/slice";
import useFetchFeeCodeDetail from "@app/hooks/selector/useFetchFeeCodeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageFeeCode } from "@app/redux/feeCode/api";
import { FeeCodeSchema } from "../@schemas/feeCodeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLGlacpf from "@app/hooks/selector/useFetchDDLGlacpf";
import useFetchDDLTaxpar from "@app/hooks/selector/useFetchDDLTaxpar";


export default function FeeCodeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Fee Code" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [glacpf] = useFetchDDLGlacpf();
  const [taxpar] = useFetchDDLTaxpar();

  const [detailData] = useFetchFeeCodeDetail(id);

  const initialValues = {
    psfeecod: null,
    psfeedsc: null,
    psfeelds: null,
    psfeestt: null,
    psfeetcd: null,
    psfeeiet: null,
    psfeegan: null,
  };


  const [ddlData] = useFetchDDL({ code: ["TAXINCEXC", "YESORNO"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: FeeCodeSchema,
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
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {

    const { success } = await sendRequest({
      fn: getManageFeeCode({
        ...data, id: mode === "EDIT" ? id : "",
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
      {/*{mode === "ADD" && */}
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Fee Code Parameter
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Fee Code",
              href: `/feeCodes`
            },
            {
              title: `Fee Code (${mode})`
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

      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Box>
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <Box display="flex" flexDir="column" gap={5} width="100%">
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="psfeecod"
                    isInvalid={Boolean(formik.errors.psfeecod) && Boolean(formik.touched.psfeecod)}
                    isReadOnly={mode === "VIEW" ? true : false}
                    width="100%"
                  >
                    {/* <FormLabel>Fee Code*</FormLabel> */}
                    <CustomFormLabel labelText="Fee Code" />
                    <Input
                      placeholder={"Enter Fee Code"}
                      type="text"
                      name="psfeecod"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psfeecod || ""}
                      isDisabled={mode === "EDIT"}
                    />
                    {formik.errors.psfeecod && (
                      <FormErrorMessage>{formik.errors.psfeecod}</FormErrorMessage>
                    )}
                  </FormControl>

                </Box>
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="psfeedsc"
                    isInvalid={Boolean(formik.errors.psfeedsc) && Boolean(formik.touched.psfeedsc)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Fee Code Description*</FormLabel> */}
                    <CustomFormLabel labelText="Fee Code Description" />
                    <Input
                      placeholder={"Enter Fee Code Description"}
                      type="text"
                      name="psfeedsc"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psfeedsc || ""}
                    />
                    {formik.errors.psfeedsc && (
                      <FormErrorMessage>{formik.errors.psfeedsc}</FormErrorMessage>
                    )}
                  </FormControl>

                </Box>
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="psfeelds"
                    isInvalid={Boolean(formik.errors.psfeelds) && Boolean(formik.touched.psfeelds)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Local Description*</FormLabel> */}
                    <CustomFormLabel labelText="Local Description" />
                    <Input
                      placeholder={"Enter Local Description"}
                      type="text"
                      name="psfeelds"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psfeelds || ""}
                    />
                    {formik.errors.psfeelds && (
                      <FormErrorMessage>{formik.errors.psfeelds}</FormErrorMessage>
                    )}
                  </FormControl>


                </Box>



              </Box>
              <Box display="flex" flexDir="column" gap={5} width="100%">


                {/* <FormControl
                    id="psfeestt"
                    isInvalid={Boolean(formik.errors.psfeestt) && Boolean(formik.touched.psfeestt)}
                    isReadOnly={mode === "VIEW" ? true : false}
                    width="50%"
                  >
                    {/* <FormLabel>Subject To Tax*</FormLabel> */}
                {/* <CustomFormLabel labelText="Subject To Tax"/>  */}

                {/* <Select
                      // placeholder="Select Eligibility Rules - Tenure Terms Maximum"
                      placeholder="Select Subject To Tax"
                      value={formik.values.psfeestt || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {ddlData?.YESORNO?.map((option: DDL_TYPES) => ( //change code
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select> */}
                {/* {formik.errors.psfeestt && (
                      <FormErrorMessage>{formik.errors.psfeestt}</FormErrorMessage>
                    )} */}
                {/* </FormControl> */}
                <FormControl
                  id="psfeetcd"
                  isInvalid={Boolean(formik.errors.psfeetcd) && Boolean(formik.touched.psfeetcd)}
                  isReadOnly={mode === "VIEW" ? true : false}
                  width="100%"
                >
                  {/* <FormLabel>Tax Code{formik.values.psfeestt === "Y" && <>*</>}</FormLabel> */}

                  {/* <CustomFormLabel labelText="Tax Code" /> */}
                  <FormLabel>Tax Code</FormLabel>

                  <Select
                    placeholder="Select Tax Code"
                    value={formik.values.psfeetcd || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  // isDisabled={mode === "VIEW" ? true : false}
                  >


                    {Array.isArray(taxpar) && taxpar.length > 0 ? (
                      taxpar.map((option: any) => (
                        <option key={option.pstaxdsc} value={option.pstaxcde}>
                          {option.pstaxdsc}
                        </option>
                      ))
                    ) : (
                      <option value="">No options available</option>
                    )}
                  </Select>

                  {/* <Input
                    placeholder={"Enter Tax Code"}
                    type="text"
                    name="psfeetcd"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psfeetcd || ""}
                  /> */}
                  {formik.errors.psfeetcd && (
                    <FormErrorMessage>{formik.errors.psfeetcd}</FormErrorMessage>
                  )}
                </FormControl>


                <Box display="flex" flexDir="row" gap={5} width="100%">
                  <FormControl
                    id="psfeeiet"
                    isInvalid={Boolean(formik.errors.psfeeiet) && Boolean(formik.touched.psfeeiet)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {!formik.values.psfeetcd ? <FormLabel>Fee Include / Exclude Tax</FormLabel> : <CustomFormLabel labelText="Fee Include / Exclude Tax" />}
                    {formik.values.psfeetcd ? <Select
                      // placeholder="Select Eligibility Rules - Tenure Terms Maximum"
                      placeholder="Select Fee Include / Exclude Tax"
                      value={formik.values.psfeeiet || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {ddlData?.TAXINCEXC?.map((option: DDL_TYPES) => ( //change code
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                     :
                      <Input
                        placeholder={"Select Fee Include / Exclude Tax"}
                        type="text"
                        name="psfeeiet"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={""}
                        isDisabled
                      />
                    }

                    {/* <Select
                      // placeholder="Select Eligibility Rules - Tenure Terms Maximum"
                      placeholder="Select Fee Include / Exclude Tax"
                      value={formik.values.psfeeiet || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {ddlData?.TAXINCEXC?.map((option: DDL_TYPES) => ( //change code
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select> */}


                    {formik.errors.psfeeiet && (
                      <FormErrorMessage>{formik.errors.psfeeiet}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Box display="flex" flexDir="row" gap={5} width="100%">

                  <FormControl
                    id="psfeegan"
                    isInvalid={Boolean(formik.errors.psfeegan) && Boolean(formik.touched.psfeegan)}
                    isReadOnly={mode === "VIEW" ? true : false}
                    width="100%"

                  >
                    <FormLabel>GL Account No.</FormLabel>
                    {/* <CustomFormLabel labelText="GL Account No." /> */}
                    {/* <Input
                      placeholder={"Enter GL Account No."}
                      type="text"
                      name="psfeegan"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psfeegan || ""}
                    /> */}
                    <Select
                      placeholder="Select GL Account No."
                      value={formik.values.psfeegan || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {Array.isArray(glacpf) && glacpf.length > 0 ? (
                        glacpf.map((option: any) => (
                          <option key={option.psglacno} value={option.psglacno}>
                            {option.psglacno} - {option.psgladsc}
                          </option>
                        ))
                      ) : (
                        <option value="">No options available</option>
                      )}
                    </Select>
                    {formik.errors.psfeegan && (
                      <FormErrorMessage>{formik.errors.psfeegan}</FormErrorMessage>
                    )}
                  </FormControl>


                </Box>



              </Box>
            </Box>
          </div>
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

