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
import { getManageProdFee, getProdFeeDetail } from "@app/redux/prodFee/slice";
import useFetchProdFeeDetail from "@app/hooks/selector/useFetchProdFeeDetail";
import useFetchDDLFeeCode from "@app/hooks/selector/useFetchDDLFeeCode";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageProdFee } from "@app/redux/prodFee/api";
import { ProdFeeSchema } from "@app/components/forms/@schemas/prodFeeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function ProdFeeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Product Fee" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  // const setFeeMode = props.setFeeMode
  // const setFeeId = props.setFeeId
  const psprddsc = props.psprddsc


  const [detailData] = useFetchProdFeeDetail(id);

  const initialValues = {
    psprdcod: props.psprdcod,
    psfeecde: "",
    psfeefqv: null,
    psfeefqt: "",
    psfeeevt: "",
    psfeeamt: null,
    psfeeper: null,
    psfeebin: "",
    psfeemch: null,
    psfeench: null,

  };


  const [ddlData] = useFetchDDL({ code: ["PRDFRQCD", "FEEBALIND", "FEEEVENT", "TERMS"] });
  const [feeCodes] = useFetchDDLFeeCode();



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ProdFeeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {

      if (Object.keys(detailData).length === 0) {
        formik.resetForm();
      }
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          id: detailData.id,
        });
      }

    }
    // console.log("feeCodes>>>>", feeCodes)
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageProdFee({
        id: mode === "EDIT" ? data.id : "", ...data, psprdpft: null,
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
        // setFeeMode("LISTING")
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Product Fee Charges
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Product Code",
              href: `/productCodes`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Product Fee Charges",
              href: `/productCodes/productFees/?id=${props.psprdcod}`,
            },
            {
              title: "Product Fee Charges (" + mode + ")",
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
              buttonDefaultType={"BACK"} onclick={() => {
                router.back()
                // setFeeMode("LISTING")
              }}
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
                id="psprdcod"
                // isInvalid={Boolean(formik.errors.psprdcod) && Boolean(formik.touched.psprdcod)}
                isReadOnly={true}
              >
                <FormLabel>Product Code</FormLabel>
                <Input
                  placeholder={"Product Code"}
                  type="text"
                  name="psprdcod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={props.psprdcod + " - " + psprddsc}
                // isDisabled={mode==="EDIT"}
                />
                {/* {formik.errors.psprdcod && (
                  <FormErrorMessage>{formik.errors.psprdcod}</FormErrorMessage>
                )} */}
              </FormControl>
              <FormControl
                id="psfeecde"
                isInvalid={Boolean(formik.errors.psfeecde) && Boolean(formik.touched.psfeecde)}
                isReadOnly={mode === "ADD" ? false : true}
              >
                {/* <FormLabel>Fee Charges Code*</FormLabel> */}
                <CustomFormLabel labelText="Fee Charges Code"/>
                <Select
                  placeholder="Select Fee Charges Code"
                  value={formik.values.psfeecde || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {/* {Array.isArray(feeCodes) && feeCodes?.map((option: any) => ( //change code
                    <option key={option.psfeedsc} value={option.psfeecod}>
                      {option.psfeedsc}
                    </option>
                  ))} */}

                  {Array.isArray(feeCodes) && feeCodes.length > 0 ? (
                    feeCodes.map((option: any) => (
                      <option key={option.psfeedsc} value={option.psfeecod}>
                        {option.psfeedsc}
                      </option>
                    ))
                  ) : (
                    <option value="">No options available</option>
                  )}
                </Select>
                {formik.errors.psfeecde && (
                  <FormErrorMessage>{formik.errors.psfeecde}</FormErrorMessage>
                )}
              </FormControl>

              <Box display="flex" flexDir="column">
                {/* <FormLabel>Frequency Code</FormLabel> */}
                <CustomFormLabel labelText="Frequency Code"/>
                <Box display="flex" flexDir="row" gap={3}>
                  <FormControl
                    flex={2}
                    id="psfeefqv"
                    isInvalid={Boolean(formik.errors.psfeefqv) && Boolean(formik.touched.psfeefqv)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <Input
                      // placeholder={"Enter Frequency Value"}
                      type="number"
                      min={0}
                      name="psfeefqv"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={(formik.values.psfeefqv || formik.values.psfeefqv == 0) ? formik.values.psfeefqv : ""}
                    />
                    {formik.errors.psfeefqv && (
                      <FormErrorMessage>{formik.errors.psfeefqv}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    flex={8}
                    id="psfeefqt"
                    isInvalid={Boolean(formik.errors.psfeefqt) && Boolean(formik.touched.psfeefqt)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <Select
                      placeholder="Select Frequency Terms"
                      value={formik.values.psfeefqt || ""}
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
                    {formik.errors.psfeefqt && (
                      <FormErrorMessage>{formik.errors.psfeefqt}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </Box>


              <FormControl
                id="psfeeevt"
                isInvalid={Boolean(formik.errors.psfeeevt) && Boolean(formik.touched.psfeeevt)}
              >
                {/* <FormLabel>Event Code*</FormLabel> */}
                <CustomFormLabel labelText="Event Code" />
                <Select
                  placeholder="Select Event Code"
                  value={formik.values.psfeeevt || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.FEEEVENT?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select> {formik.errors.psfeeevt && (
                  <FormErrorMessage>{formik.errors.psfeeevt}</FormErrorMessage>
                )}
              </FormControl>

            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">

              <FormControl
                id="psfeeamt"
                isInvalid={Boolean(formik.errors.psfeeamt) && Boolean(formik.touched.psfeeamt)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Fee Fixed Amount</FormLabel>
                <Input
                  placeholder={"Enter Fee Fixed Amount"}
                  type="text"
                  name="psfeeamt"
                  min="0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={(formik.values.psfeeamt || formik.values.psfeeamt == 0) ? formik.values.psfeeamt : ""}
                />
                {formik.errors.psfeeamt && (
                  <FormErrorMessage>{formik.errors.psfeeamt}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psfeeper"
                isInvalid={Boolean(formik.errors.psfeeper) && Boolean(formik.touched.psfeeper)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Fee %</FormLabel>
                <Input
                  placeholder={"Enter Fee Percentage"}
                  type="text"
                  name="psfeeper"
                  min="0"

                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={(formik.values.psfeeper || formik.values.psfeeper == 0) ? formik.values.psfeeper : ""}
                />
                {formik.errors.psfeeper && (
                  <FormErrorMessage>{formik.errors.psfeeper}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psfeebin"
                isInvalid={Boolean(formik.errors.psfeebin) && Boolean(formik.touched.psfeebin)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Fee Balance Indicator*</FormLabel> */}
                <CustomFormLabel labelText="Fee Balance Indicator" />
                <Select
                  placeholder="Select Fee Balance Indicator"
                  value={formik.values.psfeebin || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.FEEBALIND?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psfeebin && (
                  <FormErrorMessage>{formik.errors.psfeebin}</FormErrorMessage>
                )}
              </FormControl>
              <Box display="flex" flexDir="row" gap={3}>
                <FormControl
                  id="psfeemch"
                  isInvalid={Boolean(formik.errors.psfeemch) && Boolean(formik.touched.psfeemch)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Maximum Charge</FormLabel>
                  <Input
                    placeholder={"Enter Maximum Charge"}
                    type="number"
                    name="psfeemch"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={(formik.values.psfeemch || formik.values.psfeemch == 0) ? formik.values.psfeemch : ""}
                  />
                  {formik.errors.psfeemch && (
                    <FormErrorMessage>{formik.errors.psfeemch}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psfeench"
                  isInvalid={Boolean(formik.errors.psfeench) && Boolean(formik.touched.psfeench)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Minimum Charge</FormLabel>
                  <Input
                    placeholder={"Enter Minimum Charge"}
                    type="number"
                    name="psfeench"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={(formik.values.psfeench || formik.values.psfeench == 0) ? formik.values.psfeench : ""}
                  />
                  {formik.errors.psfeench && (
                    <FormErrorMessage>{formik.errors.psfeench}</FormErrorMessage>
                  )}
                </FormControl>
              </Box>



            </Box>


          </div>
        </Box>
      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => {
                router.back()
                // setFeeMode("LISTING")
              }}
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

