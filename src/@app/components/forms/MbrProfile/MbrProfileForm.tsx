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
  InputGroup,
  Stack,
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";

import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
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
import { getmanageMbr } from "@app/redux/mbrProfile/slice";
import useFetchMbrProfileDetail from "@app/hooks/selector/useFetchMbrProfileDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageTranCode } from "@app/redux/tranCode/api";
import { MbrProfileSchema } from "@app/components/forms/@schemas/mbrProfileSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function MbrProfileForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Member Profile" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchMbrProfileDetail(id);

  const initialValues = {
    psmbruid: "",
    psmbrnam: "",
    psmbreml: "",
    psmbrdob: "",
    psmbracs: "",
    psmbrtyp: "",
    psmbrexp: "",
    psmbrjdt: "",
    psmbrcar: "",
    psusrnme: "",
    psmbrpre: "",
    psmbrphn: "",
    psmbrpts: 0,




  };


  const [ddlData] = useFetchDDL({ code: ["MBRTYP", "HPPRE"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: MbrProfileSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData?.psmbruid,
      });

    }

  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getmanageMbr({
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
        router.back();
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Member Profile
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Member Profile",
              href: `/tranCode`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Member Profile (" + mode + ")",
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
              <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                <FormControl
                  id="psmbruid"
                  isInvalid={Boolean(formik.errors.psmbruid) && Boolean(formik.touched.psmbruid)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Member Id</FormLabel>
                  {/* <CustomFormLabel labelText="Member Id" /> */}
                  <Input
                    placeholder={"Enter Member Id"}
                    type="text"
                    name="psmbruid"
                    onChange={formik.handleChange}
                    value={formik.values.psmbruid || ""}
                    isDisabled={mode === "EDIT"}
                  />
                  {formik.errors.psmbruid && (
                    <FormErrorMessage>{formik.errors.psmbruid}</FormErrorMessage>
                  )}
                </FormControl>


                <FormControl
                  id="psusrnme"
                  isInvalid={Boolean(formik.errors.psusrnme) && Boolean(formik.touched.psusrnme)}
                  isReadOnly
                >
                  <FormLabel>Account Username</FormLabel>
                  {/* <CustomFormLabel labelText="Account Username" /> */}
                  <Input
                    placeholder={"Enter Account Username"}
                    type="text"
                    name="psusrnme"
                    onChange={formik.handleChange}
                    value={formik.values.psusrnme || ""}
                  />
                  {formik.errors.psusrnme && (
                    <FormErrorMessage>{formik.errors.psusrnme}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <FormControl
                id="psmbrnam"
                isInvalid={Boolean(formik.errors.psmbrnam) && Boolean(formik.touched.psmbrnam)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Member Name" />
                <Input
                  placeholder={"Enter Member Name"}
                  type="text"
                  name="psmbrnam"
                  onChange={formik.handleChange}
                  value={formik.values.psmbrnam || ""}
                />
                {formik.errors.psmbrnam && (
                  <FormErrorMessage>{formik.errors.psmbrnam}</FormErrorMessage>
                )}
              </FormControl>



              <FormControl
                id="psmbreml"
                isInvalid={Boolean(formik.errors.psmbreml) && Boolean(formik.touched.psmbreml)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Member Email" />
                <Input
                  placeholder={"Enter Member Email"}
                  type="text"
                  name="psmbreml"
                  onChange={formik.handleChange}
                  value={formik.values.psmbreml || ""}
                />
                {formik.errors.psmbreml && (
                  <FormErrorMessage>{formik.errors.psmbreml}</FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}  >
                <FormControl
                  id="psmbrpre"
                  isInvalid={Boolean(formik.errors.psmbrpre) && Boolean(formik.touched.psmbrpre)}
                >
                  {/* <FormLabel>Affect Code 1*</FormLabel> */}
                  <CustomFormLabel labelText="Phone No. Prefix" />
                  <Select
                    placeholder="Select Phone No. Prefix"
                    value={formik.values.psmbrpre || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                  // isDisabled={mode === "VIEW" ? true : false}
                  >
                    {ddlData?.HPPRE?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>{formik.errors.psmbrpre && (
                    <FormErrorMessage>{formik.errors.psmbrpre}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmbrphn"
                  isInvalid={Boolean(formik.errors.psmbrphn) && Boolean(formik.touched.psmbrphn)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Description*</FormLabel> */}
                  <CustomFormLabel labelText="Phone No." />
                  <Input
                    placeholder={"Enter Phone No."}
                    type="text"
                    name="psmbrphn"
                    onChange={formik.handleChange}
                    value={formik.values.psmbrphn || ""}
                  />
                  {formik.errors.psmbrphn && (
                    <FormErrorMessage>{formik.errors.psmbrphn}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>


              <FormControl
                id="psmbrdob"
                isInvalid={Boolean(formik.errors.psmbrdob) && Boolean(formik.touched.psmbrdob)}
              >
                <FormLabel>Date of Birth</FormLabel>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  value={
                    formik.values.psmbrdob == detailData.psmbrdob
                      ? dayjs(detailData.psmbrdob)
                      : dayjs(new Date())
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "psmbrdob" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  disabled={true}
                />
                {formik.errors.psmbrdob && (
                  <FormErrorMessage>{formik.errors.psmbrdob}</FormErrorMessage>
                )}
              </FormControl>


            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">

              <FormControl
                id="psmbrtyp"
                isInvalid={Boolean(formik.errors.psmbrtyp) && Boolean(formik.touched.psmbrtyp)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Member Type</FormLabel>
                {/* <CustomFormLabel labelText="Member Type" /> */}
                <Select
                  placeholder="Select Member Type"
                  value={formik.values.psmbrtyp || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                isDisabled
                >
                  {ddlData?.MBRTYP?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psmbrtyp && (
                  <FormErrorMessage>{formik.errors.psmbrtyp}</FormErrorMessage>
                )}
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                <FormControl
                  id="psmbracs"
                  isInvalid={Boolean(formik.errors.psmbracs) && Boolean(formik.touched.psmbracs)}
                  isReadOnly
                >
                  {
                    <FormLabel>Accumulated Spending</FormLabel>
                  }

                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="psmbracs"
                        placeholder="Enter Accumulated Spending"
                        value={numberWithCommas(formik.values.psmbracs)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "psmbracs",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.psmbracs && (
                    <FormErrorMessage>{formik.errors.psmbracs}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmbrpts"
                  isInvalid={Boolean(formik.errors.psmbrpts) && Boolean(formik.touched.psmbrpts)}
                  isReadOnly
                >
                  <FormLabel>Member Points</FormLabel>
                  <Input
                    placeholder="Enter Member Points"
                    type="number"
                    name="psmbrpts"
                    min="0"
                    step="1" 
                    value={(formik.values.psmbrpts || formik.values.psmbrpts === 0) ? formik.values.psmbrpts : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {  // only digits allowed
                        formik.handleChange(e);
                      }
                    }}
                  />
                  {formik.errors.psmbrpts && (
                    <FormErrorMessage>{formik.errors.psmbrpts}</FormErrorMessage>
                  )}
                </FormControl>


              </Flex>
              <Flex justifyContent="space-between" alignItems="center" gap={5}  >

                <FormControl
                  id="psmbrjdt"
                  isInvalid={Boolean(formik.errors.psmbrjdt) && Boolean(formik.touched.psmbrjdt)}
                >
                  <FormLabel>Join Date</FormLabel>
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik.values.psmbrjdt == detailData.psmbrjdt
                        ? dayjs(detailData.psmbrjdt)
                        : dayjs(new Date())
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psmbrjdt" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    disabled={true}
                  />
                  {formik.errors.psmbrjdt && (
                    <FormErrorMessage>{formik.errors.psmbrjdt}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  id="psmbrexp"
                  isInvalid={Boolean(formik.errors.psmbrexp) && Boolean(formik.touched.psmbrexp)}
                >
                  <FormLabel>Expiry Date</FormLabel>
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    value={
                      formik.values.psmbrexp == detailData.psmbrexp
                        ? dayjs(detailData.psmbrexp)
                        : dayjs(new Date())
                    }
                    onChange={(value) =>
                      formik.handleChange({
                        target: { value, name: "psmbrexp" },
                      })
                    }
                    onBlur={formik.handleBlur}
                    disabled={true}
                  />
                  {formik.errors.psmbrexp && (
                    <FormErrorMessage>{formik.errors.psmbrexp}</FormErrorMessage>
                  )}
                </FormControl>
              </Flex>
              <FormControl
                id="psmbrcar"
                isInvalid={Boolean(formik.errors.psmbrcar) && Boolean(formik.touched.psmbrcar)}
                isReadOnly
              >
                <FormLabel>Member Cart No.</FormLabel>
                {/* <CustomFormLabel labelText="Member Cart No." /> */}
                <Input
                  placeholder={"Enter Member Cart No."}
                  type="text"
                  name="psmbrcar"
                  onChange={formik.handleChange}
                  value={formik.values.psmbrcar || ""}
                />
                {formik.errors.psmbrcar && (
                  <FormErrorMessage>{formik.errors.psmbrcar}</FormErrorMessage>
                )}
              </FormControl>
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

