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
import { getManageCredAppLim, getCredAppLimDetail } from "@app/redux/credAppLim/slice";
import useFetchCredAppLimDetail from "@app/hooks/selector/useFetchCredAppLimDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageCredAppLim } from "@app/redux/credAppLim/api";
import { CredAppLimSchema } from "@app/components/forms/@schemas/credAppLimSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import {numberWithCommas, parseThousandsToNumber, numberPattern} from "@app/utils/StringUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function CrepAppLimForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Credit Approval Limit" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchCredAppLimDetail(id);

  const initialValues = {
    pscalamt: null,
    pscaltyp: "S",
    pscalar1: "CS",
    pscalar2: "",
  };


  const [ddlData] = useFetchDDL({ code: ["APRLMTTYP", "APRAPRROLE"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: CredAppLimSchema,
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
          // id: detailData.psprdcde,
          id: detailData.pscalamt,

        });
      }
    }

    // if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
    //   formik.setValues({
    //     ...detailData,
    //     id: detailData.pscalamt,
    //   });
    // }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageCredAppLim({
        id: mode === "EDIT" ? data.id : "", ...data,
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Credit Approval Limit
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Credit Approval Limit",
              href: `/credAppLim`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Credit Approval Limit ("+ mode +")",
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
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="pscalamt"
                isInvalid={Boolean(formik.errors.pscalamt)&&Boolean(formik.touched.pscalamt)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Approved Limit*</FormLabel> */}
                <CustomFormLabel labelText="Approved Limit"/>
                <Input
                  placeholder={"Enter Credit Limit"}
                  type="text"
                  name="pscalamt"
                  // onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  // value={formik.values.pscalamt || ""}
                  value={numberWithCommas(formik.values.pscalamt || "")}
                  pattern={numberPattern}
                  onChange={(event) =>
                    formik.handleChange({
                      target: {
                      value: parseThousandsToNumber(event.target.value),
                      name: "pscalamt",
                      },
                    })
                    }
                    onBlur={formik.handleBlur}
                  
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.pscalamt && (
                  <FormErrorMessage>{formik.errors.pscalamt}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pscaltyp"
                isInvalid={Boolean(formik.errors.pscaltyp)&&Boolean(formik.touched.pscaltyp)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Approval Type*</FormLabel> */}
                <CustomFormLabel labelText="Approval Type"/>
                <Select
                  placeholder="Select Approval Type"
                  value={formik.values.pscaltyp || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.APRLMTTYP?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pscaltyp && (
                  <FormErrorMessage>{formik.errors.pscaltyp}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pscalar1"
                isInvalid={Boolean(formik.errors.pscalar1)&&Boolean(formik.touched.pscalar1)}
              >
                {/* <FormLabel>Approval Role 1*</FormLabel> */}
                <CustomFormLabel labelText="Approval Role 1"/>
                <Select
                  placeholder="Select Approval Role 1"
                  value={formik.values.pscalar1 || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.APRAPRROLE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>{formik.errors.pscalar1 && (
                  <FormErrorMessage>{formik.errors.pscalar1 }</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="pscalar2"
                isInvalid={Boolean(formik.errors.pscalar2)&&Boolean(formik.touched.pscalar2)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Approval Role 2</FormLabel>
                <Select
                  placeholder="Select Approval Role 2"
                  value={formik.values.pscalar2 || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.APRAPRROLE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pscalar2 && (
                  <FormErrorMessage>{formik.errors.pscalar2}</FormErrorMessage>
                )}
              </FormControl>
             

            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">

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

