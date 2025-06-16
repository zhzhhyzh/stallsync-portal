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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag, AutoComplete } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";

import { getManageTableKey } from "@app/redux/tableKey/slice";

import useFetchTableKeyDetail from "@app/hooks/selector/useFetchTableKeyDetail";

import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";

// import useFetchDDLMembers from "@app/hooks/selector/useFetchDDLMembers";
import useFetchDDLTableKeys from "@app/hooks/selector/useFetchDDLTableKeys";
import { TableKeySchema } from "../@schemas/tableKeySchema";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

const initialValues = {
  pstblnme: "",
  pstblkyn: "", //autocomplete //set
  pstblkys: "", //number only
};

export default function TableKeyForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Table Key" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const pstblnme = props.pstblnme;
  const pstbldsc = props.pstbldsc;

  const [fieldName, setFieldName] = useState("");

  console.log("ID=>", id)


  const [detailData] =
  useFetchTableKeyDetail(id);
  const [ddlData] = useFetchDDL({ code: ["USRSTS", "USRROLE", "TBLTYPE"] });
//   const [ddlMembersData] = useFetchDDLMembers();
  const [ddlTableKeysData] = useFetchDDLTableKeys();

  const { Option } = AutoComplete;

  const [tableKeyDetails, setTableKeyDetails] = useState<any[]>([]);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TableKeySchema,
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
          // id: detailData?.id,
          // pstblnme: detailData?.pstblnme,
          // pstblkyn: detailData?.pstblkyn,

        });

      }
    }
  }, [detailData]);

  useEffect(() => {
    if(Array.isArray(ddlTableKeysData)){
        setTableKeyDetails(ddlTableKeysData);
        // console.log("table key", tableKeyDetails)
    }

      
  }, [ddlTableKeysData])

  useEffect(() => {
    if(formik.values.pstblkyn && tableKeyDetails) { 
      for(let i = 0; i < tableKeyDetails.length; i++) {
        if(formik.values.pstblkyn === tableKeyDetails[i].field + " - " + tableKeyDetails[i].description) {
          // formik.setFieldValue("pstblkyn", tableKeyDetails[i].field + " " + tableKeyDetails[i].description)
          // formik.setFieldValue("pstblkynf", tableKeyDetails[i].field + " " + tableKeyDetails[i].description)
          setFieldName(tableKeyDetails[i].field)
        }
      }
    }

    // console.log("value?", formik.values.pstblkyn)
    // console.log("value?", fieldName)

  }, [tableKeyDetails, formik.values.pstblkyn])


  useEffect(() => {
    if(mode === "EDIT" && Object.keys(detailData).length > 0) {

        for(let i = 0; i < tableKeyDetails.length; i++) {
          if(detailData?.pstblkyn === tableKeyDetails[i]?.field) {
            formik.setFieldValue("pstblkyn", tableKeyDetails[i]?.field + " - " + tableKeyDetails[i]?.description)
            // formik.setFieldValue("pstblkynf", tableKeyDetails[i].field + " " + tableKeyDetails[i].description)
            // setFieldName(tableKeyDetails[i].field)
          }
        }
      

    }
  }, [detailData])

  useEffect(() => {
    if(fieldName) {
      console.log("?", fieldName)
    }
  }, [fieldName])
  

  async function onSubmit(data: any) {
    const { success } = await sendRequest({
      fn: mode === "EDIT" ? getManageTableKey({
        // pstblnme: formik.values.pstblnme,
        // pstblkyn: formik.values.pstblkyn,
        id: id,
        pstblkys: formik.values.pstblkys,
      }) 
      
      : 
      
      getManageTableKey({
        pstblnme: pstblnme,
        pstblkyn: fieldName,
        pstblkys: formik.values.pstblkys,
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

  const filterOption = (inputValue: string, option: any) => {
    return option.value.includes(inputValue.trim());
  };

  const handleInputChange = (value: string) => {
    setFieldName(value);
  };



  function handleTableKeySearch(value: any) {
    const filteredOptions = (Array.isArray(ddlTableKeysData) ? ddlTableKeysData : []).filter((tableKey: any) =>
        tableKey?.description?.toLowerCase().includes(value.toLowerCase()) ||
        tableKey?.field?.toLowerCase().includes(value.toLowerCase())
    );
        
    setTableKeyDetails(filteredOptions);
  }

  return (
    <form onSubmit={formik.handleSubmit}>
            <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
            <Flex direction={"column"} alignSelf={"center"}>
                <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                File Key
                </Text>
                <Breadcrumbs breadcrumbItems={[
                    {
                        title: "File Management",
                        href: `/fileManagements`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                        title: "File Key",
                        href: `/fileManagements/tableKeys/?pstblnme=${pstblnme}`,// Add parameter if needed eg. /generalParameter/?id=123
                    },
                    {
                        title: "File Key ("+ mode +")",
                        
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

            
            <FormControl
                id="pstblnme"
                isInvalid={Boolean(formik.errors.pstblnme) && Boolean(formik.touched.pstblnme)}
                isReadOnly
            >
               
                <CustomFormLabel labelText="File Name"/>
                <Input
                    placeholder={"Enter File Name"}
                    type="text"
                    name="pstblnme"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={id ? (formik.values.pstblnme + " - " + pstbldsc) : (pstblnme + " - " + pstbldsc)}
                //   isDisabled={mode === "EDIT" ? true : false}
                />
                {formik.errors.pstblnme && (
                    <FormErrorMessage>{formik.errors.pstblnme}</FormErrorMessage>
                )}
            </FormControl>

            <FormControl
                id="pstblkyn"
                isInvalid={Boolean(formik.errors.pstblkyn) && Boolean(formik.touched.pstblkyn)}
                // isReadOnly={mode === "EDIT" ? true : false}
            >
                <FormLabel>File Key</FormLabel>

                <AutoComplete
                    style={{ 
                        width: "100%",
                        // position: "absolute"
                    }}
                    // dropdownStyle={{ zIndex: 1001 }} 
                    className="pstblkyn"
                    dataSource={tableKeyDetails}
                    onSearch={handleTableKeySearch}
                    filterOption={filterOption}
                    placeholder="Search Table Key"
                    size="middle"
                    onChange={(e: any) => 
                      formik.setFieldValue("pstblkyn", e)
                    }
                    // onChange={handleInputChange}
                    value={formik.values.pstblkyn}
                    disabled={mode !== "ADD" ? true : false}
                >                                                       
                    {(tableKeyDetails).map((option:any) => (           
                        <Option key={option.id} value={option.field + " - " + option.description}>
                            {option.field} - {option.description}
                        </Option>               
                    ))}
                </AutoComplete>
                {formik.errors.pstblkyn && (
                  <FormErrorMessage>
                    {formik.errors.pstblkyn}
                  </FormErrorMessage>
                )}
                
            </FormControl>
                

            <FormControl
                id="pstblkys"
                isInvalid={Boolean(formik.errors.pstblkys) && Boolean(formik.touched.pstblkys)}
            >
                
                <CustomFormLabel labelText="File Key Sequence"/>
                <NumberInput
                  name="pstblkys"
                  min={0}
                  onChange={(value) =>
                    formik.handleChange({
                      target: { value, name: "pstblkys" },
                    })
                  }
                  value={formik.values.pstblkys}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {formik.errors.pstblkys && (
                  <FormErrorMessage>
                    {formik.errors.pstblkys}
                  </FormErrorMessage>
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