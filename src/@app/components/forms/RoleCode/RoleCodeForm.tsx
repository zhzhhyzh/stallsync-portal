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
import { getManageRoleCode, getRoleCodeDetail } from "@app/redux/role/slice";
import useFetchRoleCodeDetail from "@app/hooks/selector/useFetchRoleCodeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageRoleCode } from "@app/redux/role/api";
import { RoleCodeSchema } from "@app/components/forms/@schemas/roleCodeSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function RoleCodeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Role" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchRoleCodeDetail(id);

  const initialValues = {
    psrolcde: null,
    psroldsc: null,
    psrollds: null,

    psrolibi: null,
    psrolibm: null,

  };


  const [ddlData] = useFetchDDL({ code: ["DATAACCESS"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RoleCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psrolcde,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageRoleCode({
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
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Role
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Role",
              href: `/roleCode`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Role(" + mode + ")",
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
                id="psrolcde"
                isInvalid={Boolean(formik.errors.psrolcde) && Boolean(formik.touched.psrolcde)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Transaction Code*</FormLabel> */}
                <CustomFormLabel labelText="User Role" />
                <Input
                  placeholder={"Enter User Role"}
                  type="text"
                  name="psrolcde"
                  onChange={formik.handleChange}
                  value={formik.values.psrolcde || ""}
                  isDisabled={mode === "EDIT"}
                />
                {formik.errors.psrolcde && (
                  <FormErrorMessage>{formik.errors.psrolcde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psroldsc"
                isInvalid={Boolean(formik.errors.psroldsc) && Boolean(formik.touched.psroldsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description" />
                <Input
                  placeholder={"Enter Description"}
                  type="text"
                  name="psroldsc"
                  onChange={formik.handleChange}
                  value={formik.values.psroldsc || ""}
                />
                {formik.errors.psroldsc && (
                  <FormErrorMessage>{formik.errors.psroldsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psrollds"
                isInvalid={Boolean(formik.errors.psrollds) && Boolean(formik.touched.psrollds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="psrollds"
                  onChange={formik.handleChange}
                  value={formik.values.psrollds || ""}
                />
                {formik.errors.psrollds && (
                  <FormErrorMessage>{formik.errors.psrollds}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psrolibi"
                isInvalid={Boolean(formik.errors.psrolibi) && Boolean(formik.touched.psrolibi)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Inter Branch Inquiry</FormLabel>
                <Select
                  placeholder="Select Inter Branch Inquiry"
                  value={formik.values.psrolibi || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.DATAACCESS?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psrolibi && (
                  <FormErrorMessage>{formik.errors.psrolibi}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psrolibm"
                isInvalid={Boolean(formik.errors.psrolibm) && Boolean(formik.touched.psrolibm)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Inter Branch Maintenance</FormLabel>
                <Select
                  placeholder="Select Inter Branch Maintenance"
                  value={formik.values.psrolibm || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.DATAACCESS?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psrolibm && (
                  <FormErrorMessage>{formik.errors.psrolibm}</FormErrorMessage>
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

