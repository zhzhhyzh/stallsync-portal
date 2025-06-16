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

import { getManageNotificationGroup } from "@app/redux/notificationGroup/slice";
import useFetchNotificationGroupDetail from "@app/hooks/selector/useFetchNotificationGroupDetail";

import { NotificationGroupSchema } from "../@schemas/notificationGroupSchema";

import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function NotificationGroupForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Notification Group" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
//   const uid = props.pscomuid;
//   const pscomnme = props.pscomnme;
//   const pscomidn = props.pscomidn;
//   const pscomeml = props.pscomeml;
//   const pscomphn = props.pscomphn;
  const mode = props.mode;
  const [detailData] = useFetchNotificationGroupDetail(id);
  const [ddlData] = useFetchDDL({ code: ["YESORNO", 'NOTCATG'] });

  const switchStyle: React.CSSProperties = {
    backgroundColor: Colors.DANGER, // Default color when off
  };
  
  const switchCheckedStyle: React.CSSProperties = {
    backgroundColor: Colors.SUCCESS, // Color when on
  };

  const initialValues = {
    psngpcde: "",
    psngpdsc: "",
    psngplds: "",
    psngpsts: false, //temporary switch /maybe DDL
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: NotificationGroupSchema,
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
          id: detailData?.psngpcde,
          psngpsts: detailData?.psngpsts === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);


  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: getManageNotificationGroup({
        ...data,
        psngpsts: formik.values.psngpsts === true ? "Y" : "N",
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
    formik.setFieldValue("psngpsts", !formik.values.psngpsts);
  };


  return (
    <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Notification Group
            </Text>
            <Breadcrumbs breadcrumbItems={[
                  {
                    title: "Notification Group",
                    href: `/notificationGroup`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Notification Group ("+ mode +")",
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
               id="psngpcde"
               isInvalid={Boolean(formik.errors.psngpcde) && Boolean(formik.touched.psngpcde)}
               isReadOnly={mode === "VIEW" ? true : false}

             >
               
               <CustomFormLabel labelText="Notification Group Code"/>
               { mode ==="EDIT"?<Input
                 placeholder={"Enter Notification Group Code"}
                 type="text"
                 id="psngpcde"
                 name="psngpcde"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={detailData?.psngpcdedsc&&detailData?.psngpcdedsc}
                 
                 isDisabled={mode === "EDIT" ? true : false}
               /> :
              <Select
                  name="psngpcde"
                  placeholder="Please Select Notification Group"
                  value={formik.values.psngpcde}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                {ddlData?.NOTCATG?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>}
               {formik.errors.psngpcde && (
                 <FormErrorMessage>{formik.errors.psngpcde}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="psngpdsc"
               isInvalid={Boolean(formik.errors.psngpdsc) && Boolean(formik.touched.psngpdsc)}
               isReadOnly={mode === "VIEW" ? true : false}
             >
               
               <CustomFormLabel labelText="Description"/>
               <Input
                 placeholder={"Enter Description"}
                 type="text"
                 name="psngpdsc"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.psngpdsc}
               //   isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.psngpdsc && (
                 <FormErrorMessage>{formik.errors.psngpdsc}</FormErrorMessage>
               )}
             </FormControl>
             
             <FormControl
               id="psngplds"
               isInvalid={Boolean(formik.errors.psngplds) && Boolean(formik.touched.psngplds)}
               isReadOnly={mode === "VIEW" ? true : false}
             >
               <FormLabel>Local Description</FormLabel>
               <Input
                 placeholder={"Enter Local Description"}
                 type="text"
                 name="psngplds"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.psngplds}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.psngplds && (
                 <FormErrorMessage>{formik.errors.psngplds}</FormErrorMessage>
               )}
             </FormControl>
             

             { mode === "EDIT" ? 
                <FormControl
                 id="psngpsts"
                 isInvalid={Boolean(formik.errors.psngpsts) && Boolean(formik.touched.psngpsts)}
                 // columns={{ base: 2, lg: 4 }}
                >
                 
                 
                  <CustomFormLabel labelText="Active"/>
                   <Switch 
                     id="pswebsts" 
                     size='md' 
                     name="pswebsts"
                     isChecked={formik.values.psngpsts}
                     onChange={handleSwitch}
                     onBlur={formik.handleBlur}
                     colorScheme={"green"}
                     sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
                   />
                 
                 {formik.errors.psngpsts && (
                   <FormErrorMessage>
                     {formik.errors.psngpsts}
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
