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

import { getManageChannelCode } from "@app/redux/channelCode/slice";

import useFetchChannelCodeDetail from "@app/hooks/selector/useFetchChannelCodeDetail";

import { ChannelCodeSchema } from "../@schemas/channelCodeSchema";

import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchNotificationGroupCode from "@app/hooks/selector/useFetchNotificationGroupCode";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function CommunicationChannelForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Communication Channel" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] = useFetchChannelCodeDetail(id);
  const [ddlData] = useFetchDDL({ code: ["YESORNO", 'NOTCHNL', 'NOTCATG', 'CHNTYPE', 'AUTHMTD'] });


  const [showPassword, setShowPassword] = useState(false);

  const switchStyle: React.CSSProperties = {
    backgroundColor: Colors.DANGER, // Default color when off
  };
  
  const switchCheckedStyle: React.CSSProperties = {
    backgroundColor: Colors.SUCCESS, // Color when on
  };

  const initialValues = {

    pschncde: "",
    pschntyp: "",
    pschndsc: "",
    pschnlds: "",
    pschnenp: "",
    pschnunm: "",
    pschnpwd: "",
    pschnapk: "",
    pschnsrt: "",
    pschnscc: "",
    pschnsnd: "",
    pschnsts: "Y",
    pschnstd: "",
    pschnprt: "",

    pschnaut: "",

  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ChannelCodeSchema,
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
          id: detailData?.pschncde,
        //   pschnsts: detailData?.pschnsts === "Y" ? true : false,
        });
      }
    }
  }, [detailData]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };



  async function onSubmit(data: any) {
    const { success } = await sendRequest({
        fn: getManageChannelCode({
            ...data,
            pschnstd: formik.values.pschnstd
                      ? dayjs(formik.values.pschnstd)
                      : null

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

  const handleSwitch = () => {
    formik.setFieldValue("pschnsts", !formik.values.pschnsts);
  };


  return (
    <form onSubmit={formik.handleSubmit}>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Communication Channel
            </Text>
            <Breadcrumbs breadcrumbItems={[
                  {
                    title: "Communication Channel",
                    href: `/channelCode`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Communication Channel ("+ mode +")",
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

      <Text fontSize="19pt" fontWeight={"500"}>Channel Information</Text>

             <FormControl
               id="pschncde"
               isInvalid={Boolean(formik.errors.pschncde) && Boolean(formik.touched.pschncde)}
                //isReadOnly
             >
               {/* <FormLabel>Channel Code*</FormLabel> */}
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

             <FormControl
               id="pschntyp"
               isInvalid={Boolean(formik.errors.pschntyp) && Boolean(formik.touched.pschntyp)}
            //    isReadOnly
             >
               {/* <FormLabel>Channel Type*</FormLabel> */}
               <CustomFormLabel labelText="Channel Type"/>
               <Select
                  name="pschntyp"
                  placeholder="Please Select Channel Type"
                  value={formik.values.pschntyp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.CHNTYPE?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
               {formik.errors.pschntyp && (
                 <FormErrorMessage>{formik.errors.pschntyp}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="pschndsc"
               isInvalid={Boolean(formik.errors.pschndsc) && Boolean(formik.touched.pschndsc)}
            //    isReadOnly
             >
               {/* <FormLabel>Description*</FormLabel> */}
               <CustomFormLabel labelText="Description"/>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschndsc"
                 name="pschndsc"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschndsc}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschndsc && (
                 <FormErrorMessage>{formik.errors.pschndsc}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="pschnlds"
               isInvalid={Boolean(formik.errors.pschnlds) && Boolean(formik.touched.pschnlds)}
            //    isReadOnly
             >
               <FormLabel>Local Description</FormLabel>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnlds"
                 name="pschnlds"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnlds}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnlds && (
                 <FormErrorMessage>{formik.errors.pschnlds}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="pschnenp"
               isInvalid={Boolean(formik.errors.pschnenp) && Boolean(formik.touched.pschnenp)}
            //    isReadOnly
             >
               {/* <FormLabel>Channel Endpoint*</FormLabel> */}
               <CustomFormLabel labelText="Channel Endpoint"/>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnenp"
                 name="pschnenp"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnenp}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnenp && (
                 <FormErrorMessage>{formik.errors.pschnenp}</FormErrorMessage>
               )}
             </FormControl>

            <FormControl
               id="pschnsnd"
               isInvalid={Boolean(formik.errors.pschnsnd) && Boolean(formik.touched.pschnsnd)}
            //    isReadOnly
             >
               {/* <FormLabel>Sender Name*</FormLabel> */}
               <CustomFormLabel labelText="Sender Name"/>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnsnd"
                 name="pschnsnd"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnsnd}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnsnd && (
                 <FormErrorMessage>{formik.errors.pschnsnd}</FormErrorMessage>
               )}
             </FormControl>


              <FormControl
               id="pschnprt"
               isInvalid={Boolean(formik.errors.pschnprt) && Boolean(formik.touched.pschnprt)}
            //    isReadOnly
             >
               {/* <FormLabel>Port Number*</FormLabel> */}
               <CustomFormLabel labelText="Port Number"/>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnprt"
                 name="pschnprt"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnprt}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnprt && (
                 <FormErrorMessage>{formik.errors.pschnprt}</FormErrorMessage>
               )}
             </FormControl>

            
          

            

           

        
        </Card>

      </Box>

      <Box display="flex" flexDir="column" gap={6} width="100%">

            <Card
            p={4}

            mt={`${Spacing.containerPx}`}
            className="grid grid-cols-1 gap-6"
            >

            <Text fontSize="19pt" fontWeight={"500"}>Authentic Information</Text>

            <FormControl
               id="pschnaut"
               isInvalid={Boolean(formik.errors.pschnaut) && Boolean(formik.touched.pschnaut)}
            //    isReadOnly
             >
               {/* <FormLabel>Authentication Method*</FormLabel> */}
               <CustomFormLabel labelText="Authentication Method"/>
               <Select
                  name="pschnaut"
                  placeholder="Please Select Authentication Method"
                  value={formik.values.pschnaut}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.AUTHMTD?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
               {formik.errors.pschnaut && (
                 <FormErrorMessage>{formik.errors.pschnaut}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="pschnunm"
               isInvalid={Boolean(formik.errors.pschnunm) && Boolean(formik.touched.pschnunm)}
            //    isReadOnly
             >
               <FormLabel>Username</FormLabel>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnunm"
                 name="pschnunm"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnunm}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnunm && (
                 <FormErrorMessage>{formik.errors.pschnunm}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="pschnpwd"
               isInvalid={Boolean(formik.errors.pschnpwd) && Boolean(formik.touched.pschnpwd)}
            //    isReadOnly
             >
               <FormLabel>Password</FormLabel>
               <InputGroup>
                <Input
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                onChange={formik.handleChange}
                value={formik.values.pschnpwd}
                />
                <InputRightElement width="4.5rem">
                <IconButton
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={handleShowPassword}
                    icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    aria-label={""}
                />
                </InputRightElement>
            </InputGroup>
               {formik.errors.pschnpwd && (
                 <FormErrorMessage>{formik.errors.pschnpwd}</FormErrorMessage>
               )}
             </FormControl>
            
            <FormControl
               id="pschnapk"
               isInvalid={Boolean(formik.errors.pschnapk) && Boolean(formik.touched.pschnapk)}
            //    isReadOnly
             >
               <FormLabel>API Key</FormLabel>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnapk"
                 name="pschnapk"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnapk}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnapk && (
                 <FormErrorMessage>{formik.errors.pschnapk}</FormErrorMessage>
               )}
             </FormControl>

             <FormControl
               id="pschnsrt"
               isInvalid={Boolean(formik.errors.pschnsrt) && Boolean(formik.touched.pschnsrt)}
            //    isReadOnly
             >
               <FormLabel>API Secret</FormLabel>
               <Input
                //  placeholder={"Enter Notification Code"}
                 type="text"
                 id="pschnsrt"
                 name="pschnsrt"
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 value={formik.values.pschnsrt}
                 
                 // isDisabled={mode === "EDIT" ? true : false}
               />
               {formik.errors.pschnsrt && (
                 <FormErrorMessage>{formik.errors.pschnsrt}</FormErrorMessage>
               )}
             </FormControl>
             
             <FormControl
               id="pschnscc"
               isInvalid={Boolean(formik.errors.pschnscc) && Boolean(formik.touched.pschnscc)}
               isReadOnly={mode === "VIEW" ? true : false}
             >
               <FormLabel>Secure Connection</FormLabel>
               <Select
                  name="pschnscc"
                  placeholder="Please Select Secure Connection Channel"
                  value={formik.values.pschnscc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.YESORNO?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
               {formik.errors.pschnscc && (
                 <FormErrorMessage>{formik.errors.pschnscc}</FormErrorMessage>
               )}
             </FormControl>

            
             {mode === "EDIT" ? <FormControl
                id="pschnstd"
                isInvalid={Boolean(formik.errors.pschnstd) && Boolean(formik.touched.pschnstd)}
              >
                <FormLabel>Status Date</FormLabel>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  value={
                    formik.values.pschnstd
                      ? dayjs(formik.values.pschnstd)
                      : null
                  }
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "pschnstd" },
                    })
                  }
                  onBlur={formik.handleBlur}
                  disabled={true}
                />
                {formik.errors.pschnstd && (
                  <FormErrorMessage>{formik.errors.pschnstd}</FormErrorMessage>
                )}
              </FormControl> : null}
             

            {mode === "EDIT" ? <FormControl
                id="pschnsts"
                isInvalid={Boolean(formik.errors.pschnsts) && Boolean(formik.touched.pschnsts)}
                // columns={{ base: 2, lg: 4 }}
            >
                 
                {/* <FormLabel>Status*</FormLabel>           */}
                <CustomFormLabel labelText="Status"/>

                <Select
                  name="pschnsts"
                  placeholder="Please Select Status"
                  value={formik.values.pschnsts}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // isDisabled={mode === "VIEW" ? true : false}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {ddlData?.YESORNO?.map(
                    (
                      option: DDL_TYPES //change code
                    ) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    )
                  )}
                </Select>
                 
                {formik.errors.pschnsts && (
                <FormErrorMessage>
                    {formik.errors.pschnsts}
                </FormErrorMessage>
                )}
            </FormControl> : null}

            </Card>

            </Box>

        </div>

        {/* </Box> */}
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