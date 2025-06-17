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
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

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
import { manageAdmin } from "@app/redux/adminAccounts/slice";
import useFetchAdminAccountsDetail from "@app/hooks/selector/useFetchAdminAccountsDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import {
  AdminAccountSchema,
  AdminAccountSchemaAdd,
} from "@app/components/forms/@schemas/adminAccountSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import Accessibility from "@app/components/pages/accessibility/Accessibility";

export default function AdminAccountsForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Admin Account" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] = useFetchAdminAccountsDetail(id);

  const [ddlData] = useFetchDDL({ code: ["USRSTS", "HPPRE", "USRROLE"] });

  const initialValues = {
    psusrunm: "",
    psusrnam: "",
    psusrphn: "",
    psusreml: "",
    psusrpwd: "",
    psusrrol: "",
    psusrsts: "",
    psusrpre: "",
    psisagnt: "N",
    //psaplaid: "",
    psentuid: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema:
      mode === "ADD" ? AdminAccountSchemaAdd : AdminAccountSchema,
    onSubmit: (values) => {
      if (values.psisagnt == "N") {
        //values.psaplaid = "";
        values.psentuid = "";
      }
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
          psisagnt:
            detailData?.psisagnt != "" && detailData?.psisagnt == true
              ? "Y"
              : "N",
          id: detailData?.psusrunm,
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: manageAdmin(data),
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
            User Accounts
          </Text>
          {/* <CustomFormLabel labelText="Admin Account" /> */}
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "User Accounts",
                href: `/adminAccounts`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title: "User Accounts (" + mode + ")",
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
        <Box display={"flex"} flexDir={"column"} w={"100%"}>
          <Box>
            <Card className="grid grid-cols-1 gap-6">
              <Flex gap={6} flexDir={"column"}>
                <Flex>
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
                        {/* <FormLabel>User ID*</FormLabel> */}
                        <CustomFormLabel labelText="User ID" />
                        <Input
                          placeholder={"Enter User ID"}
                          type="text"
                          name="psusrunm"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psusrunm}
                          isDisabled={mode === "EDIT" ? true : false}
                        />
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
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        {/* <FormLabel>Name*</FormLabel> */}
                        <CustomFormLabel labelText="Name" />
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
                      {mode === "ADD" ? (
                        <FormControl
                          id="psusrpwd"
                          isInvalid={
                            Boolean(formik.errors.psusrpwd) &&
                            Boolean(formik.touched.psusrpwd)
                          }
                        >
                          {/* <FormLabel>Password*</FormLabel> */}
                          <CustomFormLabel labelText="Password" />
                          <Input
                            placeholder={"Enter Password"}
                            type="text"
                            name="psusrpwd"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.psusrpwd}
                          />
                          {formik.errors.psusrpwd && (
                            <FormErrorMessage>
                              {formik.errors.psusrpwd}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      ) : (
                        <FormControl
                          id="psusrrol"
                          isInvalid={
                            Boolean(formik.errors.psusrrol) &&
                            Boolean(formik.touched.psusrrol)
                          }
                        >
                          <FormLabel>User Role</FormLabel>
                          <Select
                            placeholder="Please Select User Role"
                            value={formik.values.psusrrol}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.USRROLE?.map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psusrrol && (
                            <FormErrorMessage>
                              {formik.errors.psusrrol}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      )}
                    </Box>
                    <Box display="flex" flexDir="column" gap={6} width="100%">
                      <FormControl
                        id="psusrpre"
                        isInvalid={Boolean(formik.errors.psusrpre) && Boolean(formik.touched.psusrpre)}
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        {/* <FormLabel>Debit/Credit*</FormLabel> */}
                        <CustomFormLabel labelText="Contact No. Prefix" />
                        <Select
                          placeholder="Select Contact No. Prefix"
                          value={formik.values.psusrpre || ""}
                          onChange={formik.handleChange}
                          style={{
                            fontSize: 14,
                          }}
                        // isDisabled={mode === "VIEW" ? true : false}
                        >
                          {ddlData?.HPPRE?.map((option: DDL_TYPES) => ( //change code
                            <option key={option.prgecode} value={option.prgecode}>
                              {option.prgecode} | {option.prgedesc}
                            </option>
                          ))}
                        </Select>
                        {formik.errors.psusrpre && (
                          <FormErrorMessage>{formik.errors.psusrpre}</FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psusrphn"
                        isInvalid={
                          Boolean(formik.errors.psusrphn) &&
                          Boolean(formik.touched.psusrphn)
                        }
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        {/* <FormLabel>Contact Number*</FormLabel> */}
                        <CustomFormLabel labelText="Contact Number" />
                        <Input
                          placeholder={"Enter Contact Number"}
                          type="text"
                          name="psusrphn"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.psusrphn}
                        />
                        {formik.errors.psusrphn && (
                          <FormErrorMessage>
                            {formik.errors.psusrphn}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psusreml"
                        isInvalid={
                          Boolean(formik.errors.psusreml) &&
                          Boolean(formik.touched.psusreml)
                        }
                        isReadOnly={mode === "VIEW" ? true : false}
                      >
                        {/* <FormLabel>Email Address*</FormLabel> */}
                        <CustomFormLabel labelText="Email Address" />
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
                      {mode === "ADD" ? (
                        <FormControl
                          id="psusrrol"
                          isInvalid={
                            Boolean(formik.errors.psusrrol) &&
                            Boolean(formik.touched.psusrrol)
                          }
                        >
                          {/* <FormLabel>User Role*</FormLabel> */}
                          <CustomFormLabel labelText="User Role" />
                          <Select
                            placeholder="Please Select User Role"
                            value={formik.values.psusrrol}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            {ddlData?.USRROLE?.map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psusrrol && (
                            <FormErrorMessage>
                              {formik.errors.psusrrol}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      ) : (
                        <FormControl
                          id="psusrsts"
                          isInvalid={
                            Boolean(formik.errors.psusrsts) &&
                            Boolean(formik.touched.psusrsts)
                          }
                        >
                          {/* <FormLabel>Status*</FormLabel> */}
                          <CustomFormLabel labelText="Status" />
                          <Select
                            placeholder="Please Select Status"
                            value={formik.values.psusrsts}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={mode === "VIEW" ? true : false}
                          >
                            {ddlData?.USRSTS?.map((option: DDL_TYPES) => (
                              <option
                                key={option.prgecode}
                                value={option.prgecode}
                              >
                                {option.prgedesc}
                              </option>
                            ))}
                          </Select>
                          {formik.errors.psusrsts && (
                            <FormErrorMessage>
                              {formik.errors.psusrsts}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      )}
                    </Box>
                  </div>
                </Flex>

              </Flex>
            </Card>
          </Box>
        </Box>

        <Box
          w={{
            base: "100%",
            lg: "50%",
          }}
        >
          <Card className="relative overflow-hidden">
            <Accessibility selectedRole={formik.values.psusrrol} />
            {!formik.values.psusrrol && (
              <Box
                w="100%"
                h="100%"
                bg="rgba(0,0,0,.1)"
                position={"absolute"}
                top={0}
                left={0}
              />
            )}
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
