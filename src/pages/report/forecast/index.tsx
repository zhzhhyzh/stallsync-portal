import { useRouter } from "next/router";
import useFetchForecasts from "@app/hooks/selector/useFetchForecasts";
import { useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { DatePicker, Space, Tag, } from "antd";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Spacing from "@app/constants/Spacing";
import {
    DownloadOutlined,
    ExportOutlined,
    FileOutlined
} from '@ant-design/icons';
const { Dragger } = Upload;
import { message, Upload, Typography, UploadFile } from 'antd';

import {
    Spinner,
    Text,
    Box,
    useColorModeValue,
    Flex,
    Stat, Button, Divider,
    StatLabel,
    StatNumber, Image, Tooltip as JTooltip
} from "@chakra-ui/react";
import Card from "@app/components/common/Card/Card";
import CardBody from "@app/components/common/Card/CardBody";
import IconBox from "@app/components/Icons/IconBox";
import { BsStars } from "react-icons/bs";
import SubHeader from "@app/components/common/Header/SubHeader";
import React, { useState } from "react";
import useApi from "@app/hooks/useApi";
import { download } from "@app/redux/app/slice";

export default function ForecastPage() {
    const router = useRouter();
    const { prrptnme = "", prrptfcs = "N", prrptfco = "N" } = router.query;

    const [sales, fetchInit, order, loading2] = useFetchForecasts(
        String(prrptnme),
        String(prrptfcs),
        String(prrptfco)
    ) as [any, () => Promise<void>, any, boolean];
    const dummyReq = async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    };
    useEffect(() => {
        if (prrptnme && (prrptfcs === "Y" || prrptfco === "Y")) {
            fetchInit();
        }
    }, [prrptnme, prrptfcs, prrptfco]);
    const [selectedOrd, setSelectedOrd] = useState<UploadFile<any>[]
    >([]);
    const [selectedSls, setSelectedSls] = useState<UploadFile<any>[]
    >([]);
    const { sendRequest, loading } = useApi({ title: "Merchant" });
    function genDocumentUrl(filename: string, type?: string) {
        const hostname = process.env.NEXT_PUBLIC_API_URL;
        // const nowTs = new Date().getTime();

        return hostname + `/document/detail?type=${type || ""}&document=${filename}`
    }
    useEffect(() => {
        if (sales?.slsFcImg) {
            setSelectedSls([
                {
                    uid: sales.slsFcImg,
                    name: sales?.slsFcImg,
                    status: "done",
                    fileStatus: "old",
                    url: genDocumentUrl(sales.slsFcImg, "7"),
                    thumbUrl: genDocumentUrl(sales.slsFcImg, "7"),
                },
            ])
        }
    }, [sales])

    useEffect(() => {
        if (order?.ordFcImg) {
            setSelectedOrd([
                {
                    uid: order.ordFcImg,
                    name: order.ordFcImg,
                    status: "done",
                    fileStatus: "old",
                    url: genDocumentUrl(order.ordFcImg, "7"),
                    thumbUrl: genDocumentUrl(order.ordFcImg, "7"),
                },
            ])
        }
    }, [sales])
    // Color values from .env
    const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#C2A76D";
    const secondaryColor = process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#E23FB4";
    const darkCardColor = process.env.NEXT_PUBLIC_SIDEBAR_COLOR || "rgb(22,23,44)";
    const whiteIcon = useColorModeValue("whiteAlpha.300", "whiteAlpha.300");

    async function handleDownload(filename: string, type: number) {
        await sendRequest({
            fn: download({
                filename,
                type,
            }),

        });
    }

    return (



        <>
            <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
                <Flex direction={"column"} alignSelf={"center"}>
                    <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                        Forecast Visualization
                    </Text>

                    <Breadcrumbs breadcrumbItems={[
                        {
                            title: "Forecast Visualization",
                            href: `/tranCode`,// Add parameter if needed eg. /generalParameter/?id=123
                        },
                        {
                            title: "Forecast Visualization ( VIEW )",
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

                    </Space>
                </Box>
            </Flex>
            <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
            >
                <Box>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-6">

                            <Box display="flex" flexDir="column" gap={6} width="100%">
                                {prrptfcs === "Y" && (
                                    <Card flex={1} minW="350px" bg={darkCardColor} borderRadius="xl" p={4} boxShadow="md">

                                        <CardBody position="relative">
                                            <Stat w="100%">
                                                {/* <StatLabel color="white" fontSize="md" textTransform="uppercase" mb={2}>
                                                    Sales Forecast (Next 30 Days)
                                                </StatLabel> */}
                                                <SubHeader labelText="Sales Forecast (Next 30 Days)" />
                                                <StatNumber fontSize="xl" color="white" mb={4}>in RM</StatNumber>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={sales?.slsFcValue || []}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="value" fill={primaryColor} name="Sales" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Stat>
                                            <IconBox
                                                as="box"
                                                h="100px"
                                                w="100px"
                                                bg={darkCardColor}
                                                zIndex="-1"
                                                style={{ position: "absolute", top: 5, right: 0 }}
                                            >
                                                <BsStars size={72} color={whiteIcon} />
                                            </IconBox>
                                        </CardBody>
                                        <div>
                                            <Dragger
                                                name="file"
                                                style={{ marginBottom: 10, maxHeight: 1 }}
                                                disabled
                                                fileList={selectedSls ? selectedSls : undefined}
                                                customRequest={dummyReq}
                                                itemRender={(originNode, file, fileList, action) => {
                                                    const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);


                                                    return (
                                                        <Space
                                                            direction="horizontal"
                                                            style={{
                                                                backgroundColor: "white",
                                                                width: "100%",
                                                                minHeight: "60px",
                                                                maxHeight: "60px",
                                                                paddingTop: 10,
                                                                paddingLeft: 10,
                                                                paddingRight: 10,
                                                                paddingBottom: 5,
                                                                borderRadius: 10,
                                                                borderWidth: 1,
                                                                borderColor: "lightgray",
                                                                justifyContent: "space-between",
                                                                marginBottom: 5,
                                                            }}
                                                        >
                                                            <Space size={"middle"}>
                                                                {file.thumbUrl && isImage ? (
                                                                    <Image maxHeight={10} maxWidth={20} src={file.thumbUrl} />
                                                                ) : (
                                                                    <FileOutlined
                                                                        style={{
                                                                            marginBottom: "7px",
                                                                            width: "60px",
                                                                            color: "gray",
                                                                        }}
                                                                    // rev={undefined}
                                                                    />
                                                                )}


                                                                <Typography
                                                                    style={{
                                                                        alignSelf: "flex-start",
                                                                        alignContent: "flex-start",
                                                                        alignItems: "flex-start",
                                                                    }}
                                                                >
                                                                    {file.name}
                                                                </Typography>
                                                            </Space>
                                                            <Space style={{ alignSelf: "flex-end" }} size={"small"}>
                                                                {fileList.filter(
                                                                    (item: any) =>
                                                                        item.uid === file.uid && item.fileStatus === "old"
                                                                ).length > 0 && (
                                                                        <JTooltip title="Download">
                                                                            <DownloadOutlined
                                                                                // rev={undefined}
                                                                                style={{
                                                                                    color: "gray",
                                                                                    fontSize: 14,
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center",
                                                                                    cursor: "pointer",
                                                                                    marginBottom: "6px",
                                                                                }}
                                                                                onClick={() => handleDownload(file?.uid, 4)}
                                                                            />
                                                                        </JTooltip>
                                                                    )}
                                                                <JTooltip title="Preview">
                                                                    <ExportOutlined
                                                                        style={{
                                                                            color: "gray",
                                                                            fontSize: 14,
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            cursor: "pointer",
                                                                            marginBottom: "6px",
                                                                        }}
                                                                        onClick={() => window.open(file?.url, "_blank")}
                                                                    // rev={undefined}
                                                                    />
                                                                </JTooltip>



                                                            </Space>
                                                        </Space>
                                                    );
                                                }}
                                            >

                                            </Dragger>
                                        </div>
                                    </Card>
                                )}
                            </Box>


                            <Box display="flex" flexDir="column" gap={6} width="100%">
                                {prrptfco === "Y" && (

                                    <Card flex={1} minW="350px" bg={darkCardColor} borderRadius="xl" p={4} boxShadow="md">
                                        <CardBody position="relative">
                                            <Stat w="100%">
                                                {/* <StatLabel color="white" fontSize="md" textTransform="uppercase" mb={2}>
                                                    Order Count Forecast (Next 30 Days)
                                                </StatLabel> */}
                                                {/* <SubHeader labelText="Order Counts Forecast (Next 30 Days)" /> */}
                                                <Flex alignItems={"center"} flexDirection={"row"} mb={"20px"}>
                                                    <Divider orientation='vertical' height={"15px"}
                                                        borderWidth="2px" borderColor="#689f77" mr={2} opacity={"100%"} />

                                                    <Text fontSize="15pt" fontWeight={"500"} color={"#689f77"}>
                                                        Order Counts Forecast (Next 30 Days)
                                                    </Text>
                                                </Flex>
                                                <StatNumber fontSize="xl" color="white" mb={4}>in Count</StatNumber>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={order?.ordFcValue || []}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="value" fill={secondaryColor} name="Orders" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Stat>
                                            <IconBox
                                                as="box"
                                                h="100px"
                                                w="100px"
                                                bg={darkCardColor}
                                                zIndex="-1"
                                                style={{ position: "absolute", top: 5, right: 0 }}
                                            >
                                                <BsStars size={72} color={whiteIcon} />
                                            </IconBox>
                                        </CardBody>
                                        <div>
                                            <Dragger
                                                name="file"
                                                style={{ marginBottom: 10, maxHeight: 1 }}
                                                disabled
                                                fileList={selectedOrd ? selectedOrd : undefined}
                                                customRequest={dummyReq}
                                                itemRender={(originNode, file, fileList, action) => {
                                                    const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);


                                                    return (
                                                        <Space
                                                            direction="horizontal"
                                                            style={{
                                                                backgroundColor: "white",
                                                                width: "100%",
                                                                minHeight: "60px",
                                                                maxHeight: "60px",
                                                                paddingTop: 10,
                                                                paddingLeft: 10,
                                                                paddingRight: 10,
                                                                paddingBottom: 5,
                                                                borderRadius: 10,
                                                                borderWidth: 1,
                                                                borderColor: "lightgray",
                                                                justifyContent: "space-between",
                                                                marginBottom: 5,
                                                            }}
                                                        >
                                                            <Space size={"middle"}>
                                                                {file.thumbUrl && isImage ? (
                                                                    <Image maxHeight={10} maxWidth={20} src={file.thumbUrl} />
                                                                ) : (
                                                                    <FileOutlined
                                                                        style={{
                                                                            marginBottom: "7px",
                                                                            width: "60px",
                                                                            color: "gray",
                                                                        }}
                                                                    // rev={undefined}
                                                                    />
                                                                )}


                                                                <Typography
                                                                    style={{
                                                                        alignSelf: "flex-start",
                                                                        alignContent: "flex-start",
                                                                        alignItems: "flex-start",
                                                                    }}
                                                                >
                                                                    {file.name}
                                                                </Typography>
                                                            </Space>
                                                            <Space style={{ alignSelf: "flex-end" }} size={"small"}>
                                                                {fileList.filter(
                                                                    (item: any) =>
                                                                        item.uid === file.uid && item.fileStatus === "old"
                                                                ).length > 0 && (
                                                                        <JTooltip title="Download">
                                                                            <DownloadOutlined
                                                                                // rev={undefined}
                                                                                style={{
                                                                                    color: "gray",
                                                                                    fontSize: 14,
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center",
                                                                                    cursor: "pointer",
                                                                                    marginBottom: "6px",
                                                                                }}
                                                                                onClick={() => handleDownload(file?.uid, 4)}
                                                                            />
                                                                        </JTooltip>
                                                                    )}
                                                                <JTooltip title="Preview">
                                                                    <ExportOutlined
                                                                        style={{
                                                                            color: "gray",
                                                                            fontSize: 14,
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            cursor: "pointer",
                                                                            marginBottom: "6px",
                                                                        }}
                                                                        onClick={() => window.open(file?.url, "_blank")}
                                                                    // rev={undefined}
                                                                    />
                                                                </JTooltip>



                                                            </Space>
                                                        </Space>
                                                    );
                                                }}
                                            >

                                            </Dragger>
                                        </div>
                                    </Card>

                                )}
                            </Box>








                        </div>
                    )}


                </Box>
            </Card>
            <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
                <Box>
                    <Space size="small">
                        <Buttons
                            buttonDefaultType={"BACK"} onclick={() => router.back()}
                        />

                    </Space>
                </Box>
            </Flex>
        </>
    );
}
