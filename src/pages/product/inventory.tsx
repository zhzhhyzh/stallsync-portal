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

    InputGroup,
    Stack,
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
import {
    numberWithCommas,
    parseThousandsToNumber,
    numberPattern,
} from "@app/utils/StringUtils";
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
import { getmanageProductR } from "@app/redux/inventory/slice";
import useFetchProductRDetail from "@app/hooks/selector/useFetchProductRDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { manageTranCode } from "@app/redux/tranCode/api";
import { InventorySchema } from "@app/components/forms/@schemas/inventorySchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { string } from "yup";


export default function InventoryForm(props: any) {
    const { sendRequest, loading } = useApi({ title: "Inventory Management" });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = String(router.query.id);
    const mode = String(router.query.mode);
    const prduid = String(router.query.prduid);

    const [detailData] = useFetchProductRDetail(id);

    const initialValues = {
        psprduid: "",
        psstkuid: "",
        psinvven: null,
        psinvsty: "I",
        psinvqty: null,
        psinvsdt: null,
        psinvpri: null,

    };


    const [ddlData] = useFetchDDL({ code: ["STKTYP"] });



    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: InventorySchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    useEffect(() => {
        if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
            formik.setValues({
                ...detailData,
                id: detailData.psprduid,
                psinvsdt: dayjs(detailData?.psinvsdt),
            });
        }
    }, [detailData]);

    async function onSubmit(data: any) {


        const { success } = await sendRequest({
            fn: getmanageProductR({
                id: mode === "EDIT" ? data.id : "",...data,
                psprduid: prduid,
                psinvsdt: formik.values.psinvsdt ? formik.values.psinvsdt : new Date(),
                
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

    return (
        <form onSubmit={formik.handleSubmit}>
            <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
                <Flex direction={"column"} alignSelf={"center"}>
                    <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                        Inventory Management
                    </Text>
                    <Breadcrumbs breadcrumbItems={[
                        {
                            title: "Inventory Management",
                            href: `/tranCode`,// Add parameter if needed eg. /generalParameter/?id=123
                        },
                        {
                            title: "Inventory Management (" + mode + ")",
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
                            {(mode == "EDIT" || mode == 'VIEW') &&
                                (
                                    <FormControl
                                        id="psstkuid"
                                        isInvalid={Boolean(formik.errors.psstkuid) && Boolean(formik.touched.psstkuid)}
                                        isReadOnly={true}
                                    >
                                        {/* <FormLabel>Inventory Management*</FormLabel> */}
                                        <CustomFormLabel labelText="Invoice Id" />
                                        <Input
                                            placeholder={"Enter Invoice Id"}
                                            type="text"
                                            name="psstkuid"
                                            onChange={formik.handleChange}
                                            value={prduid}
                                            isDisabled={mode === "EDIT"}
                                        />
                                        {formik.errors.psstkuid && (
                                            <FormErrorMessage>{formik.errors.psstkuid}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                )}
                            <FormControl
                                id="psprduid"
                                isInvalid={Boolean(formik.errors.psprduid) && Boolean(formik.touched.psprduid)}
                                isReadOnly={true}
                            >
                                {/* <FormLabel>Inventory Management*</FormLabel> */}
                                <CustomFormLabel labelText="Product Id" />
                                <Input
                                    placeholder={"Enter Product Id"}
                                    type="text"
                                    name="psprduid"
                                    onChange={formik.handleChange}
                                    value={formik.values.psprduid || prduid}
                                    isDisabled={mode === "EDIT"}
                                />
                                {formik.errors.psprduid && (
                                    <FormErrorMessage>{formik.errors.psprduid}</FormErrorMessage>
                                )}
                            </FormControl>

                            <FormControl
                                id="psinvven"
                                isInvalid={Boolean(formik.errors.psinvven) && Boolean(formik.touched.psinvven)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                {/* <FormLabel>Description*</FormLabel> */}
                                <CustomFormLabel labelText="Vendor Name" />
                                <Input
                                    placeholder={"Enter Vendor Name"}
                                    type="text"
                                    name="psinvven"
                                    onChange={formik.handleChange}
                                    value={formik.values.psinvven || ""}
                                />
                                {formik.errors.psinvven && (
                                    <FormErrorMessage>{formik.errors.psinvven}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="psinvpri"
                                isInvalid={Boolean(formik.errors.psinvpri) && Boolean(formik.touched.psinvpri)}
                                isReadOnly={mode == "VIEW" ? true : false}
                            >
                                {

                                    <CustomFormLabel labelText="Stock Price" />
                                }

                                <Stack spacing={4}>
                                    <InputGroup>

                                        <Input
                                            type="text"
                                            name="psinvpri"
                                            placeholder="Enter Minimum Amount"
                                            value={numberWithCommas(formik.values.psinvpri)}
                                            pattern={numberPattern}
                                            onChange={(event) => {
                                                const value = event.target.value;

                                                // Check if the value is a valid number or empty
                                                if (!value || /^[0-9.,]*$/.test(value)) {
                                                    formik.handleChange({
                                                        target: {
                                                            value: parseThousandsToNumber(value),
                                                            name: "psinvpri",
                                                        },
                                                    });
                                                }
                                            }}
                                            onBlur={formik.handleBlur}
                                        />
                                    </InputGroup>
                                </Stack>
                                {formik.errors.psinvpri && (
                                    <FormErrorMessage>{formik.errors.psinvpri}</FormErrorMessage>
                                )}
                            </FormControl>
                         


                        </Box>


                        <Box display="flex" flexDir="column" gap={6} width="100%">
   <FormControl
                                id="psinvsty"
                                isInvalid={Boolean(formik.errors.psinvsty) && Boolean(formik.touched.psinvsty)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                {/* <FormLabel>Debit/Credit*</FormLabel> */}
                                <CustomFormLabel labelText="Stock In/Out" />
                                <Select
                                    placeholder="Select Stock In/Out"
                                    value={formik.values.psinvsty || "I"}
                                    onChange={formik.handleChange}
                                    style={{
                                        fontSize: 14,
                                    }}
                                    isDisabled
                                >
                                    {ddlData?.STKTYP?.map((option: DDL_TYPES) => ( //change code
                                        <option key={option.prgecode} value={option.prgecode}>
                                            {option.prgedesc}
                                        </option>
                                    ))}
                                </Select>
                                {formik.errors.psinvsty && (
                                    <FormErrorMessage>{formik.errors.psinvsty}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="psinvqty"
                                isInvalid={Boolean(formik.errors.psinvqty) && Boolean(formik.touched.psinvqty)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                {/* <FormLabel>Quantity</FormLabel> */}
                                <CustomFormLabel labelText="Quantity"/>
                                <Input
                                    placeholder={"Enter Quantity"}
                                    type="number"
                                    name="psinvqty"
                                    min="0"
                                    value={(formik.values.psinvqty || formik.values.psinvqty == 0) ? formik.values.psinvqty : ""}

                                    onChange={formik.handleChange}
                                />
                                {formik.errors.psinvqty && (
                                    <FormErrorMessage>{formik.errors.psinvqty}</FormErrorMessage>
                                )}
                            </FormControl>

                            <FormControl
                                id="psinvsdt"
                                isInvalid={
                                    Boolean(formik.errors.psinvsdt) &&
                                    Boolean(formik.touched.psinvsdt)
                                }
                            //    isReadOnly
                            >
                                <FormLabel>Stock Date</FormLabel>
                                <DatePicker disabled={mode === "VIEW"}
                                    format={"DD/MM/YYYY"}
                                    style={{ width: "100%" }}
                                    value={
                                        formik.values.psinvsdt
                                            ? dayjs(formik.values.psinvsdt)
                                            : dayjs(new Date())
                                    }
                                    onChange={(value) =>
                                        formik.handleChange({
                                            target: { value, name: "psinvsdt" },
                                        })
                                    }
                                    onBlur={formik.handleBlur}
                                // disabled={true}
                                />
                                {formik.errors.psinvsdt && (
                                    <FormErrorMessage>{formik.errors.psinvsdt}</FormErrorMessage>
                                )}
                            </FormControl>
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

