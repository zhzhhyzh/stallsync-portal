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
  Textarea,
  Checkbox,
  Switch,
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";


// assets
import React, { useEffect, useState } from "react";
import { message, Upload, } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getManageCompar } from "@app/redux/compar/slice";
import useFetchComparDetail from "@app/hooks/selector/useFetchComparDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { ComparSchema } from "@app/components/forms/@schemas/ComparSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
import useFetchMembers from "@app/hooks/selector/useFetchMembers";

export default function ComparForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Company Parameter Detail" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;
  const [agents] = useFetchDDLAgent();
  const [agent] = useFetchMembers({limit:30})
  const [detailData] = useFetchComparDetail(id);

  const initialValues = {
    // pscomuid: null,
    pscomcde: null,
    pscomnme: null,
    pscompre: null,
    pscomspv: '',

    pscomsts: true,

  };


  const [ddlData] = useFetchDDL({ code: ["TRNSTYPE", "YESORNO", "DRCR", "TRNSDORC", "TRNSAFFCD"] });



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ComparSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.pscomuid,
        pscomsts: detailData?.pscomsts == 'Y' ? true: false
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {


    const { success } = await sendRequest({
      fn: getManageCompar({
        id: mode === "EDIT" ? data.id : "", ...data,
        pscomsts: formik.values.pscomsts ? 'Y' : 'N'
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update item" : "Add item",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }

  const handleStatusChange = () => {
    formik.setFieldValue("pscomsts", !formik.values.pscomsts);
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Company Parameter Detail
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Company Parameter",
              href: `/company`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Company Parameter Detail (" + mode + ")",
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
      <Card
        p={4}
        mt={`${Spacing.containerPx}`}
        className="grid grid-cols-1 gap-6"
      >
        <Box>
          <div className="flex flex-col sm:flex-row gap-6">
            <Box display="flex" flexDir="column" gap={6} width="100%">
              
              <FormControl
                id="pscomcde"
                isInvalid={Boolean(formik.errors.pscomcde) && Boolean(formik.touched.pscomcde)}
                isReadOnly={mode === "VIEW" || mode === "EDIT"  ? true : false}
              >
                {/* <FormLabel>Company Group*</FormLabel> */}
                <CustomFormLabel labelText="Company Code" />
                <Input
                  placeholder={"Enter Company Code"}
                  type="text"
                  name="pscomcde"
                  onChange={formik.handleChange}
                  value={formik.values.pscomcde || ""}
                  isDisabled={mode==="VIEW" || mode === "EDIT" ? true: false}
                />
                {formik.errors.pscomcde && (
                  <FormErrorMessage>{formik.errors.pscomcde}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pscomnme"
                isInvalid={Boolean(formik.errors.pscomnme) && Boolean(formik.touched.pscomnme)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Company Name" />

                <Input
                  placeholder={"Enter Company Name"}
                  type="text"
                  name="pscomnme"
                  onChange={formik.handleChange}
                  value={formik.values.pscomnme || ""}
                />
                {formik.errors.pscomnme && (
                  <FormErrorMessage>{formik.errors.pscomnme}</FormErrorMessage>
                )}
              </FormControl>
            
              <FormControl
                id="pscomspv"
                isInvalid={
                  Boolean(formik.errors.pscomspv) &&
                  Boolean(formik.touched.pscomspv)
                }
              >
                <CustomFormLabel labelText="Company Supervisor" />
                <Select
                  placeholder="Please Select Company Supervisor"
                  value={formik.values.pscomspv}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isDisabled={mode === "EDIT" ? true : false}
                >
                  {Array.isArray(agents) &&
                    agents.map((option: any) => (
                      <option
                        key={option.psmbruid}
                        value={option.psmbruid}
                      >
                        {option.psmbruid + " - " + option.psmbrnme}
                      </option>
                    ))}
                </Select>
                {formik.errors.pscomspv && (
                  <FormErrorMessage>
                    {formik.errors.pscomspv}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                id="pscompre"
                isInvalid={Boolean(formik.errors.pscompre) && Boolean(formik.touched.pscompre)}
                isReadOnly={mode === "VIEW" ? true : false}
              >
                <CustomFormLabel labelText="Company Prefix" />

                <Input
                  placeholder={"Enter Company Prefix"}
                  type="text"
                  name="pscompre"
                  onChange={formik.handleChange}
                  value={formik.values.pscompre || ""}
                />
                {formik.errors.pscompre && (
                  <FormErrorMessage>{formik.errors.pscompre}</FormErrorMessage>
                )}
              </FormControl>
            </Box>


            <Box display="flex" flexDir="column" gap={6} width="100%">
             
           {
            mode!="ADD" &&
            <FormControl
            id="pscomsts"
            isInvalid={Boolean(formik.errors.pscomsts) && Boolean(formik.touched.pscomsts)}
          >
            <FormLabel>Company Status</FormLabel>
            <Switch
              id="pscomsts"
              name="pscomsts"
              isChecked={mode === "ADD" ? true : formik.values.pscomsts}
              onChange={handleStatusChange}
              onBlur={formik.handleBlur}
              size="md"
              colorScheme={"green"}
              sx={{ 'span.chakra-switch__track:not([data-checked])': { backgroundColor: Colors.DANGER } }}
            />
            {formik.errors.pscomsts && (
              <FormErrorMessage>
                {formik.errors.pscomsts}
              </FormErrorMessage>
            )}
          </FormControl>
           }  
           


            </Box>








          </div>
        </Box>
      </Card>
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

