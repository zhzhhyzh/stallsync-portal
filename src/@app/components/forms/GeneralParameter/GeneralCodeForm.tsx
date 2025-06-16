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
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { manageGenCode, fetchGenTypeDetail } from "@app/redux/generalParam/slice";
import useFetchGeneralCodeDetail from "@app/hooks/selector/useFetchGeneralCodeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { GeneralCodeSchema } from "@app/components/forms/@schemas/generalCodeSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function GeneralCodeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "General Parameter" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const genCode = props.genCode;
  const genTypCode: string = props.genTypCode;

  const [detailData] = useFetchGeneralCodeDetail(id, genCode);

  const initialValues = {
    // id: id,
    prgtycde: mode === "ADD" ? genTypCode : "",
    prgecode: "",
    prgedesc: "",
    prgeldes: "",

  };

  const desc = String(router.query?.desc);


  function combineDesc(x: string) {
    return x + " - " + desc;
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: GeneralCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: manageGenCode(data),
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
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            General Code
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "General Type",
              href: `/generalParameter`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "General Code",
              href: `/generalParameter/generalCode/?id=${mode === "ADD" ? genTypCode : id}`,
            },
            {
              title: "General Code (" + mode + ")",
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
          {/* <div className="flex flex-col sm:flex-row gap-6"> */}
            <Box display="flex" flexDir="column" gap={6} width="50%">
              <FormControl
                id="prgtycde"
                isInvalid={Boolean(formik.errors.prgtycde) && Boolean(formik.touched.prgtycde)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>General Type Code*</FormLabel> */}
                <CustomFormLabel labelText="General Type Code" />
                <Input
                  placeholder={"Enter General Type Code"}
                  type="text"
                  name="prgtycde"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={combineDesc(formik.values.prgtycde)}

                  isDisabled
                />
                {formik.errors.prgtycde && (
                  <FormErrorMessage>{formik.errors.prgtycde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prgecode"
                isInvalid={Boolean(formik.errors.prgecode) && Boolean(formik.touched.prgecode)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>General Code*</FormLabel> */}
                <CustomFormLabel labelText="General Code" />
                <Input
                  placeholder={"Enter General Code"}
                  type="text"
                  name="prgecode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prgecode}
                  isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prgecode && (
                  <FormErrorMessage>{formik.errors.prgecode}</FormErrorMessage>
                )}
              </FormControl>
            {/* </Box>
            <Box display="flex" flexDir="column" gap={6} width="100%"> */}
              <FormControl
                id="prgedesc"
                isInvalid={Boolean(formik.errors.prgedesc) && Boolean(formik.touched.prgedesc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>General Code Description*</FormLabel> */}
                <CustomFormLabel labelText="General Code Description" />
                <Input
                  placeholder={"Enter General Code Description"}
                  type="text"
                  name="prgedesc"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prgedesc}
                />
                {formik.errors.prgedesc && (
                  <FormErrorMessage>{formik.errors.prgedesc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prgeldes"
                isInvalid={Boolean(formik.errors.prgeldes) && Boolean(formik.touched.prgeldes)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="prgeldes"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prgeldes}
                />
                {formik.errors.prgeldes && (
                  <FormErrorMessage>{formik.errors.prgeldes}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
          {/* </div> */}
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
