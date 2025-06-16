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
import { getmanageHoliday, getholidayDetail } from "@app/redux/holiday/slice";
import useFetchHolidayDetail from "@app/hooks/selector/useFetchHolidayDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { HolidaySchema } from "@app/components/forms/@schemas/holidaySchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function HolidayForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Holiday" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const type = String(router.query?.type);
  const [typee, setTypee] = useState("");

  useEffect(() => {
    setTypee(type);
  })
  const [detailData] = useFetchHolidayDetail(id);

  const handleStatusChange = () => {
    formik.setFieldValue("psholsts", !formik.values.psholsts);
  };
  const initialValues = {
    psholcde: null,
    psholday: 1,
    psholdsc: null,
    pshollds: null,
    psholsts: true,
    psholstd: null,
    psholtyp: typee,
    psholdat: null
  };


  const [ddlData] = useFetchDDL({ code: ["HOLTYPE", "YESORNO"] });

  const defaultYear = 2000;


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: HolidaySchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psholcde,
        psholsts: detailData.psholsts == "Y" ? true : false,
        psholdat: dayjs(detailData.psholdat)
        , psholstd: dayjs(detailData.psholstd)
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getmanageHoliday({
        id: mode === "EDIT" ? data.id : "", ...data,
        psholsts: formik.values.psholsts ? "Y" : "N",
        psholday: formik.values.psholday ? formik.values.psholday : 1,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update item" : "Add item",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        // router.back();

        router.push({
          pathname: "/calendar/",
          query: {

            type:typee
          },
        })

      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          {type == "V" ? <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Annual Variable Public Holiday
          </Text> : <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Annual Fixed Public Holiday
          </Text>}
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Calendar",
              href: `/calendar`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Holiday Detail(" + mode + ")",
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
              buttonDefaultType={"BACK"} onclick={() => router.push({
                pathname: "/calendar/",
                query: {

                  type
                },
              })}
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
                id="psholtyp"
                isInvalid={Boolean(formik.errors.psholtyp) && Boolean(formik.touched.psholtyp)}
                isReadOnly
              >
                <CustomFormLabel labelText="Holiday Type" />
                <Select
                  placeholder="Select Holiday Type"
                  value={formik.values.psholtyp || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                  isDisabled
                >
                  {ddlData?.HOLTYPE?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psholtyp && (
                  <FormErrorMessage>{formik.errors.psholtyp}</FormErrorMessage>
                )}
              </FormControl>
              {
                type == "V" ? (<FormControl
                  id="psholdat"

                >
                  <CustomFormLabel labelText="Holiday Date" />
                  <DatePicker
                    id="psholdat"
                    name="psholdat"
                    style={{ width: "100%" }}
                    format={"DD/MM/YYYY"}

                    value={
                      formik.values.psholdat

                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psholdat" },
                      })
                    }
                    inputReadOnly={mode == "VIEW" ? true : false}
                    open={mode == "VIEW" ? false : undefined}
                    allowClear={mode == "VIEW" ? false : true}
                  />
                  {/* {formik.errors.psholdat && (
                        <FormErrorMessage>
                          {formik.errors.psholdat}
                        </FormErrorMessage>
                      )} */}
                </FormControl>) : (<FormControl
                  id="psholdat"

                >
                  <CustomFormLabel labelText="Holiday Date" />
                  <DatePicker
                    id="psholdat"
                    name="psholdat"
                    style={{ width: "100%" }}
                    format={"DD/MM"}

                    value={
                      formik.values.psholdat

                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psholdat" },
                      })
                    }
                    inputReadOnly={mode == "VIEW" ? true : false}
                    open={mode == "VIEW" ? false : undefined}
                    allowClear={mode == "VIEW" ? false : true}
                  />
                  {/* {formik.errors.psholdat && (
                        <FormErrorMessage>
                          {formik.errors.psholdat}
                        </FormErrorMessage>
                      )} */}
                </FormControl>)
              }
              {
                //    <FormControl
                //    id="psholcde"
                //    isInvalid={Boolean(formik.errors.psholcde) && Boolean(formik.touched.psholcde)}
                //    isReadOnly={mode === "VIEW" || mode === "EDIT" ? true : false}
                //  >
                //    {/* <FormLabel>Holiday*</FormLabel> */}
                //    <CustomFormLabel labelText="Holiday Code" />
                //    <Input
                //      placeholder={"Enter Holiday Code"}
                //      type="text"
                //      name="psholcde"
                //      onChange={formik.handleChange}
                //      value={formik.values.psholcde || ""}
                //      isDisabled={mode === "EDIT"}
                //    />
                //    {formik.errors.psholcde && (
                //      <FormErrorMessage>{formik.errors.psholcde}</FormErrorMessage>
                //    )}
                //  </FormControl>
              }
              {
                type == "V" && mode == "ADD" && (<FormControl
                  id="psholday"
                  isInvalid={Boolean(formik.errors.psholday) && Boolean(formik.touched.psholday)}
                >
                  <FormLabel>No. of Days</FormLabel>
                  <Stack spacing={4}>
                    <InputGroup>
                      <Input
                        type="text"
                        name="psholday"
                        placeholder="Enter No. of Days"
                        value={numberWithCommas(formik.values.psholday)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "psholday",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.psholday && (
                    <FormErrorMessage>{formik.errors.psholday}</FormErrorMessage>
                  )}
                </FormControl>)
              }
              <FormControl
                id="psholdsc"
                isInvalid={Boolean(formik.errors.psholdsc) && Boolean(formik.touched.psholdsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description" />
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="psholdsc"
                  onChange={formik.handleChange}
                  value={formik.values.psholdsc || ""}
                />
                {formik.errors.psholdsc && (
                  <FormErrorMessage>{formik.errors.psholdsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pshollds"
                isInvalid={Boolean(formik.errors.pshollds) && Boolean(formik.touched.pshollds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                {/* <CustomFormLabel labelText="Local Description" /> */}
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="pshollds"
                  onChange={formik.handleChange}
                  value={formik.values.pshollds || ""}
                />
                {formik.errors.pshollds && (
                  <FormErrorMessage>{formik.errors.pshollds}</FormErrorMessage>
                )}
              </FormControl>






            </Box>
            <Box display="flex" flexDir="column" gap={6} width="100%">

              <div className="flex flex-col sm:flex-row gap-6">

                {
                  // mode !== 'ADD' && (
                  // <FormControl
                  //   id="psholsts"
                  //   isInvalid={Boolean(formik.errors.psholsts) && Boolean(formik.touched.psholsts)}
                  // >
                  //   <FormLabel>Holiday Status</FormLabel>
                  //   <Switch
                  //     id="psholsts"
                  //     name="psholsts"
                  //     isChecked={formik.values.psholsts}
                  //     onChange={handleStatusChange}
                  //     onBlur={formik.handleBlur}
                  //     size="md"
                  //     colorScheme={"green"}
                  //     sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                  //   />
                  //   {formik.errors.psholsts && (
                  //     <FormErrorMessage>
                  //       {formik.errors.psholsts}
                  //     </FormErrorMessage>
                  //   )}
                  // </FormControl>
                  // )
                }

                {/* {mode === "EDIT" ?  */}
                {/* <FormControl
                  id="psholstd"
                  isInvalid={Boolean(formik.errors.psholstd) && Boolean(formik.touched.psholstd)}
                >
                  <FormLabel>Status Date</FormLabel>
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik.values.psholstd
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psholstd" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    disabled={true}
                  />
                  {formik.errors.psholstd && (
                    <FormErrorMessage>{formik.errors.psholstd}</FormErrorMessage>
                  )}
                </FormControl> */}
                {/* : null   } */}
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
                pathname: "/calendar/",
                query: {

                  type
                },
              })}
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

