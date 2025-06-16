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
import React, { ReactNode, useEffect, useState } from "react";
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
import { manageEntity, fetchEntityDetail } from "@app/redux/entity/slice";
import useFetchEntityDetail from "@app/hooks/selector/useFetchEntityDetail";
import useFetchDDLEntity from "@app/hooks/selector/useFetchDDLEntity";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageFeeCode } from "@app/redux/feeCode/api";
import { EntityAddSchema, EntityUpdateSchema } from "../@schemas/entitySchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import SubHeader from "@app/components/common/Header/SubHeader";



export default function EntityForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Entity" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;


  const [detailData] = useFetchEntityDetail(id);
  const [entities] = useFetchDDLEntity();

  const initialValues = {
    psentuid: "",
    psenttyp: "",
    psentstd: dayjs(),
    psentpid: "",
    psentssm: "",
    psentkpn: "",
    psentkpd: null,
    psentnme: "",
    psentjdt: dayjs(),
    psentdoi: null,
    psentad1: "",
    psentad2: "",
    psentpos: "",
    psentcty: "",
    psentsta: "",
    psentpic: "",
    psentphn: "",
    psentpem: "",
    psentsts: "A",
    psentrmk: "",
    psentpc2: "",
    psentpn2: "",
    psentpm2: "",
  };


  const [ddlData] = useFetchDDL({ code: ["STATE", "ENTSTS"] });



  const formik = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema: mode === "ADD" ? EntityAddSchema : EntityUpdateSchema,
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
          id: detailData.psentuid,
          psentkpd: detailData.psentkpd ? dayjs(formatDate(new Date(detailData.psentkpd), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
          psentjdt: detailData.psentjdt ? dayjs(formatDate(new Date(detailData.psentjdt), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
          psentdoi: detailData.psentdoi ? dayjs(formatDate(new Date(detailData.psentdoi), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
          psentstd: detailData.psentstd ? dayjs(formatDate(new Date(detailData.psentstd), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {

    const { success } = await sendRequest({
      fn: manageEntity({
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
  // useEffect(() => {
  //   console.log(formik.errors)
  // }, [formik.errors])

  return (
    <form onSubmit={formik.handleSubmit} id="form1">
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Entity Group Organization
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Entity Code",
              href: `/entity`
            },
            {
              title: `Entity Group Organization Detail`
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

      <Flex flexDir="row" gap={Spacing.containerPx}>


        <Card
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
        >

          <Box display="flex" flexDir="column" gap={5} width="100%">
            {/* <Text fontSize={'16pt'} fontWeight={500}>Entity Profile</Text> */}
            <SubHeader labelText="Entity Profile"/>
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentuid"
                isInvalid={Boolean(formik.errors.psentuid) && Boolean(formik.touched.psentuid)}
                isReadOnly={mode === "ADD" ? false : true}
              // width="50%"
              >
                <FormLabel>Entity Code <span style={{ color: 'red' }}>*</span></FormLabel>
                <Input
                  placeholder={"Enter Entity Code"}
                  type="text"
                  name="psentuid"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentuid || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentuid && (
                  <FormErrorMessage>{formik.errors.psentuid}</FormErrorMessage>
                )}
              </FormControl>

            </Box>
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentnme"
                isInvalid={Boolean(formik.errors.psentnme) && Boolean(formik.touched.psentnme)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Entity Name <span style={{ color: 'red' }}>*</span></FormLabel>
                <Input
                  placeholder={"Enter Entity Name"}
                  type="text"
                  name="psentnme"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentnme || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentnme && (
                  <FormErrorMessage>{formik.errors.psentnme}</FormErrorMessage>
                )}
              </FormControl>


            </Box>
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentsts"
                isInvalid={Boolean(formik.errors.psentsts) && Boolean(formik.touched.psentsts)}
              >
                <FormLabel>Status <span style={{ color: 'red' }}>*</span></FormLabel>
                <Select
                  placeholder="Select Status"
                  value={formik.values.psentsts || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW"}
                >
                  {ddlData?.ENTSTS?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psentsts && (
                  <FormErrorMessage>
                    {formik.errors.psentsts}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psentstd"
                isInvalid={Boolean(formik.errors.psentstd) && Boolean(formik.touched.psentstd)}
              // isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Status Date <span style={{ color: 'red' }}>*</span></FormLabel>
                <DatePicker disabled={true} style={{ width: '100%' }} value={formik.values.psentstd ? formik.values.psentstd : null} onChange={(date) => formik.setFieldValue('psentdoi', date ? date : null)} />

                {/* {formik.errors.psentstd && (
                    <FormErrorMessage>{formik.errors.psentstd}</FormErrorMessage>
                  )} */}
              </FormControl>
            </Box>
            {/* <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentdoi"
                isInvalid={Boolean(formik.errors.psentdoi) && Boolean(formik.touched.psentdoi)}
              // isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Date of Incorporation</FormLabel>
                <DatePicker disabled={mode === "VIEW"} style={{ width: '100%' }} value={formik.values.psentdoi ? formik.values.psentdoi : null} onChange={(date) => formik.setFieldValue('psentdoi', date ? date : null)} />

                {formik.errors.psentdoi && (
                  <FormErrorMessage>{formik.errors.psentdoi}</FormErrorMessage>
                )}
              </FormControl>
            </Box> */}

            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentjdt"
                isInvalid={Boolean(formik.errors.psentjdt) && Boolean(formik.touched.psentjdt)}
              // isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Date Joined <span style={{ color: 'red' }}>*</span></FormLabel>
                <DatePicker disabledDate={(current) =>
                  current && current.valueOf() > Date.now()
                }
                  disabled={mode === "VIEW"} style={{ width: '100%' }} value={formik.values.psentjdt ? formik.values.psentjdt : null} onChange={(date) => formik.setFieldValue('psentjdt', date ? date : null)} />

                {formik.errors.psentjdt && (
                  <FormErrorMessage>{formik.errors.psentjdt as ReactNode}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psentpid"
                isInvalid={Boolean(formik.errors.psentpid) && Boolean(formik.touched.psentpid)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Entity Group Code</FormLabel>
                <Select
                  placeholder="Select Entity Group Code"
                  value={formik.values.psentpid || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {Array.isArray(entities) && entities?.filter((ent: any) => !id || ent.psentuid !== id).map((option: any) => (
                    <option key={option.psentuid} value={option.psentuid}>
                      {option.psentuid + " - " +option.psentnme}
                    </option>
                  ))}
                </Select>
                {formik.errors.psentpid && (
                  <FormErrorMessage>{formik.errors.psentpid}</FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentssm"
                isInvalid={Boolean(formik.errors.psentssm) && Boolean(formik.touched.psentssm)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>SSM Number</FormLabel>
                <Input
                  placeholder={"Enter SSM Number"}
                  type="text"
                  name="psentssm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentssm || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentssm && (
                  <FormErrorMessage>{formik.errors.psentssm}</FormErrorMessage>
                )}
              </FormControl>

            </Box>
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentkpn"
                isInvalid={Boolean(formik.errors.psentkpn) && Boolean(formik.touched.psentkpn)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>KPKT License Number</FormLabel>
                <Input
                  placeholder={"Enter KPKT License Number"}
                  type="text"
                  name="psentkpn"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentkpn || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentkpn && (
                  <FormErrorMessage>{formik.errors.psentkpn}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psentkpd"
                isInvalid={Boolean(formik.errors.psentkpd) && Boolean(formik.touched.psentkpd)}
              // isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>KPKT License Expiry Date</FormLabel>
                <DatePicker disabled={mode === "VIEW"} style={{ width: '100%' }} value={formik.values.psentkpd ? formik.values.psentkpd : null} onChange={(date) => formik.setFieldValue('psentkpd', date ? date : null)} />

                {formik.errors.psentkpd && (
                  <FormErrorMessage>{formik.errors.psentkpd as ReactNode}</FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <Box display="flex" flexDir="row" gap={5} width="100%">
              <FormControl
                isReadOnly={mode === "VIEW"}
                id="psentrmk"
                isInvalid={Boolean(formik.errors.psentrmk) && Boolean(formik.touched.psentrmk)}
              >
                <FormLabel>Remarks</FormLabel>
                <Textarea>
                </Textarea>
                {formik.errors.psentrmk && (
                  <FormErrorMessage>
                    {formik.errors.psentrmk}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </Box>

        </Card>

        <Card
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
        >
          <Box display="flex" flexDir="column" gap={5} width="100%">
            {/* <Text fontSize={'16pt'} fontWeight={500}>Entity Contact and Address</Text> */}
            <SubHeader labelText="Entity Contact and Address"/>

            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentpic"
                isInvalid={Boolean(formik.errors.psentpic) && Boolean(formik.touched.psentpic)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Contact Person 1 <span style={{ color: 'red' }}>*</span></FormLabel>
                <Input
                  placeholder={"Enter Contact Person 1"}
                  type="text"
                  name="psentpic"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentpic || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentpic && (
                  <FormErrorMessage>{formik.errors.psentpic}</FormErrorMessage>
                )}
              </FormControl>

            </Box>
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentphn"
                isInvalid={Boolean(formik.errors.psentphn) && Boolean(formik.touched.psentphn)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Phone No. <span style={{ color: 'red' }}>*</span></FormLabel>
                <Input
                  placeholder={"Enter Person No."}
                  type="text"
                  name="psentphn"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentphn || ""}
                  isDisabled={mode === "VIEW"}
                />
                {formik.errors.psentphn && (
                  <FormErrorMessage>{formik.errors.psentphn}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psentpem"
                isInvalid={Boolean(formik.errors.psentpem) && Boolean(formik.touched.psentpem)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Email Address <span style={{ color: 'red' }}>*</span></FormLabel>
                <Input
                  placeholder={"Enter Email Address"}
                  type="text"
                  name="psentpem"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentpem || ""}
                  isDisabled={mode === "VIEW"}
                />
                {formik.errors.psentpem && (
                  <FormErrorMessage>{formik.errors.psentpem}</FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentpc2"
                isInvalid={Boolean(formik.errors.psentpc2) && Boolean(formik.touched.psentpc2)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Contact Person 2</FormLabel>
                <Input
                  placeholder={"Enter Contact Person 2"}
                  type="text"
                  name="psentpc2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentpc2 || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentpc2 && (
                  <FormErrorMessage>{formik.errors.psentpc2}</FormErrorMessage>
                )}
              </FormControl>

            </Box>
            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentpn2"
                isInvalid={Boolean(formik.errors.psentpn2) && Boolean(formik.touched.psentpn2)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Phone No.</FormLabel>
                <Input
                  placeholder={"Enter Phone No."}
                  type="text"
                  name="psentpn2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentpn2 || ""}
                  isDisabled={mode === "VIEW"}
                />
                {formik.errors.psentpn2 && (
                  <FormErrorMessage>{formik.errors.psentpn2}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psentpm2"
                isInvalid={Boolean(formik.errors.psentpm2) && Boolean(formik.touched.psentpm2)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Email Address</FormLabel>
                <Input
                  placeholder={"Enter Email Address"}
                  type="text"
                  name="psentpm2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentpm2 || ""}
                  isDisabled={mode === "VIEW"}
                />
                {formik.errors.psentpm2 && (
                  <FormErrorMessage>{formik.errors.psentpm2}</FormErrorMessage>
                )}
              </FormControl>
            </Box>

            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentad1"
                isInvalid={Boolean(formik.errors.psentad1) && Boolean(formik.touched.psentad1)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Address</FormLabel>
                <Textarea
                  placeholder={"Enter Address"}
                  // type="text"
                  name="psentad1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentad1 || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentad1 && (
                  <FormErrorMessage>{formik.errors.psentad1}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            {/* <Box display="flex" flexDir="row" gap={5} width="100%">
              <FormControl
                id="psentad2"
                isInvalid={Boolean(formik.errors.psentad2) && Boolean(formik.touched.psentad2)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <Input
                  placeholder={"Enter Address Line 2"}
                  type="text"
                  name="psentad2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentad2 || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentad2 && (
                  <FormErrorMessage>{formik.errors.psentad2}</FormErrorMessage>
                )}
              </FormControl>

            </Box> */}

            <Box display="flex" flexDir="row" gap={5} width="100%">

              <FormControl
                id="psentpos"
                isInvalid={Boolean(formik.errors.psentpos) && Boolean(formik.touched.psentpos)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>Postcode</FormLabel>
                <Input
                  placeholder={"Enter Postcode"}
                  type="text"
                  name="psentpos"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentpos || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentpos && (
                  <FormErrorMessage>{formik.errors.psentpos}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psentcty"
                isInvalid={Boolean(formik.errors.psentcty) && Boolean(formik.touched.psentcty)}
                isReadOnly={mode === "VIEW" ? true : false}
              // width="50%"
              >
                <FormLabel>City</FormLabel>

                <Input
                  placeholder={"Enter City"}
                  type="text"
                  name="psentcty"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psentcty || ""}
                // isDisabled={mode === "EDIT"}
                />
                {formik.errors.psentcty && (
                  <FormErrorMessage>{formik.errors.psentcty}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psentsta"
                isInvalid={Boolean(formik.errors.psentsta) && Boolean(formik.touched.psentsta)}
              >
                <FormLabel>State</FormLabel>
                <Select
                  placeholder="Select State"
                  value={formik.values.psentsta || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.STATE?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psentsta && (
                  <FormErrorMessage>
                    {formik.errors.psentsta}
                  </FormErrorMessage>
                )}
              </FormControl>

            </Box>

          </Box>

        </Card>
      </Flex>



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

