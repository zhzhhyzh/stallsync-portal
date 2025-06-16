// @ts-ignore  
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
    Switch,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    IconButton,
    HStack,
    Checkbox,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoAddSharp, IoChevronBack, IoCloseCircle, IoEye, IoSave, IoEyeOff } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import useFetchDDLProdcode from "@app/hooks/selector/useFetchDDLPrdcde"
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineCheckCircle, AiOutlineLeft } from "react-icons/ai";
import { PapparSchema } from "../@schemas/papparSchema";

import useFetchPapparDetail from "@app/hooks/selector/useFetchPapparDetail";
import { getManagePappar } from "@app/redux/pappar/slice";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function PapparForm(props: any) {
    const { sendRequest, loading } = useApi({ title: "Payment Allocation Priority Detail" });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = props.id;
    const psprdcde = props.psprdcde;
    const mode = props.mode;
    const [detailData] = useFetchPapparDetail(id);
    const [ddlData] = useFetchDDL({ code: ["PAPMTD", "PAPPRT", "PAPSQN"] });

    const initialValues = {
        id: id,
        psprdcde: "",
        pspapprt: "",
        pspapppm: "",
        pspappps: "",
        pspapitm: "",
        pspapits: "",
        pspapfem: "",
        pspapfes: "",
    };

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: PapparSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });
    const [dd1Data] = useFetchDDLProdcode(psprdcde);


    useEffect(() => {
        if (mode !== "ADD" && id) {
            if (Object.keys(detailData).length === 0) {
                formik.resetForm();
            }
            if (Object.keys(detailData).length > 0) {
                formik.setValues({
                    ...detailData,
                    id: detailData?.id,
                    psprdcde: detailData?.psprdcde,
                    pspapprt: detailData?.pspapprt,
                    pspapppm: detailData?.pspapppm,
                    pspappps: detailData?.pspappps,
                    pspapitm: detailData?.pspapitm,
                    pspapits: detailData?.pspapits,
                    pspapfem: detailData?.pspapfem,
                    pspapfes: detailData?.pspapfes,
                });
            }
        }
    }, [detailData]);

    async function onSubmit(data: any) {
        const { success } = await sendRequest({
            fn: mode === "ADD" ? getManagePappar(data) : getManagePappar({
                ...data,
                id: id,
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

    return (
        <form onSubmit={formik.handleSubmit}>

            <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>

                <Flex direction={"column"} alignSelf={"center"}>
                    <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                        Payment Allocation Priority Detail
                    </Text>
                    <Breadcrumbs breadcrumbItems={[
                        {
                            title: "Payment Allocation Priority",
                            href: `/pappar`,// Add parameter if needed eg. /generalParameter/?id=123
                        },
                        {
                            title: "Payment Allocation Priority (" + mode + ")",
                        },
                    ]} />
                </Flex>
                <Flex justifyContent="flex-end" pl={10} pr={5} pt={5} >
                    <Box>
                        <Space size="small">
                            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />

                            <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                        </Space>
                    </Box>
                </Flex>
                {/* <Box
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
        </Box> */}
            </Flex>
            <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
            >
                <Box>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            {/* <FormControl
                                id="psprdcde"
                                isInvalid={Boolean(formik.errors.psprdcde) && Boolean(formik.touched.psprdcde)}
                                isReadOnly={mode === "EDIT" && mode === "VIEW" ? true : false}
                            >
                                <FormLabel>Product Code*</FormLabel>
                                <Input
                                    placeholder={"Enter Product Code"}
                                    type="text"
                                    name="psprdcde"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.psprdcde}
                                    isDisabled={mode === "EDIT" && mode === "VIEW" ? true : false}
                                />
                                {formik.errors.psprdcde && (
                                    <FormErrorMessage>{formik.errors.psprdcde}</FormErrorMessage>
                                )}
                            </FormControl> */}
                            <FormControl
                                id="psprdcde"
                                style={{ width: "40%" }}
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.psprdcde) && Boolean(formik.touched.psprdcde)}
                                isReadOnly={mode === "VIEW" || mode === "EDIT" ? true : false}
                            >
                                <FormLabel>Product Code</FormLabel>
                                {/* <CustomFormLabel labelText="Product Code"/> */}
                                <Select
                                    placeholder={"Please select Product Code"}
                                    value={formik.values.psprdcde}
                                    onChange={formik.handleChange}

                                    isDisabled={mode === "VIEW" || mode === "EDIT" ? true : false}
                                >
                                    {Array.isArray(dd1Data) && dd1Data.length > 0 ? (
                                        dd1Data.map((option: any) => (
                                            <option key={option.psprdcde} value={option.psprdcde}>
                                                {option.psprdcde}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No options available</option>
                                    )}
                                </Select>
                                {formik.errors.psprdcde && (
                                    <FormErrorMessage>{formik.errors.psprdcde}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="pspapprt"
                                onChange={formik.handleChange}
                                style={{ width: "40%" }}

                                isInvalid={Boolean(formik.errors.pspapprt) && Boolean(formik.touched.pspapprt)}
                                isReadOnly={mode === "VIEW" || mode === "EDIT" ? true : false}

                            >
                                {/* <FormLabel>Priority Type*</FormLabel> */}
                                <CustomFormLabel labelText="Priority Type" />
                                <Select placeholder={"Please select Type"}
                                    value={formik.values.pspapprt}
                                    onChange={formik.handleChange}
                                    isDisabled={mode === "VIEW" || mode === "EDIT" ? true : false}

                                >
                                    {
                                        ddlData?.PAPPRT?.map((option: any) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))

                                    }
                                </Select>
                                {formik.errors.pspapprt && (
                                    <FormErrorMessage>{formik.errors.pspapprt}</FormErrorMessage>
                                )}
                            </FormControl>
                            {/* <FormControl
                                id="pspapppm"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.pspapppm) && Boolean(formik.touched.pspapppm)}
                                isReadOnly={mode === "VIEW" ? true : false}


                            >
                                <FormLabel>Principal Method</FormLabel>
                                <Select placeholder={"Please select Type"}
                                    value={formik.values.pspapppm}
                                    onChange={formik.handleChange}
                                    isDisabled={mode === "VIEW" ? true : false}

                                >
                                    {
                                        ddlData?.PAPMTD?.map((option: any) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))

                                    }
                                </Select>
                                {formik.errors.pspapppm && (
                                    <FormErrorMessage>{formik.errors.pspapppm}</FormErrorMessage>
                                )}
                            </FormControl> */}
                            {/* <FormControl
                                id="pspappps"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.pspappps) && Boolean(formik.touched.pspappps)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <FormLabel>Priority Sequence</FormLabel>
                                <Input
                                    type="text"
                                    name="pspappps"
                                    value={formik.values.pspappps}
                                    isDisabled={mode === "VIEW" ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.pspappps && (
                                    <FormErrorMessage>{formik.errors.pspappps}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="pspapitm"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.pspapitm) && Boolean(formik.touched.pspapitm)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <FormLabel>Interest Method</FormLabel>
                                <Select placeholder={"Please select Type"}
                                    value={formik.values.pspapitm}
                                    onChange={formik.handleChange}
                                    isDisabled={mode === "VIEW" ? true : false}
                                >
                                    {
                                        ddlData?.PAPMTD?.map((option: any) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))

                                    }
                                </Select>
                                {formik.errors.pspapitm && (
                                    <FormErrorMessage>{formik.errors.pspapitm}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="pspapits"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.pspapits) && Boolean(formik.touched.pspapits)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <FormLabel>Interest Sequence</FormLabel>
                                <Input
                                    type="text"
                                    name="pspapits"
                                    value={formik.values.pspapits}
                                    isDisabled={mode === "VIEW" ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.pspapits && (
                                    <FormErrorMessage>{formik.errors.pspapits}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="pspapfem"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.pspapfem) && Boolean(formik.touched.pspapfem)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <FormLabel>Fee Method</FormLabel>
                                <Select placeholder={"Please select Type"}
                                    value={formik.values.pspapfem}
                                    isDisabled={mode === "VIEW" ? true : false}
                                    onChange={formik.handleChange}
                                >
                                    {
                                        ddlData?.PAPMTD?.map((option: any) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))

                                    }
                                </Select>
                                {formik.errors.pspapfem && (
                                    <FormErrorMessage>{formik.errors.pspapfem}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="pspapfes"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.pspapfes) && Boolean(formik.touched.pspapfes)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <FormLabel>Fee Sequence</FormLabel>
                                <Input
                                    type="text"
                                    name="pspapfes"
                                    value={formik.values.pspapfes}
                                    isDisabled={mode === "VIEW" ? true : false}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.pspapfes && (
                                    <FormErrorMessage>{formik.errors.pspapfes}</FormErrorMessage>
                                )}
                            </FormControl> */}
                            {/* <Box> */}
                            <Box display="flex" flexDir="column" gap={0} width="50%">

                                {/* PRINCIPLE */}
                                <Box alignItems="center" display="flex" flexDir="row" gap={"25%"} width="70%">
                                    {/* <div className="flex flex-col sm:flex-row gap-6"> */}

                                    <FormLabel flex={1} fontSize="xl" fontWeight="normal" mb={1}></FormLabel>
                                    <FormLabel flex={1} fontSize="xl" fontWeight="normal" mb={1} style={{ whiteSpace: 'nowrap' }}>
                                        Priority Sequence
                                    </FormLabel>
                                    <FormLabel flex={1} fontSize="xl" fontWeight="normal" mb={1}>
                                        Methods
                                    </FormLabel>
                                    {/* </div> */}
                                </Box>
                                <Box display="flex" flexDir="column" gap={5} width="100%">

                                    <Box alignItems="center" display="flex" flexDir="row" gap={6} width="80%">
                                        {/* <div className="flex flex-col sm:flex-row gap-6"> */}

                                        <FormLabel textAlign="center" py="10px" pl="10px" fontSize="xl" fontWeight="normal" mb={1}>
                                            PRINCIPLE
                                        </FormLabel>
                                        <Box flex={1}>
                                            <FormControl
                                                id="pspappps"
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.pspappps) && Boolean(formik.touched.pspappps)}
                                                isReadOnly={mode === "VIEW" ? true : false}
                                            >
                                                <Input
                                                    type="text"
                                                    name="pspappps"
                                                    value={formik.values.pspappps}
                                                    isDisabled={mode === "VIEW" ? true : false}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.errors.pspappps && <FormErrorMessage>{formik.errors.pspappps}</FormErrorMessage>}
                                            </FormControl>
                                        </Box>
                                        <Box flex={1}>
                                            <FormControl
                                                id="pspapppm"
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.pspapppm) && Boolean(formik.touched.pspapppm)}
                                                isReadOnly={mode === "VIEW" ? true : false}
                                            >
                                                <Select
                                                    placeholder="Please select Type"
                                                    value={formik.values.pspapppm}
                                                    onChange={formik.handleChange}
                                                    isDisabled={mode === "VIEW" ? true : false}
                                                >
                                                    {ddlData?.PAPMTD?.map((option: any) => (
                                                        <option key={option.prgecode} value={option.prgecode}>
                                                            {option.prgedesc}
                                                        </option>
                                                    ))}
                                                </Select>
                                                {formik.errors.pspapppm && <FormErrorMessage>{formik.errors.pspapppm}</FormErrorMessage>}
                                            </FormControl>
                                        </Box>
                                        {/* </div> */}
                                    </Box>

                                    {/* INTEREST */}
                                    <Box alignItems="center" display="flex" flexDir="row" gap={6} width="80%">
                                        {/* <div className="flex flex-col sm:flex-row gap-6"> */}
                                        <FormLabel py="10px" pr={"7px"} textAlign="center" pl="10px" fontSize="xl" fontWeight="normal" mb={1}>
                                            INTEREST
                                        </FormLabel>
                                        <Box flex={1}>
                                            <FormControl
                                                id="pspapits"
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.pspapits) && Boolean(formik.touched.pspapits)}
                                                isReadOnly={mode === "VIEW" ? true : false}
                                            >
                                                <Input
                                                    type="text"
                                                    name="pspapits"
                                                    value={formik.values.pspapits}
                                                    isDisabled={mode === "VIEW" ? true : false}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.errors.pspapits && <FormErrorMessage>{formik.errors.pspapits}</FormErrorMessage>}
                                            </FormControl>
                                        </Box>
                                        <Box flex={1}>
                                            <FormControl
                                                id="pspapitm"
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.pspapitm) && Boolean(formik.touched.pspapitm)}
                                                isReadOnly={mode === "VIEW" ? true : false}
                                            >
                                                <Select
                                                    placeholder="Please select Type"
                                                    value={formik.values.pspapitm}
                                                    onChange={formik.handleChange}
                                                    isDisabled={mode === "VIEW" ? true : false}
                                                >
                                                    {ddlData?.PAPMTD?.map((option: any) => (
                                                        <option key={option.prgecode} value={option.prgecode}>
                                                            {option.prgedesc}
                                                        </option>
                                                    ))}
                                                </Select>
                                                {formik.errors.pspapitm && <FormErrorMessage>{formik.errors.pspapitm}</FormErrorMessage>}
                                            </FormControl>
                                        </Box>
                                        {/* </div> */}
                                    </Box>

                                    {/* FEE */}
                                    <Box alignItems="center" display="flex" flexDir="row" gap={6} width="80%">
                                        {/* <div className="flex flex-col sm:flex-row gap-6"> */}
                                        <FormLabel py="10px" pr={"45px"} textAlign="center" pl="10px" fontSize="xl" fontWeight="normal" mb={1}>
                                            FEE
                                        </FormLabel>
                                        <Box flex={1}>
                                            <FormControl
                                                id="pspapfes"
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.pspapfes) && Boolean(formik.touched.pspapfes)}
                                                isReadOnly={mode === "VIEW" ? true : false}
                                            >
                                                <Input
                                                    type="text"
                                                    name="pspapfes"
                                                    value={formik.values.pspapfes}
                                                    isDisabled={mode === "VIEW" ? true : false}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.errors.pspapfes && <FormErrorMessage>{formik.errors.pspapfes}</FormErrorMessage>}
                                            </FormControl>
                                        </Box>
                                        <Box flex={1}>
                                            <FormControl
                                                id="pspapfem"
                                                onChange={formik.handleChange}
                                                isInvalid={Boolean(formik.errors.pspapfem) && Boolean(formik.touched.pspapfem)}
                                                isReadOnly={mode === "VIEW" ? true : false}
                                            >
                                                <Select
                                                    placeholder="Please select Type"
                                                    value={formik.values.pspapfem}
                                                    onChange={formik.handleChange}
                                                    isDisabled={mode === "VIEW" ? true : false}
                                                >
                                                    {ddlData?.PAPMTD?.map((option: any) => (
                                                        <option key={option.prgecode} value={option.prgecode}>
                                                            {option.prgedesc}
                                                        </option>
                                                    ))}
                                                </Select>
                                                {formik.errors.pspapfem && <FormErrorMessage>{formik.errors.pspapfem}</FormErrorMessage>}
                                            </FormControl>
                                        </Box>
                                        {/* </div> */}

                                    </Box>
                                </Box>
                            </Box>

                         
                            {/* </div> */}
                            {/* </Box> */}
                        </Box>


                    </div>
                </Box>
            </Card>
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
