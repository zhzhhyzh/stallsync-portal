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
import { manageGenType } from "@app/redux/generalParam/slice";
import useFetchGeneralTypeDetail from "@app/hooks/selector/useFetchGeneralTypeDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { GeneralTypeSchema } from "@app/components/forms/@schemas/generalTypeSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function GeneralTypeForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "General Parameter" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] =
    useFetchGeneralTypeDetail(id);
  const [ddlData] = useFetchDDL({ code: ["GTMAND", "GTCAT"] });

  const initialValues = {
    prgtycde: "",
    prgtydsc: "",
    prgtylds: "",
    prgtylen: 0,
    prgtycat: "",
    prgtyman: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: GeneralTypeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if(Object.keys(detailData).length === 0) formik.resetForm();

      if(Object.keys(detailData).length > 0){
        formik.setValues({
          ...detailData,
          id: detailData?.prgtycde,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: manageGenType(data),
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
            General Type
          </Text>
          <Breadcrumbs breadcrumbItems={[
                {
                  title: "General Type",
                  href: `/generalParameter`,// Add parameter if needed eg. /generalParameter/?id=123
                },
                {
                  title: "General Type ("+ mode +")",
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
          {/* <Flex pt={3} pb={5} justifyContent="space-between">
            <Box className="flex flex-row items-center gap-2">
              <Text fontSize="lg" fontWeight={"bold"}>
                General Parameter{ " - " + mode}
              </Text>
            </Box>
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
          </Flex> */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="prgtycde"
                isInvalid={Boolean(formik.errors.prgtycde) && Boolean(formik.touched.prgtycde)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>General Type Code*</FormLabel> */}
                <CustomFormLabel labelText="General Type Code"/>
                <Input
                  placeholder={"Enter General Type Code"}
                  type="text"
                  name="prgtycde"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prgtycde}
                  isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.prgtycde && (
                  <FormErrorMessage>{formik.errors.prgtycde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prgtydsc"
                isInvalid={Boolean(formik.errors.prgtydsc) && Boolean(formik.touched.prgtydsc)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>General Type Description*</FormLabel> */}
                <CustomFormLabel labelText="General Type Description"/>
                <Input
                  placeholder={"Enter General Type Description"}
                  type="text"
                  name="prgtydsc"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prgtydsc}
                />
                {formik.errors.prgtydsc && (
                  <FormErrorMessage>{formik.errors.prgtydsc}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="prgtylds"
                isInvalid={Boolean(formik.errors.prgtylds) && Boolean(formik.touched.prgtylds)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <FormLabel>Local Description</FormLabel>
                <Input
                  placeholder={"Enter Local Description"}
                  type="text"
                  name="prgtylds"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prgtylds}
                />
                {formik.errors.prgtylds && (
                  <FormErrorMessage>{formik.errors.prgtylds}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="prgtylen"
                isInvalid={Boolean(formik.errors.prgtylen) && Boolean(formik.touched.prgtylen)}
              >
                {/* <FormLabel>Length*</FormLabel> */}
                <CustomFormLabel labelText="Length"/>
                <NumberInput
                  name="prgtylen"
                  min={0}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "prgtylen" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.prgtylen}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.prgtylen && (
                  <FormErrorMessage>
                    {formik.errors.prgtylen}
                  </FormErrorMessage>
                )}
              </FormControl> 
              <FormControl
                id="prgtyman"
                isInvalid={Boolean(formik.errors.prgtyman) && Boolean(formik.touched.prgtyman)}
              >
                {/* <FormLabel>Mandatory/Optional*</FormLabel> */}
                <CustomFormLabel labelText="Mandatory/Optional"/>
                <Select
                  placeholder="Please Select Mandatory/Optional"
                  value={formik.values.prgtyman}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.GTMAND?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.prgtyman && (
                  <FormErrorMessage>
                    {formik.errors.prgtyman}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="prgtycat"
                isInvalid={Boolean(formik.errors.prgtycat) && Boolean(formik.touched.prgtycat)}
              >
                {/* <FormLabel>Category*</FormLabel> */}
                <CustomFormLabel labelText="Category"/>
                <Select
                  placeholder="Please Select Category"
                  value={formik.values.prgtycat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.GTCAT?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.prgtycat && (
                  <FormErrorMessage>
                    {formik.errors.prgtycat}
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
