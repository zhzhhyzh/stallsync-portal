// Chakra imports
import Colors from "@app/constants/Colors";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Input,
    Heading,
    Button,
    Select,
    Link,
    Icon,
    Tooltip,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsEye, BsPencil } from "react-icons/bs";
import { fetchActList, getRemoveAct } from "@app/redux/queue/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";

import useFetchActs from "@app/hooks/selector/useFetchActivity";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function ActivityPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sendRequest, loading } = useApi({ title: "Queue Activity Parameter" });
    const homeData = useAppSelector(selectHome);
    const [ddlData] = useFetchDDL({
        code: ["SLA"]
    })
    const [ddlData1] = useFetchDDL({
        code: ["ASGMTD"]
    })
    //sample code how to use this hook
    const id = String(router.query?.id);
    const QueueID = String(router.query?.QueueID);
    const practcod = String(router.query?.practcod);
    const prquedesc = String(router.query?.prquedesc);

    const [tableData, refreshFn, totalRecords, extra] = useFetchActs({ prquecde: QueueID});

    //pass tableData to table
    // const [pageSize, setPageSize] = useState(10);
    // const [page, setPage] = useState(1);

    const [search, setSearch] = useState();
    const [status, setStatus] = useState();
    const [prasgmtd, setPrasgmtd] = useState()

    const columns: any[] = [
        {
            title: "Activity Code",
            dataIndex: "practcod",
            key: "practcod",
            render: (_: any, record: any) => {
                // console.log(record)
                const combinedValue = `${record.practcod} - ${record.practdesc}`;
                return <span>{combinedValue}</span>;
            }
        },

        {
            title: "SLA - Frequency",
            dataIndex: "praslafq",
            key: "praslafq",
            render: (_: any, record: any) => {
                const combinedValue = `${record.praslafq} - ${record.praslafcdsc}`;
                return <span>{combinedValue}</span>;
            }
        }, {
            title: "Activity User Workgroup",
            dataIndex: "prwrkcde",
            key: "prwrkcde",
            render: (_: any, record: any) => {
                const combinedValue = `${record.prwrkcde} - ${record.prwrkdsc}`;
                return <span>{combinedValue}</span>;
            }
        },
        {
            title: "Assignment method",
            dataIndex: "prasgmtd",
            key: "prasgmtd",
            render: (_: any, record: any) => (
                <>{record.prasgmtd} - {record.prasgmtddsc}</>
            )
        },
        {
            title: "ACTIONS",
            key: "action",
            align: "center",
            width: "10rem",
            render: (_: any, record: any) => (
                <Flex justifyContent="flex-end">
                    <Space size="small">
                        {/* {
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACTVTY_VIEW)) && (
                                <Tooltip label='View' fontSize='sm'>
                                    <IconButton
                                        variant="outline"
                                        size={"sm"}
                                        borderRadius={2}
                                        colorScheme="blue"
                                        sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                                        icon={<BsEye />}
                                        aria-label={"view"}
                                        onClick={() => goView(record?.id)}
                                    />
                                </Tooltip>
                            )
                        } */}
                        {
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACTVTY_EDIT)) && (
                                <Tooltip label='Edit' fontSize='sm'>
                                    <IconButton
                                        variant="outline"
                                        size={"sm"}
                                        borderRadius={2}
                                        colorScheme="blue"
                                        sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                                        icon={<BsPencil />}
                                        aria-label={"edit"}
                                        onClick={() => goEdit(record?.id, id, prquedesc)}
                                    />
                                </Tooltip>
                            )
                        }
                        {
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACTVTY_DEL)) && (
                                <Tooltip label='Delete' fontSize='sm'>
                                    <IconButton
                                        variant="outline"
                                        size={"sm"}
                                        borderRadius={2}
                                        colorScheme="red"
                                        sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                                        icon={<IoTrash />}
                                        aria-label={"delete"}
                                        onClick={() => alertRemove(record?.id, record?.practcod)}
                                    />
                                </Tooltip>
                            )
                        }

                        <TableMenu
                            menus={[
                                {
                                    url: `/maintLogs`,
                                    query: {
                                        id: record?.practcod + "-" + record?.prquecde,
                                        file: extra.file,
                                    },
                                    label: "Maint Log",
                                    breadcrumbRoute: [
                                        {
                                            title: "Queue Code Parameter",
                                            href: `/queues`,// Add parameter if needed eg. /generalParameter/?id=123
                                        },
                                        {
                                            title: "Activity Parameter",
                                            href: `/queues/activity/?id=${QueueID}`,// Add parameter if needed eg. /generalParameter/?id=123
                                        },
                                        {
                                            title: "Maintenance Log",
                                        },
                                    ]
                                },
                                {
                                    url: `/queues/activity/actChkl`,
                                    query: {
                                        actID: record?.id,
                                        practcod: record?.practcod,
                                        prquedesc: prquedesc,
                                        practdesc: record?.practdesc,
                                        QueueID: QueueID,
                                        id: "",
                                        file: extra.file,
                                    },
                                    label: "Checklist",
                                    breadcrumbRoute: [
                                        {
                                            title: "Checklist",
                                            href: `/queues/activity/actChkl/?actID=${record?.id}&?practcod=${practcod}&?QueueID=${QueueID}`,// Add parameter if needed eg. /generalParameter/?id=123
                                        },
                                        {
                                            title: "Checklist",
                                        },
                                    ]
                                },
                                {
                                    url: `/queues/activity/actAct`,
                                    query: {
                                        actID: record?.id,
                                        practcod: record?.practcod,
                                        prquedesc: prquedesc,
                                        practdesc: record?.practdesc,
                                        QueueID,
                                        id: "",
                                        file: extra.file,
                                    },
                                    label: "Action",
                                    breadcrumbRoute: [
                                        {
                                            title: "Action",
                                            href: `actAct/?id=${QueueID}&?actID=${record?.id}&?practcod=${practcod}&?QueueID=${QueueID}`,// Add parameter if needed eg. /generalParameter/?id=123
                                        },
                                        {
                                            title: "Action",
                                        },
                                    ]
                                },
                            ]}
                        />
                    </Space>
                </Flex>
            ),
        },
    ];

    function alertRemove(id: string, practcod: string) {
        dispatch(
            openGlobalModal({
                title: "Delete Record",
                message: RemoveDetail(id, practcod),
                status: "warning",
                actions: [
                    {
                        title: "Confirm",
                        onClick: () => onRemove(id),
                    },
                    {
                        title: "Cancel",
                        isClose: true,
                        props: {
                            variant: "danger",
                        },
                    },

                ],
            })
        );
    }

    async function onRemove(id: string) {
        const { success } = await sendRequest({
            fn: getRemoveAct({ id: id }),
        });

        if (success) {
            dispatch(refreshTable())
            setTimeout(() => {
                showModal(dispatch, {
                    title: "Delete Record",
                    message: "Record Deleted",
                });
                router.push({
                    pathname: "/queues/activity",
                    query: {
                        id: "",
                        QueueID,
                        prquedesc,
                    },
                });
            }, 200);
        }
    }

    function goAdd(id: string, prquedesc: string) {
        router.push({
            pathname: "activity/Detail",
            query: {
                id: "",
                QueueID: id,
                prquedesc,
                // prquedesc: prquedesc,
                mode: "ADD"
            },
        });
    }

    function goEdit(id: string, QueueID : string, prquedesc: string) {
        router.push({
            pathname: "activity/Detail",
            query: {
                id: id,
                QueueID,
                prquedesc,
                // practcod: id,
                mode: "EDIT"
            },
        });
    }

    function goView(id: string) {
        router.push({
            pathname: "activity/Detail",
            query: {
                id: id,
                mode: "VIEW"
            },
        });
    }


    function searchOnChange(event: any) {
        setSearch(event.target.value);
    }
    function statusOnchange(event: any) {
        setStatus(event.target.value);
    }
    function prasgmtdOnChange(event: any) {
        setPrasgmtd(event.target.value);
    }
    return (
        <>
            <Box>
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

                            <Buttons
                                buttonDefaultType={"ADD"} onclick={() => goAdd(QueueID, prquedesc)}
                            />


                        </Space>

                    </Box>
                </Flex>
                <Card p={1} mt={4}>
                    <Flex bgColor="#fff" justifyContent={"space-between"} p={3} direction={"column"}>
                        <Box>
                            <Text fontSize={"sm"} fontWeight={"600"} paddingBottom={5}>Queue Code : {id} - {prquedesc}</Text>
                        </Box>
                        <Box
                            pr={{
                                base: 0,
                                md: Spacing.containerPx,
                            }}
                            display="flex"
                        >
                            <Space size="middle">
                                <Input
                                    type="text"
                                    name="search"
                                    onChange={searchOnChange}
                                    placeholder="Search"
                                    value={search}
                                />
                                <Select
                                    name="prasgmtd"
                                    onChange={prasgmtdOnChange}
                                    placeholder="Please Select Assignment Method"
                                    value={prasgmtd}
                                >
                                    {ddlData1?.ASGMTD?.map((option: DDL_TYPES) => (
                                        <option key={option.prgecode} value={option.prgecode}>
                                            {option.prgedesc}
                                        </option>

                                    ))}
                                </Select>
                                {/* <Select
                                    name="status"
                                    onChange={statusOnchange}
                                    placeholder="Please Select Frequency"
                                    value={status}
                                >
                                    {ddlData?.SLA?.map((option: DDL_TYPES) => (
                                        <option key={option.prgecode} value={option.prgecode}>
                                            {option.prgedesc}
                                        </option>

                                    ))}
                                </Select> */}
                            </Space>
                        </Box>
                    </Flex>
                    {/* MUST CHECK UNDEFINED */}
                    {id !== "undefined" && <Table
                        columns={columns}
                        data={tableData}
                        refreshFn={fetchActList}
                        totalRecords={totalRecords}
                        extraParams={{
                            search,
                            prquecde: QueueID,
                            praslafc: status,
                            prasgmtd,
                        }}
                    />}
                </Card>
            </Box>
        </>
    );
}

const RemoveDetail = (item: string, item2: string) => {
    return (
        <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
            {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
            <Text p={3}>Are you sure to delete this record?</Text>
            <Text>{item} - {item2}</Text>
        </Box>
    )
};
