// @ts-ignore  
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
  Switch,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  HStack,
  Checkbox,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag, Tooltip } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoAddSharp, IoChevronBack, IoCloseCircle, IoEye, IoSave, IoEyeOff } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineCheckCircle, AiOutlineLeft } from "react-icons/ai";
import { WorkgroupUserSchema } from "../@schemas/workgroupUserSchema";

import { getLinkWorkgroupUser } from "@app/redux/workgroupuser/slice";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { LinkIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function WorkgroupUserForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Workgroup User" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;


  const initialValues = {
    prwrkusr: "",
    prwrkcde: "",
    prspvind: false, //false T/F or Y/N
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: WorkgroupUserSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });


  const handleStatusChange = () => {
    formik.setFieldValue("prspvind", !formik.values.prspvind);
  };

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: getLinkWorkgroupUser({
        ...data,
        prwrkcde: id,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "UNLINK" ? "Link Record" : "Unlink Record",
          message: mode !== "LINK" ? "Record Unlinked" : "Record Linked",
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
            Workgroup User
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Workgroup",
              href: `/workgroups`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Workgroup User",
              //   href: `/workgroup`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Workgroup User (" + mode + ")",
            },
          ]} />
        </Flex>
        <Flex justifyContent="flex-end" pl={10} pr={5} pt={5} >
          <Box>
            <Space size="small">
              <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
              <Buttons buttonDefaultType={"LINK"} buttonLoading={loading} />
            </Space>
          </Box>
        </Flex>
        {/* <Box
          display={"flex"}
          alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
        >
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                  <Buttons buttonDefaultType={"LINK"} buttonLoading={loading} />
                // <Tooltip title="Link">
                // <LinkIcon />
                // </Tooltip>
            )}
          </Space>
        </Box> */}
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
                id="prwrkusr"
                isInvalid={Boolean(formik.errors.prwrkusr) && Boolean(formik.touched.prwrkusr)}
                isReadOnly={mode === "EDIT" ? true : false}
              >
                {/* <FormLabel>Username*</FormLabel> */}
                <CustomFormLabel labelText="Username"/>
                <Input
                  placeholder={"Enter Workgroup Username"}
                  type="text"
                  name="prwrkusr"
                  onChange={formik.handleChange}
                  value={formik.values.prwrkusr}
                //   isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prwrkusr && (
                  <FormErrorMessage>{formik.errors.prwrkusr}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prwrkcde"
                isInvalid={Boolean(formik.errors.prwrkcde) && Boolean(formik.touched.prwrkcde)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Workgroup Code *</FormLabel> */}
                <CustomFormLabel labelText="Workgroup Code"/>
                <Input
                  placeholder={"Enter Workgroup Code"}
                  type="text"
                  name="prwrkcde"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prwrkcde || id}
                //   isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prwrkcde && (
                  <FormErrorMessage>{formik.errors.prwrkcde}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prspvind"
                isInvalid={Boolean(formik.errors.prspvind) && Boolean(formik.touched.prspvind)}
              >
                {/* <FormLabel>Supervisor Indicator*</FormLabel> */}
                <CustomFormLabel labelText="Supervisor Indicator"/>
                <Switch
                  id="prspvind"
                  name="prspvind"
                  size='md'
                  onChange={handleStatusChange}
                  isChecked={formik.values.prspvind}
                  colorScheme={"green"}
                  sx={{ 'columnSpan.chakra-switch__track:not([data-chacked])': { backgroundColor: Colors.DANGER } }}
                />
                {formik.errors.prspvind && (
                  <FormErrorMessage>
                    {formik.errors.prspvind}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>

          </div>
        </Box>
      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"LINK"} buttonLoading={loading} />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
