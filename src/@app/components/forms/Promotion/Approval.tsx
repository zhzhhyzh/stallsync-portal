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
  Stack,
  Switch,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  RadioGroup,
  Radio,
  Textarea,
  color,
  Tabs,
  TabList,
  Tab,
  Checkbox

} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties } from "react";

import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import type { DatePickerProps } from 'antd';
import { DatePicker, Form, Space, Tag, Timeline } from 'antd';
import dayjs from "dayjs";
// import {
//   numberWithCommas,
//   parseThousandsToNumber,
//   numberPattern,
// } from "@app/utils/StringUtils";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
// import { FormikConfig, FormikTouched } from 'formik';
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";

import { getApplicationDetail, getApproveApplication, getManageApplication } from "@app/redux/application/slice";

import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// import { RewardsPromoSchema } from "../@schemas/rewardsPromoSchema";
import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { manageApplication } from '@app/redux/application/api';
import Table from "@app/components/common/Table/Table";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
// import useFetchDDLAction from "@app/hooks/selector/usseFetchDDLAction";
import {
  logout,
  selectHome,
  selectIsLogined,
} from "@app/redux/app/slice";
import SubHeader from "@app/components/common/Header/SubHeader";
import useFetchPromotionDetail from "@app/hooks/selector/useFetchPromotionDetail";
import { getUpdatePromotion } from "@app/redux/promotion/slice";
const Approval = (props: any) => {
  const [checklistArr, setChecklistArr] = useState<any>([])
  const homeData = useAppSelector(selectHome);

  const { sendRequest, loading } = useApi({ title: "Promotion Approval" });
  useEffect(() => {
    props.setLoading(loading)
  }, [loading])
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;


  // const [actions] = useFetchDDLAction(id);

  const detailData = props.detailData

  const initialValues = {

    psprmref: props.id,
    createdAt: "",
    psprmrmk: "",
    psaplstd: "",
    psprmsts: "",
    psprmapv: "",
    psprmapd: "",

  };


  const [ddlData] = useFetchDDL({ code: ["APRV"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    //   validationSchema: FeeCodeSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  // useEffect(() => {
  //   props.setFormik(formik);

  //   // if(mode==="EDIT") setSubmit(formik.handleSubmit)
  // }, [formik.values]);

  useEffect(() => {
    props.setFormik(formik)
    // if(mode==="EDIT") setSubmit(formik.handleSubmit)
  }, [])

  useEffect(() => {
    if (mode !== "ADD" && id) {
      // props.setDetailData(detailData)

      if (Object.keys(detailData).length === 0) {
        formik.resetForm();
      }
      if (Object.keys(detailData).length > 0) {

        formik.setValues({
          ...detailData,
        });

        // console.log(detailData?.checklist)
        // setChecklistArr(detailData?.checklist)

      }
    }
  }, [detailData]);


  async function onSubmit(data: any) {


    // data.checklist = checklistArr
    const { success } = await sendRequest({
      fn: getUpdatePromotion({
        ...data, id: mode === "EDIT" ? id : "", tab: "3",
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update Record" : "Add Record",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        // reset()
        router.back();
      }, 200);
    }
  }
  // useEffect(() => {
  //   console.log(formik.errors)
  // }, [formik.errors])

  return (
    <Box>

      <div className="flex flex-col gap-6">
        <Box display="flex" flexDir="row" gap={6} width="100%">

          <Card
            p={4}

            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1"
          >
            <SubHeader labelText="Approval Information" />

            <Flex direction={"row"} gap={Spacing.containerPx}>
              <Flex flex={5} direction={"column"} gap={Spacing.containerPx}>
                <Flex direction={"row"} gap={Spacing.containerPx}>
                  <FormControl
                    id="createdAt"
                    isInvalid={Boolean(formik.errors.createdAt) && Boolean(formik.touched.createdAt)}
                  //    isReadOnly
                  >
                    <FormLabel>Creation Date</FormLabel>
                    <DatePicker disabled style={{ width: '100%' }} format={"DD-MM-YYYY"} value={
                      formik.values.createdAt
                        ? dayjs(formik.values.createdAt)
                        : null
                    }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "createdAt" },
                        })
                      } />

                    {formik.errors.createdAt && (
                      <FormErrorMessage>{formik.errors.createdAt}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprmsts"
                    isInvalid={Boolean(formik.errors.psprmsts) && Boolean(formik.touched.psprmsts)}
                  >
                    <FormLabel>Action</FormLabel>
                    <Select
                      // isDisabled={  detailData?.psprmsts==="APV"||detailData?.psprmsts==="REJ"
                      // }
                      isDisabled={mode === "VIEW"   ||!detailData?.editable|| (detailData.psprmsts === "REJ" || detailData?.psprmsts === "APV")}

                      placeholder="Select Action"
                      value={formik.values.psprmsts}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >

                      {(detailData.psprmsts === "REJ" || detailData?.psprmsts === "APV") ? ddlData?.APRV?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))
                        : ddlData?.APRV?.filter((option: DDL_TYPES) => detailData?.actions?.find((action: any) => action === option.prgecode)).map((option: DDL_TYPES) => (
                          <option key={option.prgecode} value={option.prgecode}>
                            {option.prgedesc}
                          </option>
                        ))}

                    </Select>
                    {formik.errors.psprmsts && (
                      <FormErrorMessage>{formik.errors.psprmsts}</FormErrorMessage>
                    )}
                  </FormControl>

                </Flex>
                <Flex direction={"row"} gap={Spacing.containerPx}>

                  <FormControl
                    id="psprmapd"
                    isInvalid={Boolean(formik.errors.psprmapd) && Boolean(formik.touched.psprmapd)}
                  //    isReadOnly
                  >
                    <FormLabel>Approval Date</FormLabel>
                    <DatePicker disabled style={{ width: '100%' }} value={
                      formik.values.psprmapd
                        ? dayjs(formik.values.psprmapd)
                        : null
                    }
                      onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "psprmapd" },
                        })
                      } format={"DD-MM-YYYY"} />

                    {formik.errors.psprmapd && (
                      <FormErrorMessage>{formik.errors.psprmapd}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psprmapv"
                    isInvalid={Boolean(formik.errors.psprmapv) && Boolean(formik.touched.psprmapv)}
                  //    isReadOnly
                  >
                    <FormLabel>Approval By</FormLabel>
                    <Input
                      placeholder={"Enter Approval By"}
                      type="text"
                      name="psprmapv"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.psprmsts === "APV" ? homeData?.psusrunm : detailData?.psprmsts === "APV" ? detailData?.psprmapv : ""}
                      isDisabled={true}
                    />

                    {formik.errors.createdAt && (
                      <FormErrorMessage>{formik.errors.createdAt}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>

              </Flex>
              <FormControl
                h="100%"
                flex={5}
                id="psprmrmk"
                isInvalid={Boolean(formik.errors.psprmrmk) && Boolean(formik.touched.psprmrmk)}

              >
                <FormLabel>Application Remarks</FormLabel>
                <Textarea
                
                  h="82.5%"
                  placeholder={"Enter Application Remarks"}
                  name="psprmrmk"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.psprmrmk || ""}
                  isDisabled={mode === "VIEW" || !detailData?.editable || (detailData.psprmsts === "REJ" || detailData?.psprmsts === "APV")}
                  />
              </FormControl>
            </Flex>



          </Card>


        </Box>




      </div>




      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={router.back} />

            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading} onClick={()=>formik.handleSubmit()}
                />
              )}
          </Space>
        </Box>
      </Flex>
    </Box>
  )
}

export default Approval