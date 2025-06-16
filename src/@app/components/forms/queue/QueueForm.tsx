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

import { Space, Tag } from "antd";
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
// import useFetchFunctionsDetail from "@app/hooks/selector/useFetchFunctionsDetail";
// import { manageFunctions } from "@app/redux/functions/slice";
// import { FunctionsSchema } from "../schemas/functionsShema";
import { queueSchema } from "../@schemas/queueSchema";

import useFetchQueueDetail from "@app/hooks/selector/useFetchQueueDetail";
// import { getManageQueue } from "@app/redux/workgroup/slice";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { getManageQueue } from "@app/redux/queue/slice";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
// import useFetchQueueDetail from "@app/hooks/selector/useFetchQueueDetail";

export default function QueueForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Queue Code" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] = useFetchQueueDetail(id);
  const [ddlData] = useFetchDDL({ code: ["SLA"] });

  const initialValues = {
    id: id,
    prquecod: "",
    prquedesc: "",
    prslafreq: "",
    prslafcde: "",
    prcaspre: "",
    prqueldsc: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: queueSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      if (Object.keys(detailData).length === 0) formik.resetForm();
      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          // id: detailData?.id,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: mode === "ADD" ? getManageQueue(data) : getManageQueue({
        ...data,
        id: id,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update Record" : "Add Record",
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
            Queue Code
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Queue Code",
              href: `/queues`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Queue Code (" + mode + ")",
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
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
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
          <Box display="flex" flexDir="row" gap={5} width="100%">
            <Box display="flex" flexDir="column" gap={5} width="100%">
              <FormControl
                id="prquecod"
                isInvalid={Boolean(formik.errors.prquecod) && Boolean(formik.touched.prquecod)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Queue Code*</FormLabel> */}
                <CustomFormLabel labelText="Queue Code"/>
                <Input
                  placeholder={"Enter Queue Code"}
                  type="text"
                  name="prquecod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prquecod}
                isDisabled={mode === "EDIT" ? true : false}

                />
                {formik.errors.prquecod && (
                  <FormErrorMessage>{formik.errors.prquecod}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prquedesc"
                isInvalid={Boolean(formik.errors.prquedesc) && Boolean(formik.touched.prquedesc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Description*</FormLabel> */}
                <CustomFormLabel labelText="Description"/>
                <Input
                  placeholder={"Enter Queue Code Description"}
                  type="text"
                  name="prquedesc"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prquedesc}
                // isReadOnly={mode === "VIEW" ? true : false}
                // isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prquedesc && (
                  <FormErrorMessage>{formik.errors.prquedesc}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prqueldsc"
                isInvalid={Boolean(formik.errors.prqueldsc) && Boolean(formik.touched.prqueldsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="prqueldsc"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prqueldsc}
                />
                {formik.errors.prqueldsc && (
                  <FormErrorMessage>{formik.errors.prqueldsc}</FormErrorMessage>
                )}
              </FormControl>
            </Box>

             <Box display="flex" flexDir="column" gap={6} width="100%">
             <FormControl
                id="prcaspre"
                isInvalid={Boolean(formik.errors.prcaspre) && Boolean(formik.touched.prcaspre)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Case Prefix*</FormLabel> */}
                <CustomFormLabel labelText="Case Prefix"/>
                <Input
                  placeholder={"Enter Case Prefix"}
                  type="text"
                  name="prcaspre"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prcaspre}

                />
                {formik.errors.prcaspre && (
                  <FormErrorMessage>{formik.errors.prcaspre}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prslafreq"
                isInvalid={Boolean(formik.errors.prslafreq) && Boolean(formik.touched.prslafreq)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>SLA Frequency</FormLabel>
                <Input
                  placeholder={"Enter SLA Frequency"}
                  type="number"
                  name="prslafreq"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prslafreq}
                />
                {formik.errors.prslafreq && (
                  <FormErrorMessage>{formik.errors.prslafreq}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prslafcde"
                onChange={formik.handleChange}
                isInvalid={Boolean(formik.errors.prslafcde) && Boolean(formik.touched.prslafcde)}
                isReadOnly={mode === "VIEW" ? true : false}

              >
                <FormLabel>SLA Frequency Code</FormLabel>
                <Select placeholder={"Please select Type"}
                  value={formik.values.prslafcde}
                  onChange={formik.handleChange}
                >
                  {
                    ddlData?.SLA?.map((option: any) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))

                  }
                </Select>

                {formik.errors.prslafcde && (
                  <FormErrorMessage>{formik.errors.prslafcde}</FormErrorMessage>
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
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
