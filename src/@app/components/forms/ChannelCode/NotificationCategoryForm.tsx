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
  IconButton
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties } from "react";

import Spacing from "@app/constants/Spacing";

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


import useFetchNotificationCategoryDetail from "@app/hooks/selector/useFetchNotificationCategoryDetail";

import { ChannelCodeSchema } from "../@schemas/channelCodeSchema";

import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchNotificationGroupCode from "@app/hooks/selector/useFetchNotificationGroupCode";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { getManageNotificationCategory } from "@app/redux/notificationCategory/slice";

import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function NotificationCategoryForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Notification Category" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const pschncde = props.pschncde;

//   const psngpcde = props.psngpcde;
  const mode = props.mode;
  const [detailData] = useFetchNotificationCategoryDetail(id);
  const [ddlData] = useFetchDDL({ code: ["YESORNO", 'NOTCHNL', 'NOTCATG', 'CHNTYPE'] });

    const [showPassword, setShowPassword] = useState(false);

  const switchStyle: React.CSSProperties = {
    backgroundColor: Colors.DANGER, // Default color when off
  };
  
  const switchCheckedStyle: React.CSSProperties = {
    backgroundColor: Colors.SUCCESS, // Color when on
  };

  const initialValues = {
    pschncde: "",
    // psncpcde: "",
    psncpcde: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    // validationSchema: ChannelCodeSchema,
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
          pschncde: detailData?.pschncde,
        //   pschnsts: detailData?.pschnsts === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);


  async function onSubmit(data: any) {
    const { success } = await sendRequest({
        fn: getManageNotificationCategory({
            ...data,
            pschncde: pschncde,
        }
        ),
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

//   const handleSwitch = () => {
//     formik.setFieldValue("pschnsts", !formik.values.pschnsts);
//   };


  return (
    <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Notification Category
            </Text>
            <Breadcrumbs breadcrumbItems={[
                  {
                    title: "Communication Channel",
                    href: `/channelCode`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Notification Category",
                    href: `/channelCode/notificationCategory`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Notification Category ("+ mode +")",
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

      <div className="flex flex-col sm:flex-row gap-6">
        
        
      <Box display="flex" flexDir="column" gap={6} width="100%">
        
      <Card
        p={4}

        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >

             {mode === "VIEW" && id ? <FormControl
               id="pschncde"
               isInvalid={Boolean(formik.errors.pschncde) && Boolean(formik.touched.pschncde)}
               isReadOnly
             >
               <CustomFormLabel labelText="Channel Code"/>
               <Input
                 placeholder={"Enter Channel Code"}
                 type="text"
                 id="pschncde"
                 name="pschncde"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschncde}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschncde && (
                 <FormErrorMessage>{formik.errors.pschncde}</FormErrorMessage>
               )}
             </FormControl>

             :

             <FormControl
               id="pschncde"
               isInvalid={Boolean(formik.errors.pschncde) && Boolean(formik.touched.pschncde)}
               isReadOnly
             >
               <CustomFormLabel labelText="Channel Code"/>
               <Input
                 placeholder={"Enter Channel Code"}
                 type="text"
                 id="pschncde"
                 name="pschncde"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={pschncde}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschncde && (
                 <FormErrorMessage>{formik.errors.pschncde}</FormErrorMessage>
               )}
             </FormControl>
             
             }

             <FormControl
               id="psncpcde"
               isInvalid={Boolean(formik.errors.psncpcde) && Boolean(formik.touched.psncpcde)}
            //    isReadOnly
             >
               <CustomFormLabel labelText="Notification Category Group"/>
               <Select
                  name="psncpcde"
                  placeholder="Please Select Notification Category"
                  value={formik.values.psncpcde}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.NOTCATG?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
               {formik.errors.psncpcde && (
                 <FormErrorMessage>{formik.errors.psncpcde}</FormErrorMessage>
               )}
             </FormControl>

            

            </Card>

            </Box>

        </div>

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