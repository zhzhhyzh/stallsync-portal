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
  Switch
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties } from "react";

import Spacing from "@app/constants/Spacing";

// import { Switch } from "antd"

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import type { DatePickerProps } from 'antd';
import { DatePicker, Form, Space, Tag } from 'antd';
import dayjs from "dayjs";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import moment from "moment";

import { getManageNotificationGroupData } from "@app/redux/notificationGroupData/slice";


import useFetchNotificationGroupDataDetail from "@app/hooks/selector/useFetchNotificationGroupDataDetail";

import { NotificationGroupSchema } from "../@schemas/notificationGroupSchema";

import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchNotificationGroupCode from "@app/hooks/selector/useFetchNotificationGroupCode";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function NotificationGroupDataForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Notification Group Data" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const psngpdsc = props.psngpdsc;

  const psngpcde = props.psngpcde;
  const mode = props.mode;
  const [detailData] = useFetchNotificationGroupDataDetail(id);
  const [ddlData] = useFetchDDL({ code: ["YESORNO", 'NOTCHNL', 'NOTCATG'] });
  const [ddlNotGroup] = useFetchNotificationGroupCode();

  const switchStyle: React.CSSProperties = {
    backgroundColor: Colors.DANGER, // Default color when off
  };
  
  const switchCheckedStyle: React.CSSProperties = {
    backgroundColor: Colors.SUCCESS, // Color when on
  };

  const initialValues = {
    psnotcde: "",
    psnotgrp: "",
    psnotchn: "",
    psgrdsts: false,
    psngddsc: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    // validationSchema: NotificationGroupSchema,
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
          id: detailData?.id,
          psgrdsts: detailData?.psgrdsts === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);


  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: mode === "ADD" ? getManageNotificationGroupData({
        psnotcde: data.psnotcde,
        psnotgrp: psngpcde,
        psnotchn: data.psnotchn,
        psngddsc: data.psngddsc,

    }) : getManageNotificationGroupData({
      ...data,
      id,
      psnotgrp:psngpcde,
      psgrdsts: formik.values.psgrdsts === true ? "Y" : "N",
    }),
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

  const handleSwitch = () => {
    formik.setFieldValue("psgrdsts", !formik.values.psgrdsts);
  };


  return (
    <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Notification Group Data
            </Text>
            <Breadcrumbs breadcrumbItems={[
                  {
                    title: "Notification Group",
                    href: `/notificationGroup`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Notification Group Data",
                    href: `/notificationGroup/notificationGroupData`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Notification Group Data ("+ mode +")",
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
              {
                mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
              )}
            </Space>
          </Box>
        </Flex>

        
      <Box display="flex" flexDir="column" gap={6} width="100%">
        
        
      <Card
        p={4}

        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
      <div className="flex flex-col sm:flex-row gap-6">

            <Box display="flex" flexDir="column" gap={6} width="50%">
             <FormControl
               id="psnotcde"
               isInvalid={Boolean(formik.errors.psnotcde) && Boolean(formik.touched.psnotcde)}
               isReadOnly={mode==="VIEW"?true:false}
               >
               
               <CustomFormLabel labelText="Data Code" />
               <Input
                 placeholder={"Enter Data Code"}
                 type="text"
                 id="psnotcde"
                 name="psnotcde"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.psnotcde}
                 isDisabled={mode === "EDIT" ? true : false}

               />
               {formik.errors.psnotcde && (
                 <FormErrorMessage>{formik.errors.psnotcde}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="psngddsc"
               isInvalid={Boolean(formik.errors.psngddsc) && Boolean(formik.touched.psngddsc)}
               isReadOnly={mode==="VIEW"?true:false}
               >
               
               <CustomFormLabel labelText="Data Description"/>
               <Input
                 placeholder={"Enter Data Description"}
                 type="text"
                 id="psngddsc"
                 name="psngddsc"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.psngddsc}

                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.psngddsc && (
                 <FormErrorMessage>{formik.errors.psngddsc}</FormErrorMessage>
               )}
             </FormControl>

             
             <FormControl
               id="psnotchn"
               isInvalid={Boolean(formik.errors.psnotchn) && Boolean(formik.touched.psnotchn)}
               isReadOnly={mode === "VIEW" ? true : false}
             >
               
               <CustomFormLabel labelText="Notification Channel"/>
               <Select
                  name="psnotchn"
                  placeholder="Please Select Notification Channel"
                  value={formik.values.psnotchn}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.NOTCHNL?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
               {formik.errors.psnotchn && (
                 <FormErrorMessage>{formik.errors.psnotchn}</FormErrorMessage>
               )}
             </FormControl>
             

             { mode === "EDIT" ? 
                <FormControl
                 id="psgrdsts"
                 isInvalid={Boolean(formik.errors.psgrdsts) && Boolean(formik.touched.psgrdsts)}
                 // columns={{ base: 2, lg: 4 }}
                >
                 
                  
                  <CustomFormLabel labelText="Active"/>
                   <Switch 
                     id="psgrdsts" 
                     size='md' 
                     name="psgrdsts"
                     isChecked={formik.values.psgrdsts}
                     onChange={handleSwitch}
                     onBlur={formik.handleBlur}
                     colorScheme={"green"}
                     sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                   />
                 
                 {formik.errors.psgrdsts && (
                   <FormErrorMessage>
                     {formik.errors.psgrdsts}
                   </FormErrorMessage>
                 )}
               </FormControl> : null
             }
            </Box>

        </div>
        
        </Card>

      </Box>

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
