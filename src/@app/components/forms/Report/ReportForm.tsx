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
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { manageAdmin } from "@app/redux/adminAccounts/slice";
import useFetchAdminAccountsDetail from "@app/hooks/selector/useFetchAdminAccountsDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { ReportSchema } from "@app/components/forms/@schemas/ReportSchema";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import { fetchGenerateReport, fetchReports } from "@app/redux/reports/slice";
import Buttons from "@app/components/common/Buttons/Buttons";
import { IoIosRefresh } from "react-icons/io";


export default function ReportForm(props: any) {
    const { sendRequest, loading } = useApi({ title: "Reporting" });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = props.id;
    const mode = props.mode;

    const [ddlData] = useFetchDDL({ code: ["RPTDATE"] });


    const initialValues = {
        from: null,
        to: null,
        from2: null,
        to2: null,
        type: "",
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
            fn: fetchGenerateReport({ ...data }),
            formik,
        });
        if (success) {
            reload()

        } else {
            setTimeout(() => {
                showModal(dispatch, {
                    title: "Record Not Enough",
                    message: "Need to have at least 100 of transactions",
                });

            }, 200);
        }
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

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
            >
                <Box>
                    <Flex
                        direction={{ base: "column", sm: "row" }}
                        justify="space-between"
                        align="flex-start"
                        gap={6}
                        width="100%"
                    >
                        {/* Left: Date Range Select Form */}
                        <FormControl
                            id="type"
                            maxW="sm"
                            flex="1"
                            isInvalid={Boolean(formik.errors.type) && Boolean(formik.touched.type)}
                            isReadOnly={mode === "VIEW"}
                        >
                            <CustomFormLabel labelText="Date Range Type" />
                            <Select
                                placeholder="Select Date Range Type"
                                value={formik.values.type || ""}
                                onChange={formik.handleChange}
                                style={{ fontSize: 14 }}
                            >
                                {ddlData?.RPTDATE?.map((option: DDL_TYPES) => (
                                    <option key={option.prgecode} value={option.prgecode}>
                                        {option.prgedesc}
                                    </option>
                                ))}
                            </Select>
                            {formik.errors.type && (
                                <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
                            )}
                        </FormControl>

                        {/* Right: Button group */}
                        <Flex pt={5} justify="flex-end" flexShrink={0}>
                            <Space size="small">
                                <Buttons
                                    leftIcon={<IoIosRefresh />}
                                    bgColor={Colors.PRIMARY}
                                    buttonDefaultType="CUSTOM"
                                    onclick={reload}
                                    buttonText="Refresh"
                                />
                                <Buttons
                                    leftIcon={<IoSave />}
                                    bgColor={Colors.SUCCESS}
                                    buttonDefaultType="CUSTOM"
                                    type="submit"
                                    isLoading={loading}
                                    buttonText="Generate"
                                />
                            </Space>
                        </Flex>
                    </Flex>


                </Box>
            </Card>
        </form>
    );
}
