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

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineCheckCircle, AiOutlineLeft } from "react-icons/ai";
import { activitySchema } from "../@schemas/activitySchema";

import useFetchActivityDetail from "@app/hooks/selector/useFetchActivityDetail";
import useFetchQueueDetail from "@app/hooks/selector/useFetchQueueDetail";
import useFetchDDLActWrkGrp from "@app/hooks/selector/useFetchDDLActWrkGrp";

import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { getManageAct } from "@app/redux/queue/slice";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function ActForm(props: any) {
    const { sendRequest, loading } = useApi({ title: "Queue Activity Parameter" });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = props.id;
    // const QueueID = String(props.QueueID)
    const QueueID = String(router.query?.QueueID);
    let prquedesc = String(router.query?.prquedesc);
    prquedesc= prquedesc.replace(/ /g, '+');
    const mode = props.mode;

    const [detailData] = useFetchActivityDetail(id);
    const [detailDataQueue] = useFetchQueueDetail(QueueID);
    const [ddlData] = useFetchDDL({ code: ["SLA"] });
    const [ddlData1] = useFetchDDL({ code: ["ASGMTD"] });
    const [ddlUserGroup] = useFetchDDLActWrkGrp();

    const initialValues = {
        id: id,
        practcod: "",
        practdesc: "",
        practldsc: "",
        praslafq: "",
        praslafc: "",
        prquecde: mode === "ADD" ? QueueID : "",
        prquedsc: mode === "ADD" ? detailDataQueue.prquedesc : "",
        prwrkcde: "",
        prasgmtd: "",
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: activitySchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    useEffect(() => {
        if (mode !== "ADD" && id) {
            if (Object.keys(detailData).length === 0) formik.resetForm();
            if (Object.keys(detailData).length > 0) {
                formik.setValues({
                    ...detailData,
                    id: detailData?.id,
                    // prquedsc: detailDataQueue.prquedesc
                });
            }
        }
        //  else {
        //     formik.setValues({
        //         ...detailData,
        //         prquecde: detailDataQueue.prquecod,
        //         prquedsc: detailDataQueue.prquedesc,
        //     })
        // }
    }, [detailData]);

    async function onSubmit(data: any) {
        // console.log(data, "data hereeeeeeeee");
        const { success } = await sendRequest({
            fn: mode === "ADD" ? getManageAct(data) : getManageAct({
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
                        Queue Activity Parameter
                    </Text>
                    <Breadcrumbs breadcrumbItems={[
                        {
                            title: "Queue Code Parameter",
                            href: "/queues"
                        },
                        {
                            title: "Queue Activity Parameter",
                            href: `/queues/activity/?QueueID=${QueueID}&id=&prquedesc=${prquedesc}`,// Add parameter if needed eg. /generalParameter/?id=123
                        },
                        {
                            title: "Queue Activity Parameter(" + mode + ")",
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
                        <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
                        {
                            mode && mode !== "VIEW" && (
                                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
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
                                id="prquecde"
                                isInvalid={Boolean(formik.errors.prquecde) && Boolean(formik.touched.prquecde) || Boolean(formik.errors.prquedsc) && Boolean(formik.touched.prquedsc)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                <FormLabel>Queue Code</FormLabel>
                                <Input
                                    placeholder={"Enter Queue Code"}
                                    type="text"
                                    name="prquecde"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    // value={formik.values.prquecde}
                                    value={`${formik.values.prquecde} - ${formik.values.prquedsc}`}

                                    isDisabled

                                />
                                {/* {formik.errors.prquecde && (
                                    <FormErrorMessage>{formik.errors.prquecde}</FormErrorMessage>
                                )} */}
                            </FormControl>
                            <FormControl
                                id="practcod"
                                isInvalid={Boolean(formik.errors.practcod) && Boolean(formik.touched.practcod)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                {/* <FormLabel>Activity Code</FormLabel> */}
                                <CustomFormLabel labelText="Activity Code" />

                                <Input
                                    placeholder={"Enter Activity Code"}
                                    type="text"
                                    name="practcod"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.practcod}
                                    isDisabled={mode === "EDIT" ? true : false}

                                />
                                {formik.errors.practcod && (
                                    <FormErrorMessage>{formik.errors.practcod}</FormErrorMessage>
                                )}
                            </FormControl>


                            <FormControl
                                id="practdesc"
                                isInvalid={Boolean(formik.errors.practdesc) && Boolean(formik.touched.practdesc)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                {/* <FormLabel>Activity Description*</FormLabel> */}
                                <CustomFormLabel labelText="Activity Description" />
                                <Input
                                    placeholder={"Enter Activity Description"}
                                    type="text"
                                    name="practdesc"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.practdesc}

                                />
                                {formik.errors.practdesc && (
                                    <FormErrorMessage>{formik.errors.practdesc}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="practldsc"
                                isInvalid={Boolean(formik.errors.practldsc) && Boolean(formik.touched.practldsc)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                <FormLabel>Local Description</FormLabel>
                                <Input
                                    placeholder={"Enter Local Description"}
                                    type="text"
                                    name="practldsc"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.practldsc}

                                />
                                {formik.errors.practldsc && (
                                    <FormErrorMessage>{formik.errors.practldsc}</FormErrorMessage>
                                )}
                            </FormControl>

                        </Box>
                        <Box display="flex" flexDir="column" gap={6} width="100%">
                            <FormControl
                                id="prwrkcde"
                                isInvalid={Boolean(formik.errors.prwrkcde) && Boolean(formik.touched.prwrkcde)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                <CustomFormLabel labelText="Activity Workgroup" />
                                {/* <Input
                                    placeholder={"Enter Workgroup Code"}
                                    type="text"
                                    name="prwrkcde"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.prwrkcde}
                                    // isReadOnly={mode === "VIEW" ? true : false}
                                    isDisabled={mode === "EDIT" ? true : false}
                                /> */}
                                <Select
                                    name="prwrkcde"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Please Select Activity Worksgroup"
                                    // defaultValue={formik.values.pscompln}
                                    //   disabled={mode === "ADD" ? false : true}
                                    value={formik.values.prwrkcde}
                                    style={{
                                        fontSize: 14,
                                    }}
                                >
                                    {Array.isArray(ddlUserGroup) &&
                                        ddlUserGroup.map((option: any) => (
                                            <option key={option.prwrkcde} value={option.prwrkcde}>
                                                {option.prwrkdsc}
                                            </option>
                                        ))}

                                </Select>
                                {formik.errors.prwrkcde && (
                                    <FormErrorMessage>{formik.errors.prwrkcde}</FormErrorMessage>
                                )}
                            </FormControl>


                            <FormControl
                                id="praslafq"
                                isInvalid={Boolean(formik.errors.praslafq) && Boolean(formik.touched.praslafq)}
                                isReadOnly={mode === "VIEW" ? true : false}
                            >
                                <FormLabel>SLA Frequency</FormLabel>
                                <Input
                                    placeholder={"Enter SLA Frequency"}
                                    type="number"
                                    name="praslafq"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.praslafq}
                                />
                                {formik.errors.praslafq && (
                                    <FormErrorMessage>{formik.errors.praslafq}</FormErrorMessage>
                                )}
                            </FormControl>


                            <FormControl
                                id="praslafc"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.praslafc) && Boolean(formik.touched.praslafc)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <FormLabel>SLA Frequency Code</FormLabel>
                                <Select placeholder={"Please select Type"}
                                    value={formik.values.praslafc}
                                    onChange={formik.handleChange}
                                >
                                    {
                                        ddlData?.SLA?.map((option: any) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))

                                    }
                                </Select>
                                {formik.errors.praslafc && (
                                    <FormErrorMessage>{formik.errors.praslafc}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl
                                id="prasgmtd"
                                onChange={formik.handleChange}
                                isInvalid={Boolean(formik.errors.prasgmtd) && Boolean(formik.touched.prasgmtd)}
                                isReadOnly={mode === "VIEW" ? true : false}

                            >
                                <CustomFormLabel labelText="Assignment Method" />

                                <Select placeholder={"Please select Type"}
                                    value={formik.values.prasgmtd}
                                    onChange={formik.handleChange}
                                >
                                    {
                                        ddlData1?.ASGMTD?.map((option: DDL_TYPES) => (
                                            <option key={option.prgecode} value={option.prgecode}>
                                                {option.prgedesc}
                                            </option>
                                        ))

                                    }
                                </Select>

                                {formik.errors.prasgmtd && (
                                    <FormErrorMessage>{formik.errors.prasgmtd}</FormErrorMessage>
                                )}
                            </FormControl>
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
