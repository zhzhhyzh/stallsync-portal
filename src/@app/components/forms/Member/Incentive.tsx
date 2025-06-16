// Chakra imports
import Colors from "@app/constants/Colors";
import {
  numberWithCommas,
  numberPattern,
  parseThousandsToNumber,
} from "@app/utils/StringUtils";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel, Stack,
  InputGroup,
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
import { getmanageAgent, getagentDetail } from "@app/redux/agentIncentive/slice";
import useFetchAgentDetail from "@app/hooks/selector/useFetchAgentDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { AgentIncentiveSchema } from "@app/components/forms/@schemas/agentIncentiveSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";


export default function Incentive(props: any) {
  const { sendRequest, loading } = useApi({ title: "Agent Incentive" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchAgentDetail(id);
  const memberId = String(router?.query.memberId);

  const initialValues = {
    psmbruid: memberId,
    psincdsc: null,
    psincdat: null,
    psincamt: null,
    psincrmk: null,
    psinctyp: null,
    psincsts: false,

  };

  const [ddlData] = useFetchDDL({ code: ["YESORNO", "INCTYP"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AgentIncentiveSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psincref,
        psmbruid: detailData.psmbruid,
        psincsts: detailData.psincsts === "Y" ? true : false,
      });
    }
  }, [detailData]);
  const handleSwitch2 = () => {
    formik.setFieldValue("psincsts", !formik.values.psincsts);
    if (!formik.values.psincsts) {
      console.log("green"); //on
    } else {
      console.log("red"); //off
    }
  };

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getmanageAgent({
        id: mode === "EDIT" ? data.id : "", ...data,
        psincsts: data.psincsts ? "Y" : "N",
        psmbruid: memberId,
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
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Agent Incentive
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Agent Incentive",
              href: `/member/Detail/?id=${memberId}&mode=VIEW&tabIndex=3`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Agent Incentive (" + mode + ")",
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
              buttonDefaultType={"BACK"} onclick={() => router.push("/member/Detail/?id=1001&mode=VIEW&tabIndex=3")}
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
            <Box display="flex" flexDir="column" gap={6} width="100%">
              <FormControl
                id="psmbruid"
                isInvalid={Boolean(formik.errors.psmbruid) && Boolean(formik.touched.psmbruid)}
                isReadOnly={true}
              >
                <FormLabel>Member Id</FormLabel>
                {/* <CustomFormLabel labelText="Member Id"/> */}
                <Input
                  placeholder={"Enter Member Id"}
                  type="text"
                  name="psmbruid"
                  onChange={formik.handleChange}
                  value={formik.values.psmbruid || memberId}
                  isDisabled
                />
                {formik.errors.psmbruid && (
                  <FormErrorMessage>{formik.errors.psmbruid}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                              id="psincdsc"
                              isInvalid={Boolean(formik.errors.psincdsc) && Boolean(formik.touched.psincdsc)}
                              isReadOnly={mode === "VIEW" ? true : false}
                            >
                              {/* <FormLabel>Description*</FormLabel> */}
                              <CustomFormLabel labelText="Description" />
                              <Input
                                placeholder={"Enter Description"}
                                type="text"
                                name="psincdsc"
                                onChange={formik.handleChange}
                                value={formik.values.psincdsc || ""}
                              />
                              {formik.errors.psincdsc && (
                                <FormErrorMessage>{formik.errors.psincdsc}</FormErrorMessage>
                              )}
                            </FormControl>
              <FormControl
                id="psinctyp"
                isInvalid={Boolean(formik.errors.psinctyp) && Boolean(formik.touched.psinctyp)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                {/* <FormLabel>Incentive Type</FormLabel> */}
                <CustomFormLabel labelText="Incentive Type" />
                <Select
                  placeholder="Select Incentive Type"
                  value={formik.values.psinctyp || ""}
                  onChange={formik.handleChange}
                  style={{
                    fontSize: 14,
                  }}
                // isDisabled={mode === "VIEW" ? true : false}
                >
                  {ddlData?.INCTYP?.map((option: DDL_TYPES) => ( //change code
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                {formik.errors.psinctyp && (
                  <FormErrorMessage>{formik.errors.psinctyp}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                id="psincamt"
                isInvalid={Boolean(formik.errors.psincamt) && Boolean(formik.touched.psincamt)}
              >
                <CustomFormLabel labelText="Incentive Amount" />
                <Stack spacing={4}>
                  <InputGroup>
                    <Input
                      type="text"
                      isDisabled={mode == "VIEW"}
                      name="psincamt"
                      placeholder="Enter Incentive Amount"
                      value={numberWithCommas(formik.values.psincamt)}
                      pattern={numberPattern}
                      onChange={(event) => {
                        const value = event.target.value;

                        // Check if the value is a valid number or empty
                        if (!value || /^[0-9.,]*$/.test(value)) {
                          formik.handleChange({
                            target: {
                              value: parseThousandsToNumber(value),
                              name: "psincamt",
                            },
                          });
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </InputGroup>
                </Stack>
                {formik.errors.psincamt && (
                  <FormErrorMessage>{formik.errors.psincamt}</FormErrorMessage>
                )}
              </FormControl>


            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">


              <FormControl
                id="psincsts"
                isReadOnly={mode === "VIEW" ? true : false}
                isInvalid={Boolean(formik.errors.psincsts)}
              // columns={{ base: 2, lg: 4 }}
              >
                <FormLabel>Incentive Status</FormLabel>

                <Switch
                  id="psincsts"
                  size="md"
                  name="psincsts"
                  isChecked={formik.values.psincsts}
                  onChange={handleSwitch2}
                  colorScheme={"green"}
                  sx={{
                    "span.chakra-switch__track:not([data-checked])": {
                      backgroundColor: Colors.DANGER,
                    },
                  }}
                />

                {formik.errors.psincsts && (
                  <FormErrorMessage>
                    {formik.errors.psincsts}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psincdat"
                isInvalid={Boolean(formik.errors.psincdat) && Boolean(formik.touched.psincdat)}
              >
                <CustomFormLabel labelText="Incentive Date" />
                <DatePicker
                  id="psincdat"
                  name="psincdat"
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY HH:mm"}
                  showTime={{ format: 'HH:mm' }}
                  value={formik.values.psincdat ? dayjs(formik.values.psincdat) : null}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "psincdat" },
                    })
                  }
                  inputReadOnly={mode == "VIEW" ? true : false}
                  open={mode == "VIEW" ? false : undefined}
                  allowClear={mode == "VIEW" ? false : true}
                />
                {formik.errors.psincdat && (
                  <FormErrorMessage>{formik.errors.psincdat}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psincrmk"
                isInvalid={
                  Boolean(formik.errors.psincrmk) &&
                  Boolean(formik.touched.psincrmk)
                }
                width="100%"
              >
                <FormLabel>Remarks</FormLabel>
                <Textarea
                  placeholder="Enter Remarks"
                  value={formik.values.psincrmk || ""}
                  name="psincrmk"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                 
                />
                {formik.errors.psincrmk && (
                  <FormErrorMessage>
                    {formik.errors.psincrmk}
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
              buttonDefaultType={"BACK"} onclick={() => router.push("/member/Detail/?id=1001&mode=VIEW&tabIndex=3")}
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

