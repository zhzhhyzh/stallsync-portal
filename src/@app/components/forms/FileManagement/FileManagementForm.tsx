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
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

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

import { getManageFileManagement } from "@app/redux/fileManage/slice";
import useFetchFileManagementDetail from "@app/hooks/selector/useFetchFileManagementDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { AdminAccountSchema, AdminAccountSchemaAdd } from "@app/components/forms/@schemas/adminAccountSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import { FileManagementSchema } from "../@schemas/fileManagementSchema";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function FileManagementForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "File Management" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [detailData] =
  useFetchFileManagementDetail(id);
  const [ddlData] = useFetchDDL({ code: ["USRSTS", "USRROLE", "TBLTYPE"] });

  const initialValues = {
    pstblnme: "", //file name
    pstbltyp: "", //table type / file type 'P' or 'F' //ddl
    pstblkey: "", //table key /file key
    pstbldsc: "", //table or file desc
    pstbllds: "",//table or file local desc
    pstblpnt: "", //table parent file or 

  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: FileManagementSchema,
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
        });
      }
    }
  }, [detailData]);

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: getManageFileManagement(data),
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
                    File Management
                </Text>
                <Breadcrumbs breadcrumbItems={[
                        {
                        title: "File Management",
                        href: `/fileManagements`,// Add parameter if needed eg. /generalParameter/?id=123
                        },
                        {
                        title: "File Management ("+ mode +")",
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
            <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">

            <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
            >

              <Stack align={"center"} spacing={0} direction={"row"}>

                <FormControl
                id="pstblnme"
                isInvalid={Boolean(formik.errors.pstblnme) && Boolean(formik.touched.pstblnme)}
                isReadOnly={mode === "EDIT" ? true : false}
                >
                
                <CustomFormLabel labelText="File Name"/>
                <Input
                    placeholder={"Enter File Name"}
                    type="text"
                    name="pstblnme"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pstblnme}
                //   isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.pstblnme && (
                    <FormErrorMessage>{formik.errors.pstblnme}</FormErrorMessage>
                )}
                </FormControl>

                <div style={{ flex: '1', padding: '1rem' }}></div>

                <FormControl
                id="pstbldsc"
                isInvalid={Boolean(formik.errors.pstbldsc) && Boolean(formik.touched.pstbldsc)}
                isReadOnly={mode === "VIEW" ? true : false}
                >
          
                <CustomFormLabel labelText="File Description"/>
                <Input
                    placeholder={"Enter Description"}
                    type="text"
                    name="pstbldsc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pstbldsc}
                />
                {formik.errors.pstbldsc && (
                    <FormErrorMessage>{formik.errors.pstbldsc}</FormErrorMessage>
                )}
                </FormControl>


              </Stack>
              
              
              <Stack align={"center"} spacing={0} direction={"row"}>
                <FormControl
                    id="pstbltyp"
                    isInvalid={Boolean(formik.errors.pstbltyp) && Boolean(formik.touched.pstbltyp)}
                >
                    
                    <CustomFormLabel labelText="File Type"/>
                    <Select
                    placeholder="Please Select Type"
                    value={formik.values.pstbltyp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={mode === "VIEW" ? true : false}
                    >
                    {ddlData?.TBLTYPE?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                        </option>
                    ))}
                    </Select>
                    {formik.errors.pstbltyp && (
                    <FormErrorMessage>
                        {formik.errors.pstbltyp}
                    </FormErrorMessage>
                    )}
                </FormControl>

                <div style={{ flex: '1', padding: '1rem' }}></div>

                <FormControl
                id="pstbllds"
                isInvalid={Boolean(formik.errors.pstbllds) && Boolean(formik.touched.pstbllds)}
                isReadOnly={mode === "VIEW" ? true : false}
                >
                <FormLabel>File Local Description </FormLabel>
                <Input
                    placeholder={"Enter Local Description"}
                    type="text"
                    name="pstbllds"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pstbllds}
                />
                {formik.errors.pstbllds && (
                    <FormErrorMessage>{formik.errors.pstbllds}</FormErrorMessage>
                )}
                </FormControl>


              </Stack>


                <FormControl //DDL
                id="pstblpnt"
                isInvalid={Boolean(formik.errors.pstblpnt) && Boolean(formik.touched.pstblpnt)}
                // isReadOnly={mode === "VIEW" ? true : false}
                >
                
                <CustomFormLabel labelText="Parent File"/>
                <Input
                    placeholder={"Enter Parent File"}
                    type="text"
                    name="pstblpnt"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pstblpnt}
                    width={"md"}
                />
                {formik.errors.pstblpnt && (
                    <FormErrorMessage>{formik.errors.pstblpnt}</FormErrorMessage>
                )}
                </FormControl>

            </Card>

                
            </Box>

           

        </div>
        <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
            <Box>
            <Space size="small">
                <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
                {
                mode && mode !== "VIEW" && (
                    <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                )}
            </Space>
            </Box>
        </Flex>

    </form>
  );
}