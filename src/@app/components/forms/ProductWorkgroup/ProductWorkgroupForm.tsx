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

import { QueueProductCodeSchema } from "../@schemas/queueProductCodeSchema";

import { linkProductQueue } from "@app/redux/product/slice";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import { LinkIcon } from "@fortawesome/react-fontawesome";
import { LinkIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLProdcode from "@app/hooks/selector/useFetchDDLPrdcde"


export default function ProductWorkgroupForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Queue Product" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const prquecod = props.prquecod;
  const prprodcd = props.prprodcd;
  const prquedesc = props.prquedesc;
  const psprdcde = props.psprdcde;

  //   const [detailData] = useFetchWorkgroupDetail(id);
  const [ddlData] = useFetchDDL({ code: ["FUNGRP", "ASGMTD"] });
  const [dd1Data] = useFetchDDLProdcode(psprdcde);

  const initialValues = {
    prquecod: "",
    prquedesc: "",
    prprodcd: "",
    prasgmtd: "",

  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: QueueProductCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  //   useEffect(() => {
  //     if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
  //       formik.setValues({
  //         ...detailData,
  //         id: detailData?.id,
  //       });
  //     }
  //   }, [detailData]);

  //   const handleSwitch = () => {
  //     formik.setFieldValue("prspvind", !formik.values.prspvind);
  //   };

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: linkProductQueue({
        ...data,
        // prprodcd: prprodcd,
        prquecod: prquecod,
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
            Queue Product
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Queue Code Parameter",
              href: `/queues`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            // {
            //   title: "Product Code",
            //   href: `/queue/queueProduct`,// Add parameter if needed eg. /generalParameter/?id=123
            // },
            {
              title: "Queue Product (" + mode + ")",
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
                <Buttons buttonDefaultType={"LINK"} buttonLoading={loading} />
                // <Tooltip title="Link">
                // <LinkIcon />
                // </Tooltip>
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
                isReadOnly
              >
                {/* <FormLabel>Queue Code*</FormLabel> */}
                <CustomFormLabel labelText="Queue Code"/>
                <Input
                  placeholder={"Enter Queue Code"}
                  type="text"
                  name="prquecod"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={prquecod}
                  value={`${prquecod} - ${prquedesc}`}
                  isDisabled
                //   isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prquecod && (
                  <FormErrorMessage>{formik.errors.prquecod}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prprodcd"
                isInvalid={Boolean(formik.errors.prprodcd) && Boolean(formik.touched.prprodcd)}
                isReadOnly={mode === "EDIT" ? true : false}
              >
                <CustomFormLabel labelText="Product Code"/>
                {/* <Input
                  placeholder={"Enter Product Code"}
                  type="text"
                  name="prprodcd"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prprodcd}
                /> */}
                <Select
                  placeholder={"Please select Product Code"}
                  value={formik.values.prprodcd}
                  onChange={formik.handleChange}
                  isDisabled={mode === "VIEW" || mode === "EDIT" ? true : false}
                >
                  {Array.isArray(dd1Data) && dd1Data.length > 0 ? (
                    dd1Data.map((option: any) => (
                    <option key={option.psprdcde} value={option.psprdcde}>
                      {option.psprdcde}
                    </option>
                  ))
                  ) : (
                    <option value="">No options available</option>
                  )}
                </Select>
                {formik.errors.prprodcd && (
                  <FormErrorMessage>{formik.errors.prprodcd}</FormErrorMessage>
                )}
              </FormControl>
              
              {/* <FormControl
                id="prasgmtd"
                isInvalid={Boolean(formik.errors.prasgmtd) && Boolean(formik.touched.prasgmtd)}
              >
                <CustomFormLabel labelText="Assignment Method"/>
                <Select
                  placeholder="Please Select Method"
                  value={formik.values.prasgmtd}
                  onChange={formik.handleChange}
                >
                  {ddlData?.ASGMTD?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.prasgmtd && (
                  <FormErrorMessage>
                    {formik.errors.prasgmtd}
                  </FormErrorMessage>
                )}
              </FormControl> */}
              </Box>
                          <Box display="flex" flexDir="column" gap={6} width="100%">

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
