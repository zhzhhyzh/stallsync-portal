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
import { fetchActActList, getRemoveActAct } from "@app/redux/queue/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";

import useFetchActActs from "@app/hooks/selector/useFetchActAct";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function ActActPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sendRequest, loading } = useApi({ title: "Activity Action Parameter" });
    const homeData = useAppSelector(selectHome);
    const [ddlData] = useFetchDDL({
        code: ["ACTCDE"]
    })
    const [ddlData1] = useFetchDDL({
        code: ["CASESTS"]
    })
    const [ddlData2] = useFetchDDL({
        code: ["ACTIND"]
    })
    //sample code how to use this hook
    // const practcod = String(router.query?.practcod);
    const id = String(router.query?.id);
    const practcod = String(router.query?.practcod);
    const QueueID = String(router.query?.QueueID);
    const actID = String(router.query?.actID);
    const file = String(router.query?.file);
    const prquedesc = String(router.query?.prquedesc);
    const practdesc = String(router.query?.practdesc);
    const [tableData, refreshFn, totalRecords, extra] = useFetchActActs({ practcod: practcod });
    //pass tableData to table
    // const [pageSize, setPageSize] = useState(10);
    // const [page, setPage] = useState(1);

    const [search, setSearch] = useState();
    const [status, setStatus] = useState();
    const [curCas, setCurCas] = useState();
    const [actInd, setActInd] = useState();

console.log("action code=====",id);
    const columns: any[] = [
        {
            title: "Action Code",
            dataIndex: "practncd",
            key: "practncd",
            render: (_: any, record: any) => {
                // <Text>{record.practncd}-{record.practncddsc}</Text>
                const combinedValue = `${record.practncd}-${record.practncddsc}`;
                return <span>{combinedValue}</span>;
            }
        },
        {
            title: "Current Status",
            dataIndex: "practsts",
            key: "practsts",
            render: (_: any, record: any) => {
                const combinedValue = `${record.practsts}-${record.practstsdsc}`;
                return <span>{combinedValue}</span>;
            }
            // <Text>{record.practsts}-{record.practstsdsc}</Text>
            // )
        },
        {
            title: "Next Status",
            dataIndex: "practnts",
            key: "practnts",
            render: (_: any, record: any) => {
                // console.log(record)
                const combinedValue = `${record.practnts}-${record.practntsdsc}`;
                return <span>{combinedValue}</span>;
            }
            // (
            //     <Text>{record.practnts}-{record.practntsdsc}</Text>
            // )
        },
        {
            title: "Action Indicator",
            dataIndex: "practind",
            key: "practind",
            // render: (_: any, record: any) => (
            //     <Text>{record.practinddsc}</Text>
            // )

            render: (_: any, record: any) => {
                const combinedValue = `${record.practind} - ${record.practinddsc}`;
                return <span>{combinedValue}</span>;
            }
        },

        {
            title: "ACTIONS",
            key: "action",
            align: "center",
            width: "10rem",
            render: (_: any, record: any) => (
                <Flex justifyContent="flex-end">
                    <Space size="small">
                        {
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACTACT_VIEW)) && (
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
                        }{
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACTACT_EDIT)) && (
                                <Tooltip label='Edit' fontSize='sm'>
                                    <IconButton
                                        variant="outline"
                                        size={"sm"}
                                        borderRadius={2}
                                        colorScheme="blue"
                                        sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                                        icon={<BsPencil />}
                                        aria-label={"edit"}
                                        onClick={() => goEdit(record?.id)}
                                    />
                                </Tooltip>
                            )
                        }
                        {
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.ACTACT_DEL)) && (
                                <Tooltip label='Delete' fontSize='sm'>
                                    <IconButton
                                        variant="outline"
                                        size={"sm"}
                                        borderRadius={2}
                                        colorScheme="red"
                                        sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                                        icon={<IoTrash />}
                                        aria-label={"delete"}
                                        onClick={() => alertRemove(record?.practncd, record?.practncddsc)}
                                    />
                                </Tooltip>
                            )
                        }

                        <TableMenu
                            menus={[
                                {
                                    url: `/maintLogs`,
                                    query: {
                                        id: record?.practncd + "-" + record?.practycde,
                                        file: extra.file,
                                    },
                                    label: "Maint Log",
                                    breadcrumbRoute: [
                                        {
                                            title: "Activity Action Parameter",
                                            href: `/queues/activity/actAct/?id=${id}`,// Add parameter if needed eg. /generalParameter/?id=123
                                        },
                                        {
                                            title: "Maintenance Log",
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

    function alertRemove(id: string, desc: string) {
        dispatch(
            openGlobalModal({
                title: "Delete Record",
                message: RemoveDetail(id, desc),
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
            fn: getRemoveActAct({ id }),
        });

        if (success) {
            dispatch(refreshTable())
            setTimeout(() => {
                showModal(dispatch, {
                    title: "Delete record",
                    message: "Record Deleted",
                });
                router.push({
                    pathname: "/queues/activity/actAct",
                    query: {
                        id: id,
                    },
                });
            }, 200);
        }
    }

    function goAdd() {
        router.push({
            pathname: "/queues/activity/actAct/Detail",
            query: {
                // id: "",
                id: "",
                actID: actID,
                practcod: practcod,
                QueueID: QueueID,
                prquedesc,
                practdesc,
                file,
                mode: "ADD"
            },
        });
    }

    function goEdit(id: string) {
        router.push({
            pathname: "/queues/activity/actAct/Detail",
            query: {
                id: id,
                actID: actID,
                practcod: practcod,
                QueueID: QueueID,
                prquedesc,
                practdesc,
                file,
                mode: "EDIT"
            },
        });
    }

    function goView(id: string) {
        router.push({
            pathname: "/queues/activity/actAct/Detail",
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

    function curCasOnchange(event: any) {
        setCurCas(event.target.value);
    }
    function actIndOnchange(event: any) {
        setActInd(event.target.value);
    }

    return (
        <>
            <Box>
                <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
                    <Flex direction={"column"} alignSelf={"center"}>
                        <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                            Activity Action Parameter
                        </Text>
                        <Breadcrumbs breadcrumbItems={[
                            {
                                title: "Queue Code Parameter",
                                href: "/queues",
                            },
                            {
                                title: "Queue Activity Parameter",
                                href: `/queues/activity/?QueueID=${QueueID}&id=&prquedesc=${prquedesc}`,
                            },
                            {
                                title: "Activity Action Parameter"
                            }
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
                                buttonDefaultType={"ADD"} onclick={() => goAdd()}
                            />


                        </Space>

                    </Box>
                </Flex>
                <Card p={1} mt={4}>
                    <Flex bgColor="#fff" justifyContent={"space-between"} p={3} direction={"column"}>
                        {/* <Box>
                            <Text fontSize={"sm"} fontWeight={"600"}>Queue Code : {QueueID} - {prquedesc}</Text>
                            <Text fontSize={"sm"} fontWeight={"600"} paddingBottom={5}>Activity Code : {practcod} - {practdesc}</Text>
                        </Box> */}

                        <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text fontSize={"sm"} fontWeight={"600"} style={{ width: '120px', textAlign: 'left' }}>{`Queue Code`}</Text>
                            <Text fontSize={"sm"} fontWeight={"600"}>{` : ${QueueID} - ${prquedesc}`}</Text>
                        </Box>
                        <Box style={{ display: 'flex', flexDirection: 'row' }} paddingBottom={5}>
                            <Text fontSize={"sm"} fontWeight={"600"} style={{ width: '120px', textAlign: 'left' }}>{`Activity Code`}</Text>
                            <Text fontSize={"sm"} fontWeight={"600"}>{` : ${practcod} - ${practdesc}`}</Text>
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
                                {/* <Select
                                    name="status"
                                    onChange={statusOnchange}
                                    placeholder="Please Select Action Code"
                                    value={status}
                                >
                                    {ddlData?.ACTCDE?.map((option: DDL_TYPES) => (
                                        <option key={option.prgecode} value={option.prgecode}>
                                            {option.prgedesc}
                                        </option>

                                    ))}
                                </Select> */}
                                <Select
                                    name="curCas"
                                    onChange={curCasOnchange}
                                    placeholder="Please Select Current Case"
                                    value={curCas}
                                >
                                    {ddlData1?.CASESTS?.map((option: DDL_TYPES) => (
                                        <option key={option.prgecode} value={option.prgecode}>
                                            {option.prgedesc}
                                        </option>

                                    ))}
                                </Select>
                                <Select
                                    name="actInd"
                                    onChange={actIndOnchange}
                                    placeholder="Please Select Activity Indicator"
                                    value={actInd}
                                >
                                    {ddlData2?.ACTIND?.map((option: DDL_TYPES) => (
                                        <option key={option.prgecode} value={option.prgecode}>
                                            {option.prgedesc}
                                        </option>

                                    ))}
                                </Select>
                            </Space>
                        </Box>
                    </Flex>
                    {practcod !== "undefined" && < Table
                        columns={columns}
                        data={tableData}
                        refreshFn={fetchActActList}
                        totalRecords={totalRecords}
                        extraParams={{
                            practcod: practcod,
                            search: search,
                            curCas,
                            actInd
                        }}
                    />}
                </Card>
            </Box>
        </>
    );
}

const RemoveDetail = (item: string, itemDesc: string) => {
    return (
        <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
            {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
            <Text p={3}>Are you sure to delete this record?</Text>
            <Text>{item} - {itemDesc}</Text>
        </Box>
    )
};
