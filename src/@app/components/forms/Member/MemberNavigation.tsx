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
    Stack,
    Switch,
    InputGroup,
    InputRightElement,
    InputLeftElement,
    IconButton,
    RadioGroup,
    Radio,
    Textarea,
    color,
    Tabs,
    TabList,
    Tab,
    Image,
    Tooltip,
    Checkbox,
    CloseButton,
    Highlight,

} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties, ReactNode } from "react";

import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
    selectHome,
    closeGlobalModal,
    openGlobalModal,
    postBulkUploadFile,
} from "@app/redux/app/slice";
import type { DatePickerProps, UploadFile } from "antd";
import {
    AutoComplete,
    DatePicker,
    Form,
    Space,
    Tag,
    Upload,
    Typography,
    Select as AntdSelect,
} from "antd";
import dayjs from "dayjs";
// import {
//   numberWithCommas,
//   parseThousandsToNumber,
//   numberPattern,
// } from "@app/utils/StringUtils";
import {
    DownloadOutlined,
    FolderViewOutlined,
    DeleteOutlined,
    CloudUploadOutlined,
    FileOutlined,
    ExportOutlined,
} from "@ant-design/icons";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
// import { FormikConfig, FormikTouched } from 'formik';
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";

import {
    getApplicationDetail,
    getApproveApplication,
    getManageApplication,
} from "@app/redux/application/slice";

import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";
import {
    numberWithCommas,
    parseThousandsToNumber,
    numberPattern,
} from "@app/utils/StringUtils";
// import { RewardsPromoSchema } from "../@schemas/rewardsPromoSchema";
import { CalendarIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import PeopleImage from "@app/assets/img/people-image.png";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { manageApplication } from "@app/redux/application/api";
import { formatDate } from "@app/utils/DateUtils";
import MemberProfileForm from "./MemberProfileForm";
import MemberSales from "./MemberSales";
import AgentIncentive from "./AgentIncentive";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import MemberCommission from "./MemberCommission";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
// import useFetchDDLTier from "@app/hooks/selector/useFetchDDLTier";
// import useFetchDDLUser from "@app/hooks/selector/useFetchDDLUser";
// import useFetchDDLMembers from "@app/hooks/selector/useFetchDDLMembers";
// import useFetchDDLMembershipCodes from "@app/hooks/selector/useFetchDDLMembershipCodes";
const { Dragger } = Upload;
const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
};

const MemberNavigation = (props: any) => {
    const router = useRouter();
    const [headerInfo, setHeaderInfo] = useState<any>(null);
    const tabIndexx = String(router?.query.tabIndex);
    const dispatch = useAppDispatch();
    const id = props.id;
    let mode = props.mode;
    const { Option } = AutoComplete;
    const homeData = useAppSelector(selectHome);
    const [formik, setFormik] = useState<any>(null);
    const [loading, setLoading] = useState(false)
    const [detailData, setDetailData] = useState<any>(null);

    const filterOption = (inputValue: string, option: any) => {
        return option.value.includes(inputValue.trim());
    };

    // const handleSearch = (value: string) => {
    //   const filteredOptions = Array.isArray(membershipCodesData)?membershipCodesData.filter((item:MembershipCode) =>
    //     String(item.psuidnum).includes(value.toLowerCase())
    //   ):[]
    //   setMembershipCodes(filteredOptions);
    // };

    useEffect(() => {
        if (!props?.profile)
            setHeaderInfo({
                id: detailData?.psaplref,
                name: detailData?.psaplnme,
                start_date: detailData?.psmbrtad,
                recruited_by: detailData?.recruited_by,
                designation: detailData?.psmbrtypdsc,
                designation_date: detailData?.psmbrtad,
            })
    }, [detailData])

    useEffect(() => {
        if (props?.profile)
            setHeaderInfo({
                id: props?.profile?.psaplref,
                name: props?.profile?.psaplnme,
                start_date: props?.profile?.psmbrtad,
                recruited_by: props?.profile?.recruited_by,
                designation: props?.profile?.psmbrtypdsc,
                designation_date: props?.profile?.psmbrtad,
            })
    }, [props?.profile])
    useEffect(() => {
        if (tabIndexx == "3") {
            setTabIndexx(3)
        }
    }, [tabIndexx])

    const [membershipCodes, setMembershipCodes] = useState<any[]>([])
    const [tabIndex, setTabIndexx] = useState(0);

    // const [membershipCodesData] = useFetchDDLMembershipCodes();
    // const [tiers] = useFetchDDLTier();
    // const [users] = useFetchDDLMembers();

    const [memberSource, setMemberSource] = useState<any[]>([]);
    // const membershipCodesData: MembershipCode[] = [
    //   { psuidnum: 'ABC123', psuidrsv: true },
    //   { psuidnum: 'XYZ456', psuidrsv: false },
    //   { psuidnum: 'LMN789', psuidrsv: true },
    // ];

    // useEffect(() => {
    //   if(Array.isArray(membershipCodesData))
    //   setMembershipCodes(membershipCodesData)

    // }, [membershipCodesData])


    function goAdd(id: any) {
        router.push({
            pathname: `/member/incentive`,
            query: {
                id: "",
                memberId: id,
                tabIndex,
                mode: "ADD"
            },
        });
    }



    function convertDateToString(date: Date) {
        if (date instanceof Date && !isNaN(date.getTime()))
            return (
                date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
            );
        else return "";
    }
    function convertStringToDate(date: String) {
        if (date)
            return new Date(
                parseInt(date.split("-")[2]),
                parseInt(date.split("-")[1]) - 1,
                parseInt(date.split("-")[0])
            );
        else return null;
    } interface MembershipCode {
        psuidnum: string;
        psuidrsv: boolean;
    }

    async function handleDownload(filename: string, type: number) {
        // await sendRequest({
        //   fn: download({
        //     filename,
        //     type,
        //   }),
        // });
    }
    const [emailFile, setEmailFile] = useState<any[]>([]);
    const [selectedEmailFile, setSelectedEmailFile] = useState<UploadFile<any>[]>(
        []
    );
    const [emailFile2, setEmailFile2] = useState<any[]>([]);
    const [selectedEmailFile2, setSelectedEmailFile2] = useState<
        UploadFile<any>[]
    >([]);
    const handleFileUpload = ({ file }: { file: any }) => {
        if (file.type.split("/")[0] !== "image") {
            showModal(dispatch, {
                title: "File Upload",
                message: "Only image is accepted",
                status: "error",
            });
            return false;
        }

        if (file.size > 5242880) {
            showModal(dispatch, {
                title: "File Upload",
                message: "File size cannot be more than 5MB",
                status: "error",
            });
        } else {
            // formik.setErrors({})
            formik.setFieldValue("psaplpic", file?.name);
            //Multiple Upload
            setSelectedEmailFile((previousFile: any) => [
                // ...previousFile,
                {
                    uid: file?.name,
                    name: file?.name,
                    status: "done",
                    fileStatus: "new",
                    url: genThumbUrl(file.originFileObj),
                    thumbUrl: genThumbUrl(file.originFileObj),
                    preview: genThumbUrl(file.originFileObj),
                },
            ]);

            //Multiple Upload
            setEmailFile((previousFile: any) => [
                // ...previousFile,
                file.originFileObj,
            ]); //For multiple file
        }
        return false;
    };
    const handleFileUpload2 = ({ file }: { file: any }) => {
        if (file.type.split("/")[0] !== "image") {
            showModal(dispatch, {
                title: "File Upload",
                message: "Only image is accepted",
                status: "error",
            });
            return false;
        }

        if (file.size > 5242880) {
            showModal(dispatch, {
                title: "File Upload",
                message: "File size cannot be more than 5MB",
                status: "error",
            });
        } else {
            // formik.setErrors({})
            formik.setFieldValue("psspopic", file?.name);
            //Multiple Upload
            setSelectedEmailFile2((previousFile: any) => [
                // ...previousFile,
                {
                    uid: file?.name,
                    name: file?.name,
                    status: "done",
                    fileStatus: "new",
                    url: genThumbUrl(file.originFileObj),
                    thumbUrl: genThumbUrl(file.originFileObj),
                    preview: genThumbUrl(file.originFileObj),
                },
            ]);

            //Multiple Upload
            setEmailFile2((previousFile: any) => [
                // ...previousFile,
                file.originFileObj,
            ]); //For multiple file
        }
        return false;
    };
    const genThumbUrl = (file: any) => {
        return URL.createObjectURL(file);
    };
    const [ddlData] = useFetchDDL({
        code: [

            "CUSTTYPE",

            "IDTYPE",
            "ACADEMIC",
            "BANK",
            "STATE",
        ],
    });

    const handleRemove = (file: any) => {
        // Remove the file from the fileList state
        setSelectedEmailFile([]);
        formik.setFieldValue("psaplpic", null);

        //For multiple upload
        setEmailFile([]);
    };
    const handleRemove2 = (file: any) => {
        // Remove the file from the fileList state
        setSelectedEmailFile2([]);
        formik.setFieldValue("psspopic", null);

        //For multiple upload
        setEmailFile2([]);
    };



    function genDocumentUrl(filename: string, type?: string) {
        const hostname = process.env.NEXT_PUBLIC_API_URL;
        // const nowTs = new Date().getTime();

        return (
            hostname + `/document/detail?type=${type || ""}&document=${filename}`
        );
    }
      const [agents] = useFetchDDLAgent();
    
    function convertRecruit() {
        if (!Array.isArray(agents)) {
          return "-"; 
        }
      
        const selectedAgent = agents.find(
          (option: any) => option.psmbruid === formik.values.psaplrcb
        );
      
        return selectedAgent
          ? `${formik.values.psaplrcbdsc} - ${selectedAgent.psmbrnme}`
          : "-";
      }


    // useEffect(() => {
    //   if (Array.isArray(users)) {
    //     setMemberSource(users);
    //   }
    // }, [users]);


    // useEffect(() => {
    //   console.log(formik.errors)
    // }, [formik.errors])

    // const tiers = [
    //     { label: "Silver", value: "S" },
    //     { label: "Gold", value: "G" },
    //     { label: "Platinum", value: "P" },
    // ]
    return (
        <form onSubmit={formik?.handleSubmit}>
            <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
                <Flex direction={"column"} flex={1} alignSelf={"center"}>
                    <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
                        {props?.title ? props.title : "Agent Detail"}
                    </Text>
                    {props?.breadcrumbs ? props.breadcrumbs : <Breadcrumbs breadcrumbItems={[
                        {
                            title: "Agent Listing",
                            href: `/member`,
                        },
                        {
                            title: "Agent Detail (" + mode + ")",
                        },
                    ]}
                    />}
                </Flex>

                <Box
                    flex={0.95}
                    display={"flex"}
                    justifyContent="space-between"
                    alignSelf={"center"}
                    pr={{
                        base: 0,
                        md: Spacing.containerPx,
                    }}
                    gap={6}
                >
                    <Space size="small">
                        <Flex flexDir="row" fontSize="sm" gap={2}>

                            <Flex flexDir="column" whiteSpace={"nowrap"} >
                                {/* <Text fontWeight={"black"}>{headerInfo?.name}</Text> */}
                                <Text>Agent ID</Text>
                                <Text>Designation</Text>
                                <Text>Agent Start Date</Text>
                                <Text>Recruited By</Text>

                            </Flex>
                            <Flex flexDir="column" whiteSpace={"nowrap"} >
                                {headerInfo?.id ? <Text fontWeight={"black"}>: {formik.values.user_tag + " " + formik.values.psmbrnme}</Text> : <Text>: </Text>}
                                {headerInfo?.designation ? <Text fontWeight={"black"}>: {headerInfo?.designation + " " + headerInfo?.designation_date}</Text> : <Text>: </Text>}
                                {headerInfo?.start_date ? <Text fontWeight={"black"}>: {headerInfo?.start_date}</Text> : <Text>: </Text>}
                                {headerInfo?.recruited_by ? <Text fontWeight={"black"}>: {convertRecruit()}</Text> : <Text>: - </Text>}

                            </Flex>
                        </Flex>
                    </Space>
                    <Space size="small">
                        {!props?.profile && <Buttons buttonDefaultType={"BACK"} onClick={router.back} />}
                        {
                            tabIndex !== 1 && tabIndex !== 2 && mode && mode !== "VIEW" && (
                                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} onClick={() => formik.setFieldValue("submitAction", "save")} />

                            )}
                        {
                            tabIndex === 3 && (
                                <Buttons buttonDefaultType={"ADD"} buttonLoading={loading} onClick={() => goAdd(id)} />

                            )}

                    </Space>
                </Box>
            </Flex>
            <Flex mt={4} bgColor="#fff" py={2}>
                <Tabs
                    index={tabIndex}
                    onChange={(index) => {
                        let same = true;
                        if (detailData && tabIndex !== 1 && (tabIndex !== 3) && (tabIndex !== 2 && homeData?.psusrunm !== "ADM")) {

                            // Loop through all properties in obj1
                            for (const key in formik.values) {
                                // // Check if the property exists in obj2
                                // if (!(key in detailData)) {
                                //   return false; // Property not found in obj2
                                // }
                                // Check if the values are equal
                                if (detailData[key] !== formik.values[key]) {
                                    if (key === "psapldob") {
                                        if (formik.values[key] instanceof Date && !isNaN(formik.values[key].getTime())) {
                                            let dateString = formik.values[key].getDate() + "-" + (formik.values[key].getMonth() + 1) + "-" + formik.values[key].getFullYear()

                                            if (dateString !== detailData[key]) same = false
                                        }
                                    }
                                    else {
                                        if (key !== 'isSameAsRegAdr') {
                                            // console.log(formik.values[key] + ' ' + detailData[key])
                                            same = false; // Values are not the same
                                        }
                                    }
                                }
                            }


                            // return true; 
                            // All properties matched
                            if (mode !== "VIEW" && !same
                            ) {
                                dispatch(
                                    openGlobalModal({
                                        title: "Content Changed Alert",
                                        message: MessageDetail(),
                                        status: "warning",
                                        actions: [
                                            {
                                                title: "Confirm",
                                                onClick: async () => {
                                                    dispatch(closeGlobalModal());


                                                    setTabIndexx(index);

                                                    formik.setValues({})

                                                },
                                            },
                                            {
                                                title: "Cancel",
                                                isClose: true,
                                            },
                                        ],
                                    })
                                );
                            } else {
                                setTabIndexx(index);

                                formik.setValues({})
                            }
                        } else {
                            setTabIndexx(index);

                            formik.setValues({})

                        }







                    }}>
                    <Flex
                        bgColor="#fff"
                        justifyContent={"space-between"}
                        alignItems={"flex-end"}
                        gap={5}
                    >
                        <TabList
                            border={0}
                        >
                            <CustomTabs label="Agent" index={0} selectedTabIndex={tabIndex} />
                            {detailData && Object.keys(detailData).length > 0 && <>     <CustomTabs label="Sales" index={1} selectedTabIndex={tabIndex} />
                                <CustomTabs label="Commission" index={2} selectedTabIndex={tabIndex} />
                                <CustomTabs label="Incentive" index={3} selectedTabIndex={tabIndex} />

                            </>
                            }
                        </TabList>
                    </Flex>
                </Tabs>
            </Flex>

            {tabIndex === 0 ? (
                <MemberProfileForm profile={props?.profile} headerInfo={headerInfo} setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id} />
            ) : <> </>}
            {tabIndex === 1 ? (
                <MemberSales headerInfo={headerInfo} setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id ? id : props?.profile?.psmbruid} />
            ) : <> </>}
            {tabIndex === 2 ? (
                <MemberCommission headerInfo={headerInfo} setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id ? id : props?.profile?.psmbruid} />
            ) : <> </>}
            {tabIndex === 3 ? (
                <AgentIncentive headerInfo={headerInfo} setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id ? id : props?.profile?.psmbruid} />
            ) : <> </>}



        </form >
    );
};
const MessageDetail = () => {
    return (
        <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
            {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
            <Text p={3}>Content Changed!</Text>
            <Text fontSize={"sm"}>
                {" "}
                <Highlight query="SAVE" styles={{ py: "1", fontWeight: "bold" }}>
                    Please SAVE before switching tabs to avoid losing changes.
                </Highlight>{" "}
            </Text>
            <Text fontSize={"sm"}>
                <Highlight
                    query={["Confirm", "Cancel"]}
                    styles={{ fontWeight: "bold" }}
                >
                    Press Confirm to switch to next tab or Cancel to stay on this tab.
                </Highlight>{" "}
            </Text>
        </Box>
    );
};
export default MemberNavigation;
