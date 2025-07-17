// Chakra imports
import Colors from "@app/constants/Colors";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'
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
    CardBody,
    Card, Spinner
} from "@chakra-ui/react";
import Buttons from "@app/components/common/Buttons/Buttons";
import Image from "next/image";
import { genDocumentUrl } from "@app/helpers/commonHelper";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";


import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import useFetchAnnouncements from "@app/hooks/selector/useFetchAnnouncements";
import { getremoveAnnouncement, list } from "@app/redux/announcement/slice";
import { formatDate } from "@app/utils/DateUtils";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import { AiFillEye } from "react-icons/ai";
import useFetchAnnouncementDetail from "@app/hooks/selector/useFetchAnnouncementDetail";
import { setTextRange } from "typescript";

export default function AnnouncementCard() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { sendRequest } = useApi({ title: "Announcement" });
    const homeData = useAppSelector(selectHome);


    const { isOpen, onOpen, onClose } = useDisclosure();
    //sample code how to use this hook
    const [tableData, refreshFn, totalRecords, extra] = useFetchAnnouncements({status: 'Y'});
    //pass tableData to table
    // const [pageSize, setPageSize] = useState(10);
    // const [page, setPage] = useState(1);

    const [search, setSearch] = useState();

    const columns: any[] = [
        // {
        //     title: "Announcement Code",
        //     dataIndex: "psanncde",
        //     key: "psanncde",
        // },
        {
            title: "Date",
            dataIndex: "psanndat",
            key: "psanndat"
        },

        {
            title: "Announcement Titles",
            dataIndex: "psannttl",
            key: "psannttl",
        },
        // {
        //     title: "Message",
        //     dataIndex: "content",
        //     key: "content",
        //     render: (text: string) => (
        //         <div style={{ maxWidth: "400px", overflowWrap: "break-word", whiteSpace: 'normal' }}>
        //             {text}
        //         </div>
        //     ),
        // },
        {
            title: "Actions",
            key: "action",
            align: "center",
            width: "10rem",
            render: (_: any, record: any) => (
                <Flex justifyContent="flex-end">
                    <Space size="small">
                        <Tooltip label="View" fontSize="sm">
                            <IconButton
                                variant="outline"
                                size={"sm"}
                                borderRadius={2}
                                colorScheme="green"
                                sx={{
                                    _hover: {
                                        backgroundColor: Colors.SUCCESS,
                                        color: Colors.BACKGROUND,
                                    },
                                }}
                                icon={<AiFillEye />}
                                aria-label={"view"}

                                onClick={() => goView(record?.id)}
                            />
                        </Tooltip>



                    </Space>
                </Flex>
            ),
        },
       




    ];
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string>("");

    const [selectedAnnouncementFile, setSelectedAnnouncementFile] = useState<
        {
            uid: string;
            name: string;
            status: string;
            fileStatus: string;
            url: string;
            thumbUrl: string;
            preview: string;
        }[]
    >([]);

    let { data: detailData, loading, refetch } = useFetchAnnouncementDetail(selectedId);
    const [temp, setTemp] = useState(false);
    const goView = (id: string) => {
        setSelectedId(id)
        setTemp(!temp);

    };
    useEffect(() => {
        if (selectedId != "") {
            try {
                detailData = refetch();
                console.log(detailData)
                setViewModalOpen(true);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        }
    }, [temp])
    useEffect(() => {
        console.log("viewModalOpen changed to:", viewModalOpen);
    }, [viewModalOpen]);
    useEffect(() => {
        if (detailData) {
            if (detailData?.psannimg) {
                const fileUrl = genDocumentUrl(detailData?.psannimg, "6");
                // const fileUrl = detailData?.document_link;

                setSelectedAnnouncementFile([
                    {
                        uid: detailData.psannimg,
                        name: detailData.originalName,
                        status: "done",
                        fileStatus: "old",
                        url: fileUrl,
                        thumbUrl: fileUrl,
                        preview: fileUrl,
                    },
                ]);

            } else {
                setSelectedAnnouncementFile([]);
            }
        }
    }, [detailData]);





    function alertRemove(id: string, desc: string) {

        dispatch(
            openGlobalModal({
                title: "Delete Record",
                message: RemoveDetail(id, desc),
                status: "warning",
                actions: [
                    {
                        title: "Confirm",
                        onClick: () => {
                            onRemove(id);
                        },

                    },
                    {
                        title: "Cancel",
                        isClose: true,
                    },
                ],
            })
        );
    }

    async function onRemove(id: string) {
        const { success } = await sendRequest({
            fn: getremoveAnnouncement({ id }),
        });

        if (success) {
            dispatch(refreshTable())
            setTimeout(() => {
                showModal(dispatch, {
                    title: "Delete Record",
                    message: "Record Deleted",
                });
            }, 200);
        }
    }


    return (
        <>
            {loading ? (
                <Spinner />
            ) : (

                <>
                    <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)}>
                        <ModalOverlay />
                        <ModalContent paddingBottom="50px">
                            <ModalHeader></ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text mb={3}> <span style={{fontWeight:"bold"}} >Title:</span><span> {detailData?.psannttl}</span></Text>
                              
                                <Text fontWeight="bold" mb={3}>Message:</Text>


                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <Text>{detailData?.psannmsg || "No content available."}</Text>
                                )}
                                {selectedAnnouncementFile.length > 0 && selectedAnnouncementFile[0]?.preview && (
                                    <img
                                        src={selectedAnnouncementFile[0].preview}
                                        alt={selectedAnnouncementFile[0].name}
                                        width={500}
                                        height={300}
                                        style={{ marginTop: "20px", borderRadius: "8px", objectFit: "contain" }}
                                    />
                                )}
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                </>)}
            <Card borderRadius={0} flex={1}>
                <CardBody w='full' h="100%" display="flex" flexDirection={"column"} alignItems="start" justifyContent="start">

                    <Text
                        mt="1px"
                        whiteSpace="nowrap"
                        textTransform="uppercase"
                        fontSize="16px"
                        color="black"
                        pl="5px"
                        fontWeight="medium"
                        pb=".3rem"
                    >
                        Announcement
                    </Text>
                    <Box mt={10} pl="5px"

                        w="100%" > {/* Adjust width to control table size */}

                        <Table
                            length={5}
                            columns={columns}
                            // data={ [
                            //     {
                            //         key: "1",
                            //         psanncde: "A001",
                            //         psannttl: "System Maintenance",
                            //         psanndat: "2024-11-01",
                            //         content: "Scheduled maintenance will occur from 12:00 AM to 6:00 AM to improve system performance."
                            //     },
                            //     {
                            //         key: "2",
                            //         psanncde: "A002",
                            //         psannttl: "New Feature Release",
                            //         psanndat: "2024-11-10",
                            //         content: "We are excited to announce a new feature that will enhance user experience."
                            //     },
                            //     {
                            //         key: "3",
                            //         psanncde: "A003",
                            //         psannttl: "Holiday Notice",
                            //         psanndat: "2024-12-25",
                            //         content: "Our office will be closed on December 25th in observance of the holiday."
                            //     },
                            //     {
                            //         key: "4",
                            //         psanncde: "A004",
                            //         psannttl: "Scheduled Downtime",
                            //         psanndat: "2025-01-05",
                            //         content: "Expect downtime from 1:00 AM to 3:00 AM for system upgrades."
                            //     },
                            //     {
                            //         key: "5",
                            //         psanncde: "A005",
                            //         psannttl: "Policy Update",
                            //         psanndat: "2025-02-14",
                            //         content: "A new policy on remote work has been implemented. Please review the policy document."
                            //     },
                            //     {
                            //         key: "6",
                            //         psanncde: "A006",
                            //         psannttl: "New Year Celebration",
                            //         psanndat: "2025-01-01",
                            //         content: "Join us in celebrating the New Year with refreshments in the lobby at 10:00 AM."
                            //     },
                            //     {
                            //         key: "7",
                            //         psanncde: "A007",
                            //         psannttl: "Employee Survey",
                            //         psanndat: "2025-02-10",
                            //         content: "We value your feedback. Please complete the annual employee survey by February 28th."
                            //     },
                            //     {
                            //         key: "8",
                            //         psanncde: "A008",
                            //         psannttl: "Annual General Meeting",
                            //         psanndat: "2025-03-15",
                            //         content: "The Annual General Meeting will be held at 9:00 AM in Conference Room A."
                            //     },
                            //     {
                            //         key: "9",
                            //         psanncde: "A009",
                            //         psannttl: "System Upgrade",
                            //         psanndat: "2025-04-20",
                            //         content: "A major system upgrade will take place. Some services may be temporarily unavailable."
                            //     },
                            //     {
                            //         key: "10",
                            //         psanncde: "A010",
                            //         psannttl: "COVID-19 Protocol Update",
                            //         psanndat: "2025-05-01",
                            //         content: "New COVID-19 protocols are in effect. Masks are now optional in common areas."
                            //     },
                            // ]

                            // }
                            data={tableData}
                            refreshFn={list}
                            totalRecords={tableData?.length}
                            extraParams={{
                                status:'Y'
                            }}
                        />
                    </Box>
                </CardBody>
            </Card>

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
