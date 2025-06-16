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
import React, { ChangeEventHandler, useEffect, useState, CSSProperties } from "react";

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
import { fetchPappar, getRemovePappar } from "@app/redux/pappar/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";

import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import useFetchPappars from "@app/hooks/selector/useFetchPappars";

export default function PapparPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sendRequest, loading } = useApi({ title: "Payment Allocation Priority Parameter" });
    const homeData = useAppSelector(selectHome);
    // const [PAPMTD] = useFetchDDL({
    //     code: ["PAPMTD"]
    // }) 
    // const [PAPPRT] = useFetchDDL({
    //     code: ["PAPPRT"]
    // }) 
    // const [PAPSQN] = useFetchDDL({
    //     code: ["PAPSQN"]
    // })
    //sample code how to use this hook
    const [tableData, refreshFn, totalRecords, extra] = useFetchPappars();

    //pass tableData to table
    // const [pageSize, setPageSize] = useState(10);
    // const [page, setPage] = useState(1);

    const [search, setSearch] = useState();
    const [status, setStatus] = useState();

    const customHeaderCellStyle: CSSProperties = {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        marginRight: 60
    };

    const customDataCellStyle: CSSProperties = {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginLeft: 12,
    };


    const columns: any[] = [
        {
            title: "PRODUCT CODE",
            dataIndex: "psprdcde",
            key: "psprdcde",
        },
        {
            title: "PRIORITY TYPE",
            dataIndex: "pspapprtdsc",
            key: "pspapprtdsc",
        },
        {
            title: (
                <div style={{ textAlign: "left" }}>
                    <div style={{ paddingLeft: '40px' }}>PRINCIPAL</div>
                    <div>
                        <span style={{ paddingLeft: '0px' }}>PRIO SEQ</span>
                        <span style={{ paddingLeft: '25px' }}>METHOD</span>
                    </div>
                </div>
            ),
            dataIndex: "pspapfes",
            key: "pspapfes",
            render: (_: any, record: any) => {
                return (
                    <div style={{ textAlign: "left" }}>
                        <div>
                            <span style={{ paddingLeft: '30px' }}>{record.pspapppsdsc}</span>
                            <span style={{ paddingLeft: '55px' }}>{record.pspapppmdsc}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ textAlign: "left" }}>
                    <div style={{ paddingLeft: '40px' }}>INTEREST</div>
                    <div>
                        <span style={{ paddingLeft: '0px' }}>PRIO SEQ</span>
                        <span style={{ paddingLeft: '25px' }}>METHOD</span>
                    </div>
                </div>
            ),
            dataIndex: "pspapfes",
            key: "pspapfes",
            render: (_: any, record: any) => {
                return (
                    <div style={{ textAlign: "left" }}>
                        <div>
                            <span style={{ paddingLeft: '30px' }}>{record.pspapitsdsc}</span>
                            <span style={{ paddingLeft: '55px' }}>{record.pspapitmdsc}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ textAlign: "left" }}>
                    <div style={{ paddingLeft: '60px' }}>FEE</div>
                    <div>
                        <span style={{ paddingLeft: '0px' }}>PRIO SEQ</span>
                        <span style={{ paddingLeft: '25px' }}>METHOD</span>
                    </div>
                </div>
            ),
            dataIndex: "pspapfes",
            key: "pspapfes",
            render: (_: any, record: any) => {
                return (
                    <div style={{ textAlign: "left" }}>
                        <div>
                            <span style={{ paddingLeft: '30px' }}>{record.pspapfesdsc}</span>
                            <span style={{ paddingLeft: '55px' }}>{record.pspapfemdsc}</span>
                        </div>
                    </div>
                );
            }
        },

        {
            title: <div style={customHeaderCellStyle}>ACTIONS</div>,
            key: "action",
            align: "center",
            width: "10rem",
            render: (_: any, record: any) => (
                <div style={customDataCellStyle}>
                    <Space size="small">
                        {/* {
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PAPPAR_VIEW)) && (
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
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PAPPAR_EDIT)) && (
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
                            (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PAPPAR_DEL)) && (
                                <Tooltip label='Delete' fontSize='sm'>
                                    <IconButton
                                        variant="outline"
                                        size={"sm"}
                                        borderRadius={2}
                                        colorScheme="red"
                                        sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                                        icon={<IoTrash />}
                                        aria-label={"delete"}
                                        onClick={() => alertRemove(record?.psprdcde, record?.pspapprtdsc,record?.pspapprt)}
                                    />
                                </Tooltip>
                            )
                        }

                        <TableMenu
                            menus={[
                                {
                                    url: `/maintLogs`,
                                    query: {
                                        id: record?.psprdcde + " - " + record?.pspapprt,
                                        file: extra.file,
                                    },
                                    label: "Maint Log",
                                    breadcrumbRoute: [
                                        {
                                            title: "Payment Allocation Priority Parameters",
                                            href: `/pappar`,// Add parameter if needed eg. /generalParameter/?id=123
                                        },
                                        {
                                            title: "Maintenance Log",
                                        },
                                    ]
                                },

                            ]}
                        />
                    </Space>
                </div>
            ),
        },
    ];

    function alertRemove(id: string, desc: string, decsORI: string) {
        dispatch(
            openGlobalModal({
                title: "Delete record",
                message: RemoveDetail(id, desc),
                status: "warning",
                actions: [
                    {
                        title: "Confirm",
                        onClick: () => onRemove(id, decsORI),
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

    async function onRemove(id: string, desc: string) {
        const { success } = await sendRequest({
            fn: getRemovePappar({ id, desc }),
        });

        if (success) {
            dispatch(refreshTable())
            setTimeout(() => {
                showModal(dispatch, {
                    title: "Delete Record",
                    message: "Record deleted",
                });
            }, 200);
        }
    }

    function goAdd() {
        router.push({
            pathname: "/pappar/Detail",
            query: {
                id: "",
                mode: "ADD"
            },
        });
    }

    function goEdit(id: string) {
        router.push({
            pathname: "/pappar/Detail",
            query: {
                id: id,
                mode: "EDIT"
            },
        });
    }

    function goView(id: string) {
        router.push({
            pathname: "/pappar/Detail",
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
    return (
        <>
            <Box>
                <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
                    <Flex direction={"column"} alignSelf={"center"}>
                        <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                            Payment Allocation Priority
                        </Text>
                        <Breadcrumbs breadcrumbItems={[
                            {
                                title: "Payment Allocation Priority"
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
                                buttonDefaultType={"ADD"} onclick={() => goAdd()}
                            />


                        </Space>

                    </Box>
                </Flex>
                <Card p={1} mt={4}>
                    <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
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
                            </Space>
                        </Box>
                    </Flex>
                    <Table
                        columns={columns}
                        data={tableData}
                        refreshFn={fetchPappar}
                        totalRecords={totalRecords}
                        extraParams={{
                            search: search,
                            // prslafcde: status,
                            // type: status,    
                        }}
                    />
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
