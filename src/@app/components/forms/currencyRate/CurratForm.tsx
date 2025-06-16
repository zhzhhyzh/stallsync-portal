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
  Button, Stack,
  InputGroup,
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
import { getManageCurrat } from "@app/redux/currencyRate/slice";
import useFetchCurrencyRateDetail from "@app/hooks/selector/useFetchCurrencyRateDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { CurratSchema } from "@app/components/forms/@schemas/curratSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function CurratForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Currency Rate" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchCurrencyRateDetail(id);

  const initialValues = {
    pscurcde: null,
    pscurrat: null,
    pscursts: true,

  };

  const handleStatusChange = () => {
    formik.setFieldValue("pscursts", !formik.values.pscursts);
  };
  const [ddlData] = useFetchDDL({ code: ["CURRCY", "YESORNO", "DRCR", "TRNSDORC", "TRNSAFFCD"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: CurratSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        pscursts: detailData.pscursts == "Y"
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {

    data.pscursts = data.pscursts? "Y":"N";
    const { success } = await sendRequest({
      fn: getManageCurrat({
        id: mode === "EDIT" ? data.id : "",
        
        ...data
        
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
            Currency Rate
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Currency Rate",
              href: `/currencyRate`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Currency Rate Detail (" + mode + ")",
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
            <Box display="flex" flexDir="column" gap={6} width="50%">
              <FormControl
                id="pscurcde"
                isInvalid={Boolean(formik.errors.pscurcde) && Boolean(formik.touched.pscurcde)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                <CustomFormLabel labelText="Currency Code" />
                <Select
                  placeholder="Select Currency Code"
                  value={formik.values.pscurcde || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                  isDisabled={mode === "VIEW" || mode === "EDIT" ? true : false}
                >
                  {ddlData?.CURRCY?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.pscurcde && (
                  <FormErrorMessage>{formik.errors.pscurcde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pscurrat"
                isInvalid={Boolean(formik.errors.pscurrat) && Boolean(formik.touched.pscurrat)}
              >
                <FormLabel>Currency Rate</FormLabel>
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
                      name="pscurrat"
                      // placeholder="Enter referee amount"
                      value={numberWithCommas(formik.values.pscurrat)}
                      pattern={numberPattern}
                      onChange={(event) =>
                        formik.handleChange({
                          target: {
                            value: parseThousandsToNumber(event.target.value),
                            name: "pscurrat",
                          },
                        })
                      }
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                </Stack>
                {formik.errors.pscurrat && (
                  <FormErrorMessage>{formik.errors.pscurrat}</FormErrorMessage>
                )}
              </FormControl>

              {
                mode === 'EDIT' || mode === 'VIEW' ? (
                  <FormControl
                    id="pscursts"
                    isInvalid={Boolean(formik.errors.pscursts) && Boolean(formik.touched.pscursts)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <FormLabel>Active Status</FormLabel>
                    <Switch
                      id="pscursts"
                      name="pscursts"
                      isChecked={formik.values.pscursts}
                      onChange={handleStatusChange}
                      onBlur={formik.handleBlur}
                      size="md"
                      colorScheme={"green"}
                      sx={{
                        "span.chakra-switch__track:not([data-checked])": {
                          backgroundColor: Colors.DANGER,
                        },
                      }}
                    />
                    {formik.errors.pscursts && (
                      <FormErrorMessage>{formik.errors.pscursts}</FormErrorMessage>
                    )}
                  </FormControl>
                ) : ""
              }



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

