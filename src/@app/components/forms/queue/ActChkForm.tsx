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
  Textarea,
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

import { actChkSchema } from "../@schemas/actChkSchema";

import useFetchActChkDetail from "@app/hooks/selector/useFetchActChkDetail";
import useFetchChkFind from "@app/hooks/selector/useFetchChkFind";


import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { getManageActChk } from "@app/redux/queue/slice";
import usefetchQueueDetail from "@app/hooks/selector/useFetchQueueDetail";
import useFetchActivityDetail from "@app/hooks/selector/useFetchActivityDetail";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function ActChkForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Activity Checklist Parameter" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  //id been passed in (a number), not practcod
  const id = props.id;
  const mode = props.mode;
  const actID = props.actID;
  const file = String(router.query?.file);
  const practdesc = String(router.query?.practdesc);
  // const practcod = props.practcod;
  const practcod = String(router.query?.practcod);
  // const QueueID = props.QueueID;
  const QueueID = String(router.query?.QueueID);
  let prquedesc = String(router.query?.prquedesc);
  prquedesc= prquedesc.replace(/ /g, '+');
  // const [QueueData] = usefetchQueueDetail(QueueID);

  const [detailData] = useFetchActChkDetail(id);
  const [chkFindData] = useFetchChkFind(actID);
  // const [ActivitData] = useFetchActivityDetail(id);

  const initialValues = {
    id: id,
    prquecod: mode === "ADD" ? chkFindData.prquecod : "",
    prquedesc: mode === "ADD" ? chkFindData.prquedesc : "",
    practcod: mode === "ADD" ? chkFindData.practcod : "",
    practdesc: mode === "ADD" ? chkFindData.practdesc : "",
    practycde: "",
    prchklcod: "",
    prchkldsc: "",
    prchkllds: "",
    prchklrmk: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: actChkSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      if (Object.keys(detailData).length === 0) formik.resetForm();
      if (Object.keys(detailData).length > 0)
      // console.log(detailData, "detail data before formik.setvalues")
      {
        formik.setValues({
          ...detailData,
          id: detailData?.id,
          prquecod: detailData.prquecod,
          prquedesc: detailData.prquedesc,
          practdesc: detailData.practydsc,
          practcod: detailData.practycde,
          prchklcod: detailData.prchklcod,
          prchkldsc: detailData.prchkldsc,
          prchkllds: detailData.prchkllds,
          prchklrmk: detailData.prchklrmk,
        });

        // console.log(formik.values.practycde, "after formik values")
      }
      else {
        formik.setValues({
          ...chkFindData,
          practcod: chkFindData.practcod,
          prquedesc: chkFindData.prquedesc,
          practydsc: chkFindData.practydsc,
          practdesc: chkFindData.practdesc,
          // prquecod: QueueData.prquecod,
          // prquedesc: QueueData.prquedesc,
          // practcod: ActivitData.practcod,
          // practycde: ActivitData.practycde,
          // practdesc: ActivitData.practdesc,
        })
      }
    }
  }, [detailData, chkFindData]);



  async function onSubmit(data: any) {
    // console.log(data, "data hereeeeee")
    const { success } = await sendRequest({
      fn: mode === "ADD" ? getManageActChk(data) : getManageActChk({
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
            Activity Checklist Parameter
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Queue Code Parameter",
              href: "/queues",
            },
            {
              title: "Queue Activity Parameter",
              href: `/queues/activity/?QueueID=${QueueID}&id=&prquedesc=${prquedesc}`,

            },
            {
              title: "Activity Checklist Parameter",
              href: `/queues/activity/actChkl/?actID=${actID}&practcod=${practcod}&prquedesc=${prquedesc}&practdesc=${practdesc}&QueueID=${QueueID}&id=&file=${file}`,// Add parameter if needed eg. /generalParameter/?id=123
          
            },
            {
              title: "Activity Checklist Parameter(" + mode + ")",
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
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="prquecod"
                isInvalid={Boolean(formik.errors.prquecod) && Boolean(formik.touched.prquecod) || Boolean(formik.errors.prquedesc) && Boolean(formik.touched.prquedesc)}
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
                  // value={mode === "ADD" ? prquecod : formik.values.prquecod}
                  value={`${formik.values.prquecod} - ${formik.values.prquedesc}`}

                  isDisabled

                />
                {/* {formik.errors.prquecod && (
                  <FormErrorMessage>{formik.errors.prquecod}</FormErrorMessage>
                )} */}
              </FormControl>

              <FormControl
                id="practcod"
                isInvalid={Boolean(formik.errors.practcod) && Boolean(formik.touched.practcod) || Boolean(formik.errors.practdesc) && Boolean(formik.touched.practdesc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Activity Code"/>

                <Input
                  placeholder={"Enter Activity Code"}
                  type="text"
                  name="practcod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={mode === "ADD" ? practcod : formik.values.practcod}
                  value={`${formik.values.practcod} - ${formik.values.practdesc}`}

                  isDisabled
                />
                {/* {formik.errors.practcod && (
                  <FormErrorMessage>{formik.errors.practcod}</FormErrorMessage>
                )} */}
              </FormControl>

              <FormControl
                id="prchklcod"
                isInvalid={Boolean(formik.errors.prchklcod) && Boolean(formik.touched.prchklcod)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Activity Checklist Code"/>

                {/* <FormLabel>Activity Checklist Code</FormLabel> */}
                <Input
                  placeholder={"Enter Actvity Checklist Code"}
                  type="text"
                  name="prchklcod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prchklcod}
                  isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prchklcod && (
                  <FormErrorMessage>{formik.errors.prchklcod}</FormErrorMessage>
                )}
              </FormControl>


              <FormControl
                id="prchkldsc"
                isInvalid={Boolean(formik.errors.prchkldsc) && Boolean(formik.touched.prchkldsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Activity Checklist Code Description*</FormLabel> */}
                <CustomFormLabel labelText="Activity Checklist Code Description"/>
                <Input
                  placeholder={"Enter Actvity Checklist Code Description"}
                  type="text"
                  name="prchkldsc"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prchkldsc}
                // isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prchkldsc && (
                  <FormErrorMessage>{formik.errors.prchkldsc}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prchkllds"
                isInvalid={Boolean(formik.errors.prchkllds) && Boolean(formik.touched.prchkllds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Activity Checklist Code Local Description</FormLabel>
                <Input
                  placeholder={"Enter Actvity Checklist Code Local Description"}
                  type="text"
                  name="prchkllds"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prchkllds}
                // isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prchkllds && (
                  <FormErrorMessage>{formik.errors.prchkllds}</FormErrorMessage>
                )}
              </FormControl>
                  </Box>
                  <Box display="flex" flexDir="column" gap={6} width="100%">

              <FormControl
                id="prchklrmk"
                isInvalid={Boolean(formik.errors.prchklrmk) && Boolean(formik.touched.prchklrmk)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Activity Checklist Remark</FormLabel>
                <Textarea
                  name="prchklrmk"
                  placeholder={"Enter Actvity Checklist Remark"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prchklrmk}
                  style={{
                    fontSize: 14,
                    width: "100%",
                    height: "160px",
                    resize: "vertical",
                  }}
                />

                {/* <Input
                  placeholder={"Enter Actvity Checklist Remark"}
                  type="text"
                  name="prchklrmk"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prchklrmk}
                // isDisabled={mode === "EDIT" ? true : false}
                /> */}
                {formik.errors.prchklrmk && (
                  <FormErrorMessage>{formik.errors.prchklrmk}</FormErrorMessage>
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
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
