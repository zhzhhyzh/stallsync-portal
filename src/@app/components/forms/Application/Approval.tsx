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
const Approval = (props: any) => {
    const [checklistArr, setChecklistArr] = useState<any>([])
    const homeData = useAppSelector(selectHome);
   
    const { sendRequest, loading } = useApi({ title: "Member Profile" });
    useEffect(() => {
        props.setLoading(loading)
    }, [loading])
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = props.id;
    const mode = props.mode;
    
    const columns: any[] = [
        {
            title: "Checkbox",
            dataIndex: "cscmpltd",
            render: (_: string, record: any) =>
                <Checkbox isDisabled={detailData?.psaplsts==="APV"||detailData?.psaplsts==="REJ"}onChange={(e) => setChecklistArr([...(checklistArr.filter((item: any) => item.pschkcde !== record?.pschkcde)), { psaplref:id, pschkcde: record?.pschkcde, pschksts: e.target.checked ? "Y" : "N" }])}
                    isChecked={checklistArr?.find((item: any) => item.pschkcde === record?.pschkcde)?.pschksts === "Y"}></Checkbox>
        },
        {
            title: "Check List Description",
            dataIndex: "pschkdsc",
            key: "pschkdsc",
        },
        // {
        //     title: "Completed Date",
        //     dataIndex: "cscmpldt",
        //     key: "cscmpldt",
        // },
        // {
        //     title: "Completed By",
        //     dataIndex: "cscrtusr",
        //     key: "cscrtusr",
        // },


    ];

    // const [actions] = useFetchDDLAction(id);

    const [detailData, onInit, loading2, reset] = useFetchApplicationDetail(id);

    const initialValues = {

        psapldat: "",
        psaplrmk: "",
        psaplstd: "",
        psaplsts: "",
        psaplapv: "",
        
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
    useEffect(() => {
        props.setFormik(formik);
    
        // if(mode==="EDIT") setSubmit(formik.handleSubmit)
      }, [formik.values]);
    
    useEffect(() => {
        props.setFormik(formik)
        // if(mode==="EDIT") setSubmit(formik.handleSubmit)
    }, [])

    useEffect(() => {
        if (mode !== "ADD" && id) {
            props.setDetailData(detailData)

            if (Object.keys(detailData).length === 0) {
                formik.resetForm();
            }
            if (Object.keys(detailData).length > 0) {

                formik.setValues({
                    ...detailData,
                });

                // console.log(detailData?.checklist)
                setChecklistArr(detailData?.checklist)

            }
        }
    }, [detailData]);


    async function onSubmit(data: any) {

      
        data.checklist = checklistArr
        const { success } = await sendRequest({
            fn: getApproveApplication({
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
                router.push("/application");
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
                        <SubHeader labelText="Approval Information"/>

                        <Flex direction={"row"} gap={Spacing.containerPx}>
                            <Flex flex={5}direction={"column"} gap={Spacing.containerPx}>
                                <Flex  direction={"row"} gap={Spacing.containerPx}>
                                    <FormControl
                                        id="psapldat"
                                        isInvalid={Boolean(formik.errors.psapldat) && Boolean(formik.touched.psapldat)}
                                    //    isReadOnly
                                    >
                                        <FormLabel>Creation Date</FormLabel>
                                        <DatePicker disabled style={{ width: '100%' }} format={"DD-MM-YYYY"} value={
                                            formik.values.psapldat
                                                ? dayjs(formik.values.psapldat)
                                                : null
                                        }
                                            onChange={(value) =>
                                                formik.handleChange({
                                                    target: { value, name: "psapldat" },
                                                })
                                            } />

                                        {formik.errors.psapldat && (
                                            <FormErrorMessage>{formik.errors.psapldat}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        id="psaplsts"
                                        isInvalid={Boolean(formik.errors.psaplsts) && Boolean(formik.touched.psaplsts)}
                                    >
                                        <FormLabel>Action</FormLabel>
                                        <Select
                                        // isDisabled={  detailData?.psaplsts==="APV"||detailData?.psaplsts==="REJ"
                                        // }
                                                                               isDisabled={mode==="VIEW"||!detailData?.editable||(detailData.psaplsts==="REJ"||detailData?.psaplsts==="APV")}

                                            placeholder="Select Action"
                                            value={formik.values.psaplsts}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >

                                         {(detailData.psaplsts==="REJ"||detailData?.psaplsts==="APV")? ddlData?.APRV?.map((option: DDL_TYPES) => (
                                                <option key={option.prgecode} value={option.prgecode}>
                                                    {option.prgedesc}
                                                </option>
                                                 ))
                                           : ddlData?.APRV?.filter((option: DDL_TYPES)=>detailData?.actions?.find((action:any)=>action===option.prgecode)).map((option: DDL_TYPES) => (
                                                <option key={option.prgecode} value={option.prgecode}>
                                                    {option.prgedesc}
                                                </option>
                                                 ))}
                                           
                                        </Select>
                                        {formik.errors.psaplsts && (
                                            <FormErrorMessage>{formik.errors.psaplsts}</FormErrorMessage>
                                        )}
                                    </FormControl>
                               
                                </Flex>
                                <Flex direction={"row"} gap={Spacing.containerPx}>
                                   
                                    <FormControl
                                        id="psapldat"
                                        isInvalid={Boolean(formik.errors.psapldat) && Boolean(formik.touched.psapldat)}
                                    //    isReadOnly
                                    >
                                        <FormLabel>Approval Date</FormLabel>
                                        <DatePicker disabled style={{ width: '100%' }} value={
                                            formik.values.psapldat
                                                ? dayjs(formik.values.psapldat)
                                                : null
                                        }
                                            onChange={(value) =>
                                                formik.handleChange({
                                                    target: { value, name: "psapldat" },
                                                })
                                            } format={"DD-MM-YYYY"} />

                                        {formik.errors.psapldat && (
                                            <FormErrorMessage>{formik.errors.psapldat}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl
                                        id="psaplapv"
                                        isInvalid={Boolean(formik.errors.psaplapv) && Boolean(formik.touched.psaplapv)}
                                    //    isReadOnly
                                    >
                                        <FormLabel>Approval By</FormLabel>
                                        <Input
                                    placeholder={"Enter Approval By"}
                                    type="text"
                                    name="psaplapv"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.psaplsts==="APV"?homeData?.psusrunm:detailData?.psaplsts==="APV"?detailData?.psaplapv:""     }
                                    isDisabled={true}
                                />

                                        {formik.errors.psapldat && (
                                            <FormErrorMessage>{formik.errors.psapldat}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                </Flex>

                            </Flex>
                            <FormControl
                            h="100%"
                            flex={5}
                                id="psaplrmk"
                                isInvalid={Boolean(formik.errors.psaplrmk) && Boolean(formik.touched.psaplrmk)}
                             isDisabled={mode==="VIEW"||!detailData?.editable||(detailData.psaplsts==="REJ"||detailData?.psaplsts==="APV")}

                            >
                                <FormLabel>Application Remarks</FormLabel>
                                <Textarea
                                h="82.5%"
                                    placeholder={"Enter Application Remarks"}
                                    name="psaplrmk"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.psaplrmk || ""}
                                    isDisabled={mode === "VIEW"}
                                />
                            </FormControl>
                        </Flex>



                    </Card>


                </Box>
                



            </div>




            <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
                <Box>
                    <Space size="small">
                    <Buttons buttonDefaultType={"BACK"} onclick={homeData?.psusrtyp==="AGT"?() => router.push("/applicationAgent"):() => router.push("/application")} />

                        {
                            mode && mode !== "VIEW" && (
                                <Buttons
                                    buttonDefaultType={"SAVE"} buttonLoading={loading}
                                />
                            )}
                    </Space>
                </Box>
            </Flex>
        </Box>
    )
}

export default Approval