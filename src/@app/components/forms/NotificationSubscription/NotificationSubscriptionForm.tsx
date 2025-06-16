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

import { getManageNotificationSubs } from "@app/redux/notificationSubscription/slice"

// import useFetchNotificationGroupDataDetail from "@app/hooks/selector/useFetchNotificationGroupDataDetail";

import useFetchNotificationSubsDetail from "@app/hooks/selector/useFetchNotificationSubsDetail";

import { NotificationGroupSchema } from "../@schemas/notificationGroupSchema";

import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchNotificationGroupCode from "@app/hooks/selector/useFetchNotificationGroupCode";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function NotificationSubscriptionForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Notification Subscription" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;

  const mode = props.mode;
  const [detailData] = useFetchNotificationSubsDetail(id);
  const [ddlData] = useFetchDDL({ code: ["YESORNO", 'NOTCHNL', 'NOTCATG', 'AUD'] });
  const [ddlNotGroup] = useFetchNotificationGroupCode();

  const switchStyle: React.CSSProperties = {
    backgroundColor: Colors.DANGER, // Default color when off
  };
  
  const switchCheckedStyle: React.CSSProperties = {
    backgroundColor: Colors.SUCCESS, // Color when on
  };

  const initialValues = {
    psnotgrp: "",
    psntsman: false,
    psntsaud: "",
    psntssts: false, //status
    psngpdsc: "",
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
          id: detailData?.psnotgrp,
          psnotgrp: detailData?.psnotgrp,
          psntsman: detailData.psntsman === "Y" ? true : false,
          psntssts: detailData.psntssts === "Y" ? true : false,
          // psgrdsts: detailData?.psgrdsts === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);


  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: mode === "ADD" ? getManageNotificationSubs({
        psnotgrp: formik.values.psnotgrp,
        psntsaud: formik.values.psntsaud,
        psntsman: formik.values.psntsman === true ? "Y" : "N",
      
        // psnotcde: formik.values.psnotcde,
        // psnotgrp: formik.values.psnotgrp,
        // psnotchn: formik.values.psnotchn,
    }) : getManageNotificationSubs({
      ...data,
      psntsman: formik.values.psntsman === true ? "Y" : "N",
      psntssts: formik.values.psntssts === true ? "Y" : "N",
      // psgrdsts: formik.values.psgrdsts === true ? 'Y' : 'N',
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
    formik.setFieldValue("psntssts", !formik.values.psntssts);
  };

  const handleMandatoryIndicator = () => {
    formik.setFieldValue("psntsman", !formik.values.psntsman);
  };


  return (
    <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Notification Subscription
            </Text>
            <Breadcrumbs breadcrumbItems={[
                  {
                    title: "Notification Subscription",
                    href: `/notificationSubscription`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Notification Subscription ("+ mode +")",
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
               id="psnotgrp"
               isInvalid={Boolean(formik.errors.psnotgrp) && Boolean(formik.touched.psnotgrp)}
               isReadOnly={mode === "VIEW" ? true : false}
              //  isDisabled={mode==="ADD"?false:true}
             >
               
               <CustomFormLabel labelText="Notification Group"/>

              {  mode==="EDIT"? <Input
                 placeholder={"Enter Notification Group"}
                 type="text"
                 id="psnotgrp"
                 name="psnotgrp"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={detailData?.psnotgrpdsc&&detailData?.psnotgrpdsc}
                 
                 isDisabled={mode === "EDIT" ? true : false}
               />:<Select
                  name="psnotgrp"
                  placeholder="Please Select Notification Group"
                  value={formik.values.psnotgrp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                   {Array.isArray(ddlNotGroup) &&
                    ddlNotGroup.map((option: any) => (
                      <option key={option.psngpcde} value={option.psngpcde}>
                        {option.psngpdsc}
                      </option>
                    ))}
                    
                </Select>}
               {formik.errors.psnotgrp && (
                 <FormErrorMessage>{formik.errors.psnotgrp}</FormErrorMessage>
               )}
             </FormControl>
             
             <FormControl
               id="psntsaud"
               isInvalid={Boolean(formik.errors.psntsaud) && Boolean(formik.touched.psntsaud)}
               isReadOnly={mode === "VIEW" ? true : false}
             >
               <FormLabel>Audience</FormLabel>
               <Select
                  name="psntsaud"
                  placeholder="Please Select Audience"
                  value={formik.values.psntsaud}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.AUD?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
               {formik.errors.psntsaud && (
                 <FormErrorMessage>{formik.errors.psntsaud}</FormErrorMessage>
               )}
             </FormControl>
             

            
             
                <FormControl
                 id="psntsman"
                 isInvalid={Boolean(formik.errors.psntsman) && Boolean(formik.touched.psntsman)}
                 // columns={{ base: 2, lg: 4 }}
                >
                 
                  
                  <CustomFormLabel labelText="Mandatory"/>
                   <Switch 
                     id="psntsman" 
                     size='md' 
                     name="psntsman"
                     isChecked={formik.values.psntsman}
                     onChange={handleMandatoryIndicator}
                     onBlur={formik.handleBlur}
                     colorScheme={"green"}
                     sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                   />
                 
                 {formik.errors.psntsman && (
                   <FormErrorMessage>
                     {formik.errors.psntsman}
                   </FormErrorMessage>
                 )}
               </FormControl>

               { mode === "EDIT" ? 
                <FormControl
                 id="psntssts"
                 isInvalid={Boolean(formik.errors.psntssts) && Boolean(formik.touched.psntssts)}
                 // columns={{ base: 2, lg: 4 }}
                >
                 
                 
                  <CustomFormLabel labelText="Active"/>
                   <Switch 
                     id="psntssts" 
                     size='md' 
                     name="psntssts"
                     isChecked={formik.values.psntssts}
                     onChange={handleSwitch}
                     onBlur={formik.handleBlur}
                     colorScheme={"green"}
                     sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                   />
                 
                 {formik.errors.psntssts && (
                   <FormErrorMessage>
                     {formik.errors.psntssts}
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
