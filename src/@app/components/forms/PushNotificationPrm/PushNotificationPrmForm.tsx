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
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  selectHome,
  setBreadcrumbsInfo,
} from "@app/redux/app/slice";
import { TimePicker } from "antd";
import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import dayjs from "dayjs";
import useFetchPshprmDetail from "@app/hooks/selector/useFetchPshprmDetail";
import { managePushParam } from "@app/redux/pshprm/slice";
import { pushNotificationParamSchema } from "../@schemas/pushNotificationParamSchema";

export default function PushNotificationPrmForm() {
  const { sendRequest, loading } = useApi({
    title: "Push Notification Parameter",
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [detailData] = useFetchPshprmDetail();
  const homeData = useAppSelector(selectHome);

  const initialValues = {
    id: "",
    psactaps: "",
    psactape: "",
    psatyaps: "",
    psatyape: "",
  };

  const handleClick = () => {
    let breadcrumb = [
      {
        title: "Push Notification Parameter",
        href: `/pushNotificationParam`,
      },
      {
        title: "Maintenance Log",
      },
    ];
    dispatch(setBreadcrumbsInfo(breadcrumb));

    const queryParams = {
      id: detailData.id,
      file: "pspshpar",
    };

    const url = {
      pathname: "/maintLogs",
      query: queryParams,
    };

    router.push(url);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: pushNotificationParamSchema,
    onSubmit: (values) => {
      const { id, psactaps, psactape, psatyaps, psatyape } = values;
      let convertActionTimeStart = dayjs(psactaps);
      let convertActionTimeEnd = dayjs(psactape);
      let convertActivityTimeStart = dayjs(psatyaps);
      let convertActivityTimeEnd = dayjs(psatyape);

      let postValue = {
        id: id,
        psactaps: convertActionTimeStart.format("HH:mm"),
        psactape: convertActionTimeEnd.format("HH:mm"),
        psatyaps: convertActivityTimeStart.format("HH:mm"),
        psatyape: convertActivityTimeEnd.format("HH:mm"),
      };
      onSubmit(postValue);
    },
  });

  useEffect(() => {
    if (detailData && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        psactaps: dayjs(detailData.psactaps, "HH:mm"),
        psactape: dayjs(detailData.psactape, "HH:mm"),
        psatyaps: dayjs(detailData.psatyaps, "HH:mm"),
        psatyape: dayjs(detailData.psatyape, "HH:mm"),
        id: detailData.id,
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    if (
      !homeData?.access ||
      (homeData?.access &&
        !checkAccessMatrix(homeData?.access, accessType.PSHPRM_EDIT))
    ) {
      return;
    }
    const { success } = await sendRequest({
      fn: managePushParam(data),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "Push Notification Parameter",
          message: "Record Updated",
        });
      }, 200);
    }
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="500" mb={1}>
            Push Notification Parameter
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Push Notification Parameter",
              },
            ]}
          />
        </Flex>
        <Flex justifyContent="flex-end" pr={5} pt={10}>
          <Box pr={5}>
            <Space size="small">
              <Button
                size={"sm"}
                color={"white"}
                bgColor={Colors.PRIMARY}
                sx={{
                  _hover: { backgroundColor: Colors.PRIMARY, color: "white" },
                }}
                fontWeight={"normal"}
                borderRadius={3}
                type={"button"}
                onClick={handleClick}
                paddingRight={3}
                // marginRight={5}
                // isLoading={buttonLoading}
                // sx={{ _hover: { backgroundColor: hoverBackgroundColor, color: hoverColor } }}
                // {...rest}
              >
                MAINT LOG
              </Button>
            </Space>
          </Box>
          <Box>
            <Space size="small">
              {homeData?.access &&
                checkAccessMatrix(homeData?.access, accessType.PSHPRM_EDIT) && (
                  <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                )}
            </Space>
          </Box>
        </Flex>
      </Flex>
      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Flex direction={"column"}>
          <Flex direction={"row"}>
            <Box w={"200px"}>
              <Text fontWeight={"bold"}>Notification Type</Text>
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Active Period (HH:mm)</Text>
            </Box>
          </Flex>
          <Flex direction={"row"}>
            <Box w={"200px"} alignSelf={"center"}>
              <Text pl={5} fontWeight={"medium"}>
                ACTION
              </Text>
            </Box>
            <Flex direction={"row"}>
              <FormControl
                id="psactaps"
                isInvalid={
                  Boolean(formik.errors.psactaps) &&
                  Boolean(formik.touched.psactaps)
                }
                pt={3}
                pr={3}
              >
                <FormLabel>Start</FormLabel>
                <TimePicker
                  format={"HH:mm"}
                  style={{ width: "250px" }}
                  showNow={false}
                  changeOnBlur
                  value={
                    formik.values.psactaps
                      ? dayjs(formik.values.psactaps)
                      : null
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: {
                        value: value ? value : "",
                        name: "psactaps",
                      },
                    })
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.errors.psactaps && (
                  <FormErrorMessage>{formik.errors.psactaps}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psactape"
                isInvalid={
                  Boolean(formik.errors.psactape) &&
                  Boolean(formik.touched.psactape)
                }
                pt={3}
              >
                <FormLabel>End</FormLabel>
                <TimePicker
                  format={"HH:mm"}
                  style={{ width: "250px" }}
                  showNow={false}
                  changeOnBlur
                  value={
                    formik.values.psactape
                      ? dayjs(formik.values.psactape)
                      : null
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: {
                        value: value ? value : "",
                        name: "psactape",
                      },
                    })
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.errors.psactape && (
                  <FormErrorMessage>{formik.errors.psactape}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          </Flex>
          <Flex direction={"row"}>
            <Box w={"200px"} alignSelf={"center"}>
              <Text pl={5} fontWeight={"medium"}>
                ACTIVITY
              </Text>
            </Box>
            <Flex direction={"row"} >
              <FormControl
                id="psatyaps"
                isInvalid={
                  Boolean(formik.errors.psatyaps) &&
                  Boolean(formik.touched.psatyaps)
                }
                pt={3}
                pr={3}
              >
                <FormLabel>Start</FormLabel>
                <TimePicker
                  format={"HH:mm"}
                  style={{ width: "250px" }}
                  showNow={false}
                  changeOnBlur
                  value={
                    formik.values.psatyaps
                      ? dayjs(formik.values.psatyaps)
                      : null
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: {
                        value: value ? value : "",
                        name: "psatyaps",
                      },
                    })
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.errors.psatyaps && (
                  <FormErrorMessage>{formik.errors.psatyaps}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="psatyape"
                isInvalid={
                  Boolean(formik.errors.psatyape) &&
                  Boolean(formik.touched.psatyape)
                }
                pt={3}
              >
                <FormLabel>End</FormLabel>
                <TimePicker
                  format={"HH:mm"}
                  style={{ width: "250px" }}
                  showNow={false}
                  changeOnBlur
                  value={
                    formik.values.psatyape
                      ? dayjs(formik.values.psatyape)
                      : null
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: {
                        value: value ? value : "",
                        name: "psatyape",
                      },
                    })
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.errors.psatyape && (
                  <FormErrorMessage>{formik.errors.psatyape}</FormErrorMessage>
                )}
              </FormControl>
            </Flex>
          </Flex>
        </Flex>
      </Card>
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box pr={5}>
          <Space size="small">
            <Button
              size={"sm"}
              color={"white"}
              bgColor={Colors.PRIMARY}
              sx={{
                _hover: { backgroundColor: Colors.PRIMARY, color: "white" },
              }}
              fontWeight={"normal"}
              borderRadius={3}
              type={"button"}
              onClick={handleClick}
              paddingRight={3}
              // marginRight={5}
              // isLoading={buttonLoading}
              // sx={{ _hover: { backgroundColor: hoverBackgroundColor, color: hoverColor } }}
              // {...rest}
            >
              MAINT LOG
            </Button>
          </Space>
        </Box>
        <Box>
          <Space size="small">
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.PSHPRM_EDIT) && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}
