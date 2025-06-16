// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Switch,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchMetadatasDetail from "@app/hooks/selector/useFetchMetadatasDetail";
import { manageMetadata } from "@app/redux/metadata/slice";
import dayjs from "dayjs";
import { MetadataSchema } from "../@schemas/metadataSchema";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function MetadatasForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Metadata Detail" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] = useFetchMetadatasDetail(id);
  const [ddlData] = useFetchDDL({ code: ["MDAGRP", "MDASRC"] });

  const initialValues = {
    psmdasrc: "",
    psmdagrp: "",
    psmdafle: "",
    psmdafld: "",
    psmdasts: false,
    psmdastd: "",
    psmdalrc: "",
    psmdadsc: "",
    psmdadsp: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: MetadataSchema,
    onSubmit: (values) => {
      let {
        psmdafle,
        psmdafld,
        psmdagrp,
        psmdadsc,
        psmdadsp,
        psmdasts,
        psmdasrc,
      } = values;
      let postData = {
        id,
        psmdafle,
        psmdafld,
        psmdagrp,
        psmdadsc,
        psmdadsp,
        psmdasts: psmdasts === true ? "Y" : "N",
        psmdasrc,
      };
      onSubmit(postData);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        formik.setValues({
          ...detailData,
          psmdasts: detailData.psmdasts === "Y" ? true : false,
          id: detailData?.id,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: manageMetadata(data),
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

  const handleStatusChange = () => {
    formik.setFieldValue("psmdasts", !formik.values.psmdasts);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Notification Metadata Detail
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Notification Metadata Listing",
                href: `/metadata`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Notification Metadata Detail (" + mode + ")",
              },
            ]}
          />
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
            {mode && mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
      <Flex
        flexDir={{
          base: "column",
          lg: "row",
        }}
        gap={Spacing.gap}
        mt={Spacing.gap}
      >
        <Card className="grid grid-cols-1 gap-6">
          <Box>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <FormControl
                  id="psmdafld"
                  isInvalid={
                    Boolean(formik.errors.psmdafld) &&
                    Boolean(formik.touched.psmdafld)
                  }
                  isReadOnly={mode !== "ADD" ? true : false}
                >
                  
                  <CustomFormLabel labelText="Field Name"/>
                  <Input
                    placeholder={"Enter Field Name"}
                    type="text"
                    name="psmdafld"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psmdafld}
                  />
                  {formik.errors.psmdafld && (
                    <FormErrorMessage>
                      {formik.errors.psmdafld}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmdadsp"
                  isInvalid={
                    Boolean(formik.errors.psmdadsp) &&
                    Boolean(formik.touched.psmdadsp)
                  }
                >
                  
                  <CustomFormLabel labelText="Field Display Name"/>
                  <Input
                    placeholder={"Enter Field Display Name"}
                    type="text"
                    name="psmdadsp"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psmdadsp}
                  />
                  {formik.errors.psmdadsp && (
                    <FormErrorMessage>
                      {formik.errors.psmdadsp}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmdadsc"
                  isInvalid={
                    Boolean(formik.errors.psmdadsc) &&
                    Boolean(formik.touched.psmdadsc)
                  }
                >
                  
                  <CustomFormLabel labelText="Metadata Field Description"/>
                  <Input
                    placeholder={"Enter Metadata Field Description"}
                    type="text"
                    name="psmdadsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psmdadsc}
                  />
                  {formik.errors.psmdadsc && (
                    <FormErrorMessage>
                      {formik.errors.psmdadsc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {mode !== "ADD" && (
                  <>
                    {" "}
                    <FormControl
                      id="psmdastd"
                      isInvalid={
                        Boolean(formik.errors.psmdastd) &&
                        Boolean(formik.touched.psmdastd)
                      }
                    >
                      <FormLabel>Status Date</FormLabel>
                      <DatePicker
                        id="psmdastd"
                        name="psmdastd"
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        value={
                          formik.values.psmdastd
                            ? dayjs(formik.values.psmdastd)
                            : null
                        }
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "psmdastd" },
                          })
                        }
                        disabled={mode !== "ADD" ? true : false}
                      />
                      {formik.errors.psmdastd && (
                        <FormErrorMessage>
                          {formik.errors.psmdastd}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl
                      id="psmdasts"
                      isInvalid={
                        Boolean(formik.errors.psmdasts) &&
                        Boolean(formik.touched.psmdasts)
                      }
                    >
                      <FormLabel>Active</FormLabel>
                      <Switch
                        id="psmdasts"
                        name="psmdasts"
                        isChecked={formik.values.psmdasts}
                        onChange={handleStatusChange}
                        onBlur={formik.handleBlur}
                        size="md"
                        colorScheme={"green"}
                        sx={{
                          "span.chakra-switch__track:not([data-checked])": {
                            backgroundColor: Colors.DANGER,
                          },
                        }}
                      />
                      {formik.errors.psmdasts && (
                        <FormErrorMessage>
                          {formik.errors.psmdasts}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                )}
              </Box>
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <FormControl
                  id="psmdafle"
                  isInvalid={
                    Boolean(formik.errors.psmdafle) &&
                    Boolean(formik.touched.psmdafle)
                  }
                  isReadOnly={mode !== "ADD" ? true : false}
                >
                  
                  <CustomFormLabel labelText="File"/>
                  <Input
                    placeholder={"Enter File"}
                    type="text"
                    name="psmdafle"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psmdafle}
                  />
                  {formik.errors.psmdafle && (
                    <FormErrorMessage>
                      {formik.errors.psmdafle}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmdasrc"
                  isInvalid={
                    Boolean(formik.errors.psmdasrc) &&
                    Boolean(formik.touched.psmdasrc)
                  }
                >
                  
                  <CustomFormLabel labelText="Source"/>
                  <Select
                    placeholder="Please Select Source"
                    value={formik.values.psmdasrc}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={mode !== "ADD" ? true : false}
                  >
                    {ddlData?.MDASRC?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psmdasrc && (
                    <FormErrorMessage>
                      {formik.errors.psmdasrc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmdagrp"
                  isInvalid={
                    Boolean(formik.errors.psmdagrp) &&
                    Boolean(formik.touched.psmdagrp)
                  }
                >
                 
                  <CustomFormLabel labelText="Group"/>
                  <Select
                    placeholder="Please Select Group"
                    value={formik.values.psmdagrp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={mode !== "ADD" ? true : false}
                  >
                    {ddlData?.MDAGRP?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psmdagrp && (
                    <FormErrorMessage>
                      {formik.errors.psmdagrp}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {mode !== "ADD" && (
                  <FormControl
                    id="psmdalrc"
                    isInvalid={
                      Boolean(formik.errors.psmdalrc) &&
                      Boolean(formik.touched.psmdalrc)
                    }
                  >
                    <FormLabel>Last Received Date</FormLabel>
                    <DatePicker
                      id="psmdalrc"
                      name="psmdalrc"
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                      value={
                        formik.values.psmdalrc
                          ? dayjs(formik.values.psmdalrc)
                          : null
                      }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "psmdalrc" },
                        })
                      }
                      disabled={mode !== "ADD" ? true : false}
                    />
                    {formik.errors.psmdalrc && (
                      <FormErrorMessage>
                        {formik.errors.psmdalrc}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Box>
            </div>
          </Box>
        </Card>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {mode && mode !== "VIEW" && (
              <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
            )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
