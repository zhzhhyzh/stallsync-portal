// Chakra imports
import Colors from "@app/constants/Colors";
import dayjs from "dayjs";

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
    Radio,
    RadioGroup,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";

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
import { manageAdmin } from "@app/redux/adminAccounts/slice";
import useFetchAdminAccountsDetail from "@app/hooks/selector/useFetchAdminAccountsDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { ReportSchema } from "@app/components/forms/@schemas/omnisendReportSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import { fetchGenerateReport, fetchReports } from "@app/redux/reports/slice";
import Buttons from "@app/components/common/Buttons/Buttons";
import { IoIosRefresh } from "react-icons/io";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
import useFetchDDLDsagent from "@app/hooks/selector/useFetchDDLDsAgent";
import useFetchDDLProduct from "@app/hooks/selector/useFetchDDLProduct";
import useFetchDDLCompany from "@app/hooks/selector/useFetchDDLCompany";

export default function ReportForm(props: any) {
    const { sendRequest, loading } = useApi({ title: "Reporting" });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = props.id;
    const mode = props.mode;

    const [ddlData] = useFetchDDL({ code: ["CUSTTYPE", "RPTTYPE","MONTH"] });
    const [agents] = useFetchDDLAgent();
    const [designations] = useFetchDDLDsagent();
    const [companies] = useFetchDDLCompany();
    const [products] = useFetchDDLProduct();

    const initialValues = {
        prrpttyp: "",
        psaplrcb: "",
        psmbrtyp: "",
        sales_type: "P",
        from: null,
        to: null,
        psprdcde: "",
        psmbruid: "",
        from2: null,
        to2: null,
        month:"",
        year:"",
        psmbrcom:"",
    };
    async function reload() {
        await dispatch(fetchReports({}));
    }
    const [dateError, setDateError] = useState<boolean>(false);
    const [dateError2, setDateError2] = useState<boolean>(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: ReportSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    //   useEffect(() => {
    //     if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
    //       formik.setValues({
    //         ...detailData,
    //         id: detailData?.psusrunm,
    //       });
    //     }
    //   }, [detailData]);

    async function onSubmit(data: any) {
        const { success } = await sendRequest({
            fn: fetchGenerateReport({ ...data, type: "R" }),
            formik,
        });

        reload()
        // if (success) {
        //   setTimeout(() => {
        //     showModal(dispatch, {
        //       title: mode !== "ADD" ? "Update item" : "Add item",
        //       message: mode !== "ADD" ? "Record Updated" : "Record Added",
        //     });
        //     router.back();
        //   }, 200);
        // }
    }
    useEffect(() => {

        console.log(formik.values)

    }, [formik.values])

    useEffect(() => {
        if (formik.values.to && formik.values.from && formik.values.to < formik.values.from)
            setDateError(true);
        else setDateError(false);
    }, [formik.values.from, formik.values.to]);
    useEffect(() => {
        if (formik.values.to2 && formik.values.from2 && formik.values.to2 < formik.values.from2)
            setDateError2(true);
        else setDateError2(false);
    }, [formik.values.from2, formik.values.to2]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
            >
                <Box>
                    <div className="flex flex-col sm:flex-row gap-6" style={{ width: '70%' }}>
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                onChange={formik.handleChange}

                                id="prrpttyp"
                                isInvalid={Boolean(formik.touched.prrpttyp) && Boolean(formik.errors.prrpttyp)}
                            >
                                <FormLabel>Report Type</FormLabel>
                                <Select placeholder=" " value={formik.values.prrpttyp}
                                >
                                    {
                                        Array.isArray(ddlData?.RPTTYPE) &&
                                        ddlData?.RPTTYPE.map((option: any) =>
                                            <option value={option.prgecode}>{option.prgedesc}</option>
                                        )
                                    }
                                </Select>

                                {formik.errors.prrpttyp && (
                                    <FormErrorMessage>{formik.errors.prrpttyp}</FormErrorMessage>
                                )}
                            </FormControl>

                            {formik.values.prrpttyp === "COM" && <FormControl
                                onChange={formik.handleChange}

                                id="psaplrcb"
                                isInvalid={Boolean(formik.touched.psaplrcb) && Boolean(formik.errors.psaplrcb)}
                            >
                                <FormLabel>Recruited By</FormLabel>
                                <Select placeholder=" " value={formik.values.psaplrcb}
                                >
                                    {
                                        Array.isArray(agents) && agents?.map((option: any) =>
                                            <option value={option.psmbruid}>{option.psmbrnme}</option>
                                        )
                                    }
                                </Select>

                                {formik.errors.psaplrcb && (
                                    <FormErrorMessage>{formik.errors.psaplrcb}</FormErrorMessage>
                                )}
                            </FormControl>}
                            {formik.values.prrpttyp === "AGT" && <FormControl
                                onChange={formik.handleChange}

                                id="psaplrcb"
                                isInvalid={Boolean(formik.touched.psaplrcb) && Boolean(formik.errors.psaplrcb)}
                            >
                                <FormLabel>Recruited By</FormLabel>
                                <Select placeholder=" " value={formik.values.psaplrcb}
                                >
                                    {
                                        Array.isArray(agents) && agents?.map((option: any) =>
                                            <option value={option.psmbruid}>{option.psmbrnme}</option>
                                        )
                                    }
                                </Select>

                                {formik.errors.psaplrcb && (
                                    <FormErrorMessage>{formik.errors.psaplrcb}</FormErrorMessage>
                                )}
                            </FormControl>}
                            {formik.values.prrpttyp === "SUB" && <FormControl
                                onChange={formik.handleChange}

                                id="psprdcde"
                                isInvalid={Boolean(formik.touched.psprdcde) && Boolean(formik.errors.psprdcde)}
                            >
                                <FormLabel>Product</FormLabel>
                                <Select placeholder=" " value={formik.values.psprdcde}
                                >
                                    {
                                        Array.isArray(products) && products?.map((option: any) =>
                                            <option value={option.psprdcde}>{option.psprddsc}</option>
                                        )
                                    }
                                </Select>

                                {formik.errors.psprdcde && (
                                    <FormErrorMessage>{formik.errors.psprdcde}</FormErrorMessage>
                                )}
                            </FormControl>}
                            {formik.values.prrpttyp === "COM" && (
                                <FormControl
                                    id="sales_type"
                                    isInvalid={Boolean(formik.touched.sales_type) && Boolean(formik.errors.sales_type)}
                                >
                                    <FormLabel>Type</FormLabel>
                                    <RadioGroup
                                        w="110%"
                                        name="sales_type"
                                        value={formik.values.sales_type} // Make sure to use the current form value
                                        onChange={(value) => {
                                            formik.setFieldValue('sales_type', value); // Update the form value
                                        }}
                                    >
                                        <Radio value="P" mr={Spacing.containerPx}>Personal</Radio>
                                        <Radio value="G">Group</Radio>
                                    </RadioGroup>
                                    {formik.errors.sales_type && (
                                        <FormErrorMessage>{formik.errors.sales_type}</FormErrorMessage>
                                    )}
                                </FormControl>
                            )}
                            {(formik.values.prrpttyp === "SUB") && <FormControl
                                onChange={formik.handleChange}

                                id="psmbruid"
                                isInvalid={Boolean(formik.touched.psmbruid) && Boolean(formik.errors.psmbruid)}
                            >
                                <FormLabel>Agent</FormLabel>
                                <Select placeholder=" " value={formik.values.psmbruid}
                                >
                                    {
                                        Array.isArray(agents) && agents?.map((option: any) =>
                                            <option value={option.psmbruid}>{option.psmbrnme}</option>
                                        )
                                    }
                                </Select>
                                {formik.errors.psmbruid && (
                                    <FormErrorMessage>{formik.errors.psmbruid}</FormErrorMessage>
                                )}
                            </FormControl>}
                        </Box>
                   
                                        
                                {/* {fromYear && new Date(fromYear, 0, 1).getFullYear() !== +fromYear && <Text fontSize={"sm"} color={"red"} mt={2}>Invalid Year</Text>} */}

                                {/* {!fromYear && fromMonth && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>} */}
                                {(formik.values.prrpttyp === "SUB" || formik.values.prrpttyp==="CLIENT" ||formik.values.prrpttyp==="VHCH"||formik.values.prrpttyp==="AGT"||formik.values.prrpttyp==="CP58"||formik.values.prrpttyp==="COM") &&         <Box display="flex" flexDir="column" gap={6} width="100%">
             {(formik.values.prrpttyp === "CP58") && <FormControl
                                onChange={formik.handleChange}

                                id="psmbruid"
                                isInvalid={Boolean(formik.touched.psmbruid) && Boolean(formik.errors.psmbruid)}
                            >
                                <FormLabel>Agent</FormLabel>
                                <Select placeholder=" " value={formik.values.psmbruid}
                                >
                                    {
                                        Array.isArray(agents) && agents?.map((option: any) =>
                                            <option value={option.psmbruid}>{option.psmbrnme}</option>
                                        )
                                    }
                                </Select>
                                {formik.errors.psmbruid && (
                                    <FormErrorMessage>{formik.errors.psmbruid}</FormErrorMessage>
                                )}
                            </FormControl>}
             {   formik.values.prrpttyp==="COM"&&  
                                <Flex    w="100%" flexDir={"column"}>
                                    <FormLabel>Year</FormLabel>
                                    <Input
                                        name="year"
                                        onChange={formik.handleChange}
                                        placeholder="Enter Year"
                                        value={formik.values.year}
                                    >

                                    </Input>
                                    </Flex> }
                            {(formik.values.prrpttyp === "AGT"  ) && <FormControl

                                id="from"
                                isInvalid={dateError}
                            >
                                <FormLabel>From Date</FormLabel>
                                <DatePicker value={formik.values.from ? dayjs(formik.values.from) : null} onChange={(date) => formik.setFieldValue('from', (date))}
                                    className="w-full" />
                                {dateError && (
                                    <FormErrorMessage>
                                        {"From Date cannot be greater than To Date"}
                                    </FormErrorMessage>
                                )}
                            </FormControl>}
                            {(formik.values.prrpttyp === "SUB" || formik.values.prrpttyp==="CLIENT" ||formik.values.prrpttyp==="VHCH") && <FormControl

                                id="from"
                                isInvalid={dateError}
                            >
                                <FormLabel>Submission From Date</FormLabel>
                                <DatePicker value={formik.values.from ? dayjs(formik.values.from) : null} onChange={(date) => formik.setFieldValue('from', (date))}
                                    className="w-full" />
                                {dateError && (
                                    <FormErrorMessage>
                                        {"From Date cannot be greater than To Date"}
                                    </FormErrorMessage>
                                )}
                            </FormControl>}
                            {(formik.values.prrpttyp === "SUB" || formik.values.prrpttyp==="CLIENT"||formik.values.prrpttyp==="VHCH") && <FormControl

                                id="from2"
                                isInvalid={dateError2}
                            >
                                <FormLabel>Deal From Date</FormLabel>
                                <DatePicker value={formik.values.from2 ? dayjs(formik.values.from2) : null} onChange={(date) => formik.setFieldValue('from2', (date))}
                                    className="w-full" />
                                {dateError2 && (
                                    <FormErrorMessage>
                                        {"From Date cannot be greater than To Date"}
                                    </FormErrorMessage>
                                )}
                            </FormControl>}

                            {(formik.values.prrpttyp === "AGT" || formik.values.prrpttyp === "COM")&& <FormControl
                                onChange={formik.handleChange}

                                id="psmbrtyp"
                                isInvalid={Boolean(formik.touched.psmbrtyp) && Boolean(formik.errors.psmbrtyp)}
                            >
                                <FormLabel>Designation</FormLabel>
                                <Select placeholder=" " value={formik.values.psmbrtyp}
                                >
                                    {
                                        Array.isArray(designations) &&
                                        designations?.map((option: any) =>
                                            <option value={option.psdsgcde}>{option.psdsgdsc}</option>
                                        )
                                    }
                                </Select>

                                {formik.errors.psmbrtyp && (
                                    <FormErrorMessage>{formik.errors.psmbrtyp}</FormErrorMessage>
                                )}
                            </FormControl>}
                        </Box>}
                        {    
                        <Box display="flex" flexDir="column" gap={6} width="100%">
   {   (formik.values.prrpttyp==="CP58"||formik.values.prrpttyp==="SALES")&&  
                                <Flex    w="100%" flexDir={"column"}>
                                    <FormLabel>Year</FormLabel>
                                    <Input
                                        name="year"
                                        onChange={formik.handleChange}
                                        placeholder="Enter Year"
                                        value={formik.values.year}
                                    >

                                    </Input>
                                    </Flex> }
                                    
{   (formik.values.prrpttyp==="COM"||formik.values.prrpttyp==="SALES")&&  <Flex w="100%" flexDir={"column"}>
                                    <FormLabel>Month</FormLabel>

                                    <Select
                                        name="month"
                                        onChange={formik.handleChange}
                                        placeholder="Select Month"
                                        value={formik.values.month}
                                    >
                                        {ddlData?.MONTH?.map((option: DDL_TYPES) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))}
                                    </Select>
                                    {/* {fromYear && !fromMonth && <Text fontSize={"sm"} color={"red"} mt={2}>Field is required</Text>} */}
                                </Flex>
                                
                                }


{(formik.values.prrpttyp === "AGT" || formik.values.prrpttyp === "COM")&& <FormControl
                                onChange={formik.handleChange}

                                id="psmbrcom"
                                isInvalid={Boolean(formik.touched.psmbrcom) && Boolean(formik.errors.psmbrcom)}
                            >
                                <FormLabel>Company</FormLabel>
                                <Select placeholder=" " value={formik.values.psmbrcom}
                                >
                                    {
                                        Array.isArray(companies) &&
                                        companies?.map((option: any) =>
                                            <option value={option.pscomuid}>{option.pscomnme}</option>
                                        )
                                    }
                                </Select>

                                {formik.errors.psmbrcom && (
                                    <FormErrorMessage>{formik.errors.psmbrcom}</FormErrorMessage>
                                )}
                            </FormControl>}
                            {(formik.values.prrpttyp === "AGT" ) && <FormControl

                                id="to"
                                isInvalid={Boolean(formik.touched.to) && Boolean(formik.errors.to)}
                            >
                                <FormLabel>To Date</FormLabel>
                                <DatePicker value={formik.values.to ? dayjs(formik.values.to) : null} onChange={(date) => formik.setFieldValue('to', (date))}
                                    className="w-full" />
                                {formik.errors.to && (
                                    <FormErrorMessage>{formik.errors.to}</FormErrorMessage>
                                )}
                            </FormControl>}



                            {(formik.values.prrpttyp === "SUB" || formik.values.prrpttyp==="CLIENT"||formik.values.prrpttyp==="VHCH")  && <FormControl

                                id="to"
                                isInvalid={Boolean(formik.touched.to) && Boolean(formik.errors.to)}
                            >
                                <FormLabel>Submission To Date</FormLabel>
                                <DatePicker value={formik.values.to ? dayjs(formik.values.to) : null} onChange={(date) => formik.setFieldValue('to', (date))}
                                    className="w-full" />
                                {formik.errors.to && (
                                    <FormErrorMessage>{formik.errors.to}</FormErrorMessage>
                                )}
                            </FormControl>}
                            {(formik.values.prrpttyp === "SUB" || formik.values.prrpttyp==="CLIENT"||formik.values.prrpttyp==="VHCH") && <FormControl

                                id="to2"
                                isInvalid={Boolean(formik.touched.to2) && Boolean(formik.errors.to2)}
                            >
                                <FormLabel>Deal To Date</FormLabel>
                                <DatePicker value={formik.values.to2 ? dayjs(formik.values.to2) : null} onChange={(date) => formik.setFieldValue('to2', (date))}
                                    className="w-full" />
                                {formik.errors.to2 && (
                                    <FormErrorMessage>{formik.errors.to2}</FormErrorMessage>
                                )}
                            </FormControl>}
                        </Box>
}
                    </div>
                    <Flex pt={5} pb={5} justifyContent="flex-end">
                        <Box>
                            <Space size="small">
                                <Buttons
                                    leftIcon={<IoIosRefresh />}
                                    bgColor={Colors.PRIMARY}
                                    buttonDefaultType="CUSTOM"
                                    onclick={reload}
                                    //    isLoading={loadi0ng}
                                    buttonText="Refresh"
                                >
                                </Buttons>

                                <Buttons
                                    leftIcon={<IoSave />}
                                    bgColor={Colors.SUCCESS}
                                    buttonDefaultType="CUSTOM"
                                    type="submit"
                                    isLoading={loading}
                                    buttonText="Generate"
                                >
                                </Buttons>

                            </Space>
                        </Box>
                    </Flex>
                </Box>
            </Card>
        </form>
    );
}
