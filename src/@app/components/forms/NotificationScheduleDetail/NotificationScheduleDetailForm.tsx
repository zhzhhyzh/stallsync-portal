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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { DatePicker, Space, TimePicker } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchScheduleDetail from "@app/hooks/selector/useFetchScheduleDetail";
import dayjs from "dayjs";
import {
  amendSchedule,
  createSchedule,
} from "@app/redux/notificationsheduledetail/slice";
import { NotificationScheduleSchema } from "../@schemas/notificationScheduleSchema";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function NotificationScheduleDetailForm(props: any) {
  const { sendRequest, loading } = useApi({
    title: "Notification Schedule Detail",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const id2 = props.id2;
  const desc = props.desc;

  const [detailData] = useFetchScheduleDetail(id, id2);

  const [isExist, setIsExist] = useState(false);
  const [ddlData] = useFetchDDL({ code: ["NOTCHNL", "FREQ"] });

  const initialValues = {
    psnotcde: "",
    psnotdsc: "",
    psnotchn: "",
    psschstd: "",
    startTime: "",
    psschfrq: "",
    psschfrv: 0,
    psschndt: "",
    nextScheduleTime: "",
    psschexp: "",
    psschsts: false,
    psschsdt: "",
    psschlst: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: NotificationScheduleSchema,
    onSubmit: (values) => {
      const {
        psnotcde,
        psnotdsc,
        psnotchn,
        psschstd,
        startTime,
        psschfrq,
        psschfrv,
        psschexp,
        psschsts,
        psschsdt,
        psschlst,
      } = values;

      //Combined Start Date and Start Time
      let newStartDate = new Date(psschstd);
      let convertedStartTime = dayjs(startTime, { format: "HH:mm" });
      newStartDate.setHours(
        convertedStartTime.hour(),
        convertedStartTime.minute()
      );
      
      let postValue = {
        psnotcde,
        psnotdsc,
        psnotchn,
        psschstd: newStartDate,
        startTime,
        psschfrq,
        psschfrv,
        // psschndt,
        // nextScheduleTime,
        psschexp,
        psschsts: psschsts === true ? "Y" : "N",
        psschsdt,
        psschlst,
      };
      onSubmit(postValue);
    },
  });

  useEffect(() => {
    if (id && id2) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) {
        setIsExist(false);
        formik.resetForm();
        formik.setValues({
          ...initialValues,
          psnotcde: id !== "undefined" ? id : "",
          psnotdsc: desc !== "undefined" ? desc : "",
          psnotchn: id2 !== "undefined" ? id2 : "",
        });
      } else {
        formik.setValues({
          ...detailData,
          startTime: dayjs()
            .hour(dayjs(detailData.psschstd, { format: "HH:mm" }).hour())
            .minute(dayjs(detailData.psschstd, { format: "HH:mm" }).minute()),
          nextScheduleTime: dayjs()
            .hour(dayjs(detailData.psschndt, { format: "HH:mm" }).hour())
            .minute(dayjs(detailData.psschndt, { format: "HH:mm" }).minute()),
          psschsts: detailData?.psschsts === "Y" ? true : false,
          psnotcde: id !== "undefined" ? id : "",
          psnotdsc: desc !== "undefined" ? desc : "",
          psnotchn: id2 !== "undefined" ? id2 : "",
        });
        setIsExist(true);
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: isExist ? amendSchedule(data) : createSchedule(data),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: isExist ? "Update Record" : "Add Record",
          message: isExist ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }

  const handleStatusChange = () => {
    formik.setFieldValue("psschsts", !formik.values.psschsts);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Notification Schedule Detail
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Notification Template",
                href: `/notificationTemplate`, // Add parameter if needed eg. /generalParameter/?id=123
              },
              {
                title:
                  "Notification Schedule Detail" +
                  " (" +
                  (isExist ? "EDIT" : "ADD") +
                  ")",
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
            <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
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
              <Box display="flex" flexDir="column" gap={6} width="50%">
                <FormControl
                  id="psnotcde"
                  isInvalid={
                    Boolean(formik.errors.psnotcde) &&
                    Boolean(formik.touched.psnotcde)
                  }
                  isReadOnly={true}
                >
                  
                  <CustomFormLabel labelText="Notification Code"/>
                  <Input
                    placeholder={"Enter Notification Code"}
                    type="text"
                    name="psnotcde"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnotcde}
                  />
                  {formik.errors.psnotcde && (
                    <FormErrorMessage>
                      {formik.errors.psnotcde}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psnotdsc"
                  isInvalid={
                    Boolean(formik.errors.psnotdsc) &&
                    Boolean(formik.touched.psnotdsc)
                  }
                  isReadOnly={true}
                >
                  
                  <CustomFormLabel labelText="Notification Description"/>
                  <Input
                    placeholder={"Enter Notification Description"}
                    type="text"
                    name="psnotdsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.psnotdsc}
                  />
                  {formik.errors.psnotdsc && (
                    <FormErrorMessage>
                      {formik.errors.psnotdsc}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psnotchn"
                  isInvalid={
                    Boolean(formik.errors.psnotchn) &&
                    Boolean(formik.touched.psnotchn)
                  }
                  isReadOnly={true}
                >
                  <FormLabel>Notification Type</FormLabel>
                  <Select
                    //placeholder="Please Select Notification Type"
                    value={formik.values.psnotchn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={true}
                  >
                    {ddlData?.NOTCHNL?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psnotchn && (
                    <FormErrorMessage>
                      {formik.errors.psnotchn}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {isExist && (
                  <FormControl
                    id="psschsts"
                    w={"49%"}
                    isInvalid={
                      Boolean(formik.errors.psschsts) &&
                      Boolean(formik.touched.psschsts)
                    }
                  >
                    <FormLabel>Status</FormLabel>
                    <Switch
                      id="psschsts"
                      name="psschsts"
                      isChecked={formik.values.psschsts}
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
                    {formik.errors.psschsts && (
                      <FormErrorMessage>
                        {formik.errors.psschsts}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Box>
              <Flex width="50%" flexDir={{ base: "column", lg: "row" }} gap={6}>
                <Box display="flex" flexDir="column" gap={6} w={"50%"} pr={1}>
                  <FormControl
                    id="psschstd"
                    isInvalid={
                      Boolean(formik.errors.psschstd) &&
                      Boolean(formik.touched.psschstd)
                    }
                  >
                    <FormLabel>Start Date</FormLabel>
                    <DatePicker
                      id="psschstd"
                      name="psschstd"
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                      value={
                        formik.values.psschstd
                          ? dayjs(formik.values.psschstd)
                          : null
                      }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "psschstd" },
                        })
                      }
                    />
                    {formik.errors.psschstd && (
                      <FormErrorMessage>
                        {formik.errors.psschstd}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psschfrv"
                    isInvalid={
                      Boolean(formik.errors.psschfrv) &&
                      Boolean(formik.touched.psschfrv)
                    }
                  >
                    <FormLabel>Schedule Frequency</FormLabel>
                    <NumberInput
                      name="psschfrv"
                      min={0}
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "psschfrv" },
                        })
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.psschfrv}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {formik.errors.psschfrv && (
                      <FormErrorMessage>
                        {formik.errors.psschfrv}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  {isExist && (
                    <FormControl
                      id="psschndt"
                      isInvalid={
                        Boolean(formik.errors.psschndt) &&
                        Boolean(formik.touched.psschndt)
                      }
                    >
                      <FormLabel>Next Schedule Date</FormLabel>
                      <DatePicker
                        id="psschndt"
                        name="psschndt"
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        disabled={true}
                        value={
                          formik.values.psschndt
                            ? dayjs(formik.values.psschndt)
                            : null
                        }
                        onChange={(value) =>
                          formik.handleChange({
                            target: { value, name: "psschndt" },
                          })
                        }
                      />
                      {formik.errors.psschndt && (
                        <FormErrorMessage>
                          {formik.errors.psschndt}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}

                  <FormControl
                    id="psschexp"
                    isInvalid={
                      Boolean(formik.errors.psschexp) &&
                      Boolean(formik.touched.psschexp)
                    }
                  >
                    <FormLabel>Expiry Date</FormLabel>
                    <DatePicker
                      id="psschexp"
                      name="psschexp"
                      style={{ width: "100%" }}
                      format={"DD/MM/YYYY"}
                      value={
                        formik.values.psschexp
                          ? dayjs(formik.values.psschexp)
                          : null
                      }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "psschexp" },
                        })
                      }
                    />
                    {formik.errors.psschexp && (
                      <FormErrorMessage>
                        {formik.errors.psschexp}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Box display="flex" flexDir="column" gap={6} w={"50%"}>
                  <FormControl
                    id="startTime"
                    isInvalid={
                      Boolean(formik.errors.startTime) &&
                      Boolean(formik.touched.startTime)
                    }
                  >
                    <FormLabel>Start Time (HH:MM)</FormLabel>
                    <TimePicker
                      id="startTime"
                      name="startTime"
                      style={{ width: "100%" }}
                      format={"HH:mm"}
                      showNow={false}
                      value={
                        formik.values.startTime
                          ? dayjs(formik.values.startTime)
                          : null
                      }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "startTime" },
                        })
                      }
                      changeOnBlur
                    />
                    {formik.errors.startTime && (
                      <FormErrorMessage>
                        {formik.errors.startTime}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psschfrq"
                    isInvalid={
                      Boolean(formik.errors.psschfrq) &&
                      Boolean(formik.touched.psschfrq)
                    }
                  >
                    <FormLabel>Schedule Frequency Code</FormLabel>
                    <Select
                      placeholder="Please Select Schedule Frequency Code"
                      value={formik.values.psschfrq}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {ddlData?.FREQ?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psschfrq && (
                      <FormErrorMessage>
                        {formik.errors.psschfrq}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  {isExist && (
                    <>
                      <FormControl
                        id="nextScheduleTime"
                        isInvalid={
                          Boolean(formik.errors.nextScheduleTime) &&
                          Boolean(formik.touched.nextScheduleTime)
                        }
                      >
                        <FormLabel>Next Schedule Time (HH:MM)</FormLabel>
                        <TimePicker
                          id="nextScheduleTime"
                          name="nextScheduleTime"
                          style={{ width: "100%" }}
                          format={"HH:mm"}
                          showNow={false}
                          disabled={true}
                          value={
                            formik.values.nextScheduleTime
                              ? dayjs(formik.values.nextScheduleTime)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "nextScheduleTime" },
                            })
                          }
                          changeOnBlur
                        />
                        {formik.errors.nextScheduleTime && (
                          <FormErrorMessage>
                            {formik.errors.nextScheduleTime}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        id="psschlst"
                        isInvalid={
                          Boolean(formik.errors.psschlst) &&
                          Boolean(formik.touched.psschlst)
                        }
                      >
                        <FormLabel>Last Sent Date</FormLabel>
                        <DatePicker
                          id="psschlst"
                          name="psschlst"
                          style={{ width: "100%" }}
                          format={"DD/MM/YYYY"}
                          disabled={true}
                          value={
                            formik.values.psschlst
                              ? dayjs(formik.values.psschlst)
                              : null
                          }
                          onChange={(value) =>
                            formik.handleChange({
                              target: { value, name: "psschlst" },
                            })
                          }
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.psschlst && (
                          <FormErrorMessage>
                            {formik.errors.psschlst}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </>
                  )}
                </Box>
              </Flex>
            </div>
          </Box>
        </Card>
      </Flex>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
