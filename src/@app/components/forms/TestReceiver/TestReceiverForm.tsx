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
  Switch,
  Textarea,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { AutoComplete, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchTestReceiverDetail from "@app/hooks/selector/useFetchTestReceiverDetail";
import useFetchDDLUser from "@app/hooks/selector/useFetchDDLUser";
import { add, update } from "@app/redux/testReceiver/slice";
import { TestReceiversSchema } from "../@schemas/testReceiversSchema";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function TestReceiverForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Test Receiver" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] = useFetchTestReceiverDetail(id);
  const [ddlData] = useFetchDDL({ code: ["TRCTYPE"] });
  const [ddlUserData] = useFetchDDLUser();

  const { Option } = AutoComplete;
  const [userSource, setUserSource] = useState<any[]>([]);

  const initialValues = {
    psusrunm: "",
    pstrctyp: "",
    pstrcphm: "",
    psapptkn: "",
    psusrnam: "",
    psusreml: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TestReceiversSchema,
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
          id: id,
        });
      }
    }
  }, [detailData]);

  useEffect(() => {
    if (Array.isArray(ddlUserData)) {
      setUserSource(ddlUserData);
    }
  }, [ddlUserData]);

  function handleUserSearch(value: string) {
    const filteredOptions = (
      Array.isArray(ddlUserData) ? ddlUserData : []
    ).filter((user: any) =>
      user.psusrunm.toLowerCase().includes(value.toLowerCase())
    );

    formik.setFieldValue("psusrnam", filteredOptions[0]?.psusrnam || "");
    formik.setFieldValue("psusreml", filteredOptions[0]?.psusreml || "");
    setUserSource(filteredOptions);
  }

  async function onSubmit(data: any) {
    let { psusrunm, pstrctyp, pstrcphm, psrsvsts, psapptkn } = data;
    let postData = {
      psusrunm,
      pstrctyp,
      pstrcphm,
      psapptkn,
    };

    const { success } = await sendRequest({
      fn: mode === "EDIT" ? update(postData) : add(postData),
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
            Test Recipients
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Test Recipients",
                href: `/testReceiver`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "Test Recipients (" + mode + ")",
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
      <Flex flexDir={"row"} gap={Spacing.gap} mt={Spacing.gap}>
        <Box w={"100%"}>
          <Card className="grid grid-cols-1 gap-6">
            <Box>
              <div className="flex flex-col sm:flex-row gap-6">
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  <FormControl
                    id="psusrunm"
                    isInvalid={
                      Boolean(formik.errors.psusrunm) &&
                      Boolean(formik.touched.psusrunm)
                    }
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    <CustomFormLabel labelText="User ID"/>
                    <AutoComplete
                      id="psusrunm"
                      style={{
                        width: "100%",
                      }}
                      status={
                        Boolean(formik.errors.psusrunm) &&
                        Boolean(formik.touched.psusrunm)
                          ? "error"
                          : ""
                      }
                      dataSource={userSource}
                      onSearch={handleUserSearch}
                      placeholder="Search User"
                      size="large"
                      onChange={(value) => {
                        formik.handleChange({
                          target: { value, name: "psusrunm" },
                        });

                        const filteredOptions = (
                          Array.isArray(ddlUserData) ? ddlUserData : []
                        ).filter((user: any) =>
                          user.psusrunm
                            .toLowerCase()
                            .includes(value.toLowerCase())
                        );

                        formik.setFieldValue(
                          "psusrnam",
                          filteredOptions[0]?.psusrnam || ""
                        );
                        formik.setFieldValue(
                          "psusreml",
                          filteredOptions[0]?.psusreml || ""
                        );
                      }}
                      notFoundContent="Not found"
                      onSelect={(value, option) => {
                        const filteredOptions = (
                          Array.isArray(ddlUserData) ? ddlUserData : []
                        ).filter((user: any) =>
                          user.psusrunm
                            .toLowerCase()
                            .includes(value.toLowerCase())
                        );

                        formik.setFieldValue(
                          "psusrnam",
                          filteredOptions[0]?.psusrnam || ""
                        );
                        formik.setFieldValue(
                          "psusreml",
                          filteredOptions[0]?.psusreml || ""
                        );
                      }}
                      onBlur={() => {
                        formik.handleBlur;
                        if (formik.values.psusrunm === "") {
                          formik.setFieldValue("psusrnam", "");
                          formik.setFieldValue("psusreml", "");
                        }
                      }}
                      value={formik.values.psusrunm}
                      disabled={mode !== "ADD" ? true : false}
                    >
                      {userSource.map((option: any) => (
                        <Option key={option.psusrunm} value={option.psusrunm}>
                          {option.psusrunm} - {option.psusrnam}
                        </Option>
                      ))}
                    </AutoComplete>
                    {formik.errors.psusrunm && (
                      <FormErrorMessage>
                        {formik.errors.psusrunm}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psusrnam"
                    isInvalid={
                      Boolean(formik.errors.psusrnam) &&
                      Boolean(formik.touched.psusrnam)
                    }
                    isReadOnly={true}
                  >
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder={"Enter Name"}
                      type="text"
                      name="psusrnam"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psusrnam}
                    />
                    {formik.errors.psusrnam && (
                      <FormErrorMessage>
                        {formik.errors.psusrnam}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="pstrctyp"
                    isInvalid={
                      Boolean(formik.errors.pstrctyp) &&
                      Boolean(formik.touched.pstrctyp)
                    }
                  >
                    
                    <CustomFormLabel labelText="Notification Type"/>
                    <Select
                      placeholder="Please Select Notification Type"
                      value={formik.values.pstrctyp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isDisabled={mode !== "ADD" ? true : false}
                    >
                      {ddlData?.TRCTYPE?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.pstrctyp && (
                      <FormErrorMessage>
                        {formik.errors.pstrctyp}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Box display="flex" flexDir="column" gap={6} width="100%">
                  {mode !== "ADD" && (
                    <FormControl
                      id="psapptkn"
                      isInvalid={
                        Boolean(formik.errors.psapptkn) &&
                        Boolean(formik.touched.psapptkn)
                      }
                    >
                      <FormLabel>Device ID</FormLabel>
                      <Input
                        placeholder={"Device ID"}
                        type="text"
                        name="psapptkn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.psapptkn}
                      />
                      {formik.errors.psapptkn && (
                        <FormErrorMessage>
                          {formik.errors.psapptkn}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}

                  <FormControl
                    id="psusreml"
                    isInvalid={
                      Boolean(formik.errors.psusreml) &&
                      Boolean(formik.touched.psusreml)
                    }
                    isReadOnly={true}
                  >
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      placeholder={"Enter Email Address"}
                      type="text"
                      name="psusreml"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psusreml}
                    />
                    {formik.errors.psusreml && (
                      <FormErrorMessage>
                        {formik.errors.psusreml}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="pstrcphm"
                    isInvalid={
                      Boolean(formik.errors.pstrcphm) &&
                      Boolean(formik.touched.pstrcphm)
                    }
                  >
                    <FormLabel>Remarks</FormLabel>
                    <Textarea
                      name="pstrcphm"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.pstrcphm}
                    />
                    {formik.errors.pstrcphm && (
                      <FormErrorMessage>
                        {formik.errors.pstrcphm}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </div>
            </Box>
          </Card>
        </Box>
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
