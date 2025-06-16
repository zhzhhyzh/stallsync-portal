// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import Table from "@app/components/common/Table/Table";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  openGlobalModal,
  postBulkUploadFile,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { BsSend } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import useFetchTestReceivers from "@app/hooks/selector/useFetchTestReceivers";
import { list } from "@app/redux/testReceiver/slice";
import { sendMessage, sendNewMessage } from "@app/redux/notificationtemplate/slice";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";

export default function TestReceiverTable(props: TestReceiverTableProps) {
  const {
    notChannel,
    notStatus,
    notTempCode,
    notLang,
    screenType,
    msgTitle,
    msgBody,
    attachment,
    selectedAttachment,
    //notComChannel,
    notCategory,
    pushNotType,
    pushNotSubType
  } = props;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Test Receiver" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] =
    useFetchTestReceivers(notChannel);
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [customMetadata, setCustomMetadata] = useState<CustomMetaJson[]>([]);
  const [extraData, setExtraData] = useState<any[]>([]);
  const [sendMetadata, setSendMetadata] = useState<CustomMetaJson[]>([]);
  const [sendExtraData, setSendExtraData] = useState<any[]>([]);

  const [search, setSearch] = useState();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    onSubmit: (values) => {},
  });

  const columns: any[] = [
    {
      title: "User Id",
      dataIndex: "psusrunm",
      key: "psusrunm",
    },
    {
      title: "Name",
      dataIndex: "psusrnam",
      key: "psusrnam",
    },
    {
      title: "Email",
      dataIndex: "psusreml",
      key: "psusreml",
    },
    {
      title: "Contact No.",
      dataIndex: "pstrcphn",
      key: "pstrcphn",
    },
    {
      title: "Type",
      dataIndex: "pstrctypdsc",
      key: "pstrctypdsc",
    },
    // {
    //   title: "Status",
    //   dataIndex: "psrsvstsdsc",
    //   key: "psrsvstsdsc",
    //   render: (_: string, record: any) =>
    //     record?.psrsvsts === "Y" ? (
    //       <Text
    //         fontWeight={"normal"}
    //         color={"white"}
    //         textAlign="center"
    //         style={{
    //           width: 40,
    //           height: 20,
    //           backgroundColor: Colors.SUCCESS,
    //           borderRadius: 10,
    //         }}
    //       >
    //         Yes
    //       </Text>
    //     ) : (
    //       <Text
    //         fontWeight={"normal"}
    //         color={"white"}
    //         textAlign="center"
    //         style={{
    //           width: 40,
    //           height: 20,
    //           backgroundColor: Colors.DANGER,
    //           borderRadius: 10,
    //         }}
    //       >
    //         No
    //       </Text>
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
            <Tooltip label="Send" fontSize="sm">
              <IconButton
                variant="outline"
                size={"sm"}
                borderRadius={2}
                colorScheme="blue"
                icon={<BsSend />}
                aria-label={"send"}
                onClick={() =>
                  alertSend(
                    record?.psusrnam,
                    notChannel === "WAP" ? record?.pstrcphn : record?.psusreml,
                    notChannel === "EMLE" ? "EML" : notChannel,
                    sendMetadata,
                    notTempCode,
                    notChannel,
                    notLang,
                    msgTitle || "",
                    msgBody || "",
                    attachment || [],
                    selectedAttachment || [],
                    extra?.extraData,
                    sendExtraData,
                    //notComChannel ? notComChannel : "",
                    notCategory? notCategory : "",
                    pushNotType ? pushNotType : "",
                    pushNotSubType ? pushNotSubType : "",
                  )
                }
              />
            </Tooltip>
          </Space>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    if (extra?.metadata) {
      let newArray: CustomMetaJson[] = [];
      if (typeof extra?.metadata === "string") {
        let tempArr = JSON.parse(extra?.metadata);
        if (tempArr.length > 0) {
          for (const item of tempArr) {
            newArray.push({ field: item.field, value: "" });
          }
        }
      } else {
        let tempArr = extra?.metadata;
        if (tempArr.length > 0) {
          for (const item of tempArr) {
            newArray.push({ field: item.field, value: "" });
          }
        }
      }

      setCustomMetadata(newArray);
    } else {
      setCustomMetadata([]);
    }

    if (extra?.extraData) {
      let newDataArr = [];
      if (typeof extra?.extraData === "string") {
        let tempArr = JSON.parse(extra?.extraData);
        
        if(Object.keys(tempArr).length > 0 && tempArr.body){
          let tempBody = tempArr.body;
          for (var i = 0; i < tempBody.length; i++) {
            let objItem = tempBody[i];
            let field = "";
  
            for (const key in objItem) {
              if (key != "_id" && key != "group") {
                field = objItem[key];
              }
            }
  
            newDataArr.push({
              field: field,
            });
          }
        }
      } else {
        let tempArr = extra?.extraData;

        if(Object.keys(tempArr).length > 0) {
          let tempBody = tempArr.body;

          for (var i = 0; i < tempBody.length; i++) {
            let objItem = tempBody[i];
            let field = "";
  
            for (const key in objItem) {
              if (key != "_id" && key != "group") {
                field = objItem[key];;
              }
            }
  
            newDataArr.push({
              field: field,
            });
          }
        }
      }
      setExtraData(newDataArr);
    } else {
      setExtraData([]);
    }
  }, [extra?.metadata, extra?.extraData]);

  function alertSend(
    name: string,
    receiver: string,
    receiverType: string,
    metadata: Object,
    templateCode: string,
    channel: string,
    language: string,
    messageTitle: string,
    messageBody: string,
    attachment: any[],
    selectedAttachment: any[],
    extraData: Object,
    extraDataField: Object,
    //comChannel: string,
    notCategory: string,
    pushNotType: string,
    pushNotSubType: string
  ) {
    dispatch(
      openGlobalModal({
        title: "Send Email",
        message: SendEmailDetail(receiver, name),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () =>
              onSend(
                receiver,
                receiverType,
                metadata,
                templateCode,
                channel,
                language,
                messageTitle,
                messageBody,
                attachment,
                selectedAttachment,
                extraData,
                extraDataField,
                //comChannel,
                notCategory,
                pushNotType,
                pushNotSubType
              ),
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

  async function onSend(
    receiver: string,
    receiverType: string,
    metadata: Object,
    templateCode: string,
    channel: string,
    language: string,
    messageTitle: string,
    messageBody: string,
    attachment: any[],
    selectedAttachment: any[],
    extraData: Object,
    extraDataField: Object,
    //comChannel: string,
    notCategory: string,
    pushNotType: string,
    pushNotSubType: string
  ) {
    //Default Attachment
    let finalAttachments: String[] = [];

    //Multiple Upload
    let uploadedEmailFile: String[] = [];

    //Single Upload
    let uploadedFile = "";

    //Remove empty string
    let filteredAttachment = attachment.filter((value) => value.trim() !== "");

    if (filteredAttachment.length > 0) {
      if (filteredAttachment.length === 1) {
        const formData = new FormData();

        formData.append(`document`, filteredAttachment[0]);

        const { success, message } = await sendRequest({
          fn: postBulkUploadFile(formData),
          formik,
        });

        if (success) {
          //Single Upload
          uploadedFile = message?.document[0]?.sysfnm;
          finalAttachments.push(uploadedFile);
        } else {
          return;
        }
      } else if (filteredAttachment.length > 1) {
        const formData = new FormData();

        //For Multiple upload purpose
        filteredAttachment.forEach((fileItem, index) => {
          formData.append(`document`, fileItem);
        });

        const { success, message } = await sendRequest({
          fn: postBulkUploadFile(formData),
          formik,
        });

        if (success) {
          //Multiple Upload
          if (message?.document.length > 0) {
            (message?.document).forEach(
              (fileItem: ReturnedFileUploadStatus) => {
                uploadedEmailFile.push(fileItem.sysfnm);
              }
            );
          }

          //Add Existing Uploaded File
          selectedAttachment.forEach((fileItem: any) => {
            if (fileItem?.fileStatus === "old")
              uploadedEmailFile.push(fileItem.uid);
          });
          finalAttachments = uploadedEmailFile;
        } else {
          return;
        }
      }
    } else {
      if (selectedAttachment.length > 0) {
        selectedAttachment.forEach((fileItem) =>
          uploadedEmailFile.push(fileItem.uid)
        );
        finalAttachments = uploadedEmailFile;
      } else {
        finalAttachments = [];
      }
    }

    const { success } = await sendRequest({
      fn: screenType === "NEWNOT" ? sendNewMessage({
        receiver,
        receiverType,
        metadata,
        templateCode,
        channel,
        language,
        attachment: finalAttachments,
        title: messageTitle,
        msg: messageBody,
        extraData,
        extraDataField,
        //comChannelCode: comChannel,
        notCategory: notCategory,
        psmsptyp: pushNotType
      }) : sendMessage({
        receiver,
        receiverType,
        metadata,
        templateCode,
        channel,
        language,
        attachment: finalAttachments,
        title: messageTitle,
        msg: messageBody,
        extraData,
        extraDataField,
      }),
    });

    if (success) {
      dispatch(refreshTable());
      setTimeout(() => {
        showModal(dispatch, {
          title: channel === "PSH" ? "Send Push Notification" : (channel === "WAP" ? "Send Whatsapp Message" : "Send Email"),
          message: channel === "PSH" ? "Push Notification Sent" : (channel === "WAP" ? "Whatsapp Message Sent" : "Email Sent"),
        });
      }, 200);
    }
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function handleCustomMetadataChange(field: string, value: string) {
    customMetadata.forEach((item, index) => {
      if (item.field === field) {
        customMetadata[index].value = value;
      }
    });

    let metaObj: any = {};

    for (const item of customMetadata || []) {
      metaObj[item.field] = item.value;
    }
    setSendMetadata(metaObj);
  }

  function handleExtraDataChange(field: string, value: string) {
    extraData.forEach((item, index) => {
      if (item.field === field) {
        extraData[index].value = value;
      }
    });

    let extraDataObj: any = {};

    for (const item of extraData || []) {
      extraDataObj[item.field] = item.value;
    }
    setSendExtraData(extraDataObj);
  }

  const createMetadataForm = (customMetadata: CustomMetaJson[]) => {
    return (
      <Flex
        direction={"column"}
        width={"100%"}
        justifyContent={"space-between"}
        pl={4}
        pr={4}
        pt={4}
      >
        <Flex>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Custom Metadata
          </Text>
        </Flex>
        <Card p={4} mt={2}>
          <form>
            {Array.isArray(customMetadata) && customMetadata.length > 0 && (
              <>
                <Text fontSize={"lg"}>Title / Message</Text>
                <Flex flexWrap="wrap">
                  {Array.isArray(customMetadata) &&
                    customMetadata.map((item: CustomMetaJson) => {
                      return (
                        <Box
                          key={"container_" + item.field}
                          flexBasis="50%"
                          padding={2}
                        >
                          <Flex direction={"row"}>
                            <Text fontWeight={"semibold"} paddingRight={1}>
                              {item.field}
                            </Text>
                          </Flex>
                          <Input
                            id={"Input-" + uuidv4()}
                            type="text"
                            name={item.field}
                            onChange={(evt) =>
                              handleCustomMetadataChange(
                                item.field,
                                evt.target.value
                              )
                            }
                            value={item.value || ""}
                          />
                        </Box>
                      );
                    })}
                </Flex>
              </>
            )}
            {notChannel &&
              notChannel === "PSH" &&
              Array.isArray(extraData) &&
              extraData.length > 0 && (
                <Box pt={3}>
                  <Text fontSize={"lg"}>Extra Data</Text>
                  <Flex flexWrap="wrap">
                    {Array.isArray(extraData) &&
                      extraData.map((item: any) => {
                        return (
                          <Box
                            key={"container_" + item.field}
                            flexBasis="50%"
                            padding={2}
                          >
                            <Flex direction={"row"}>
                              <Text fontWeight={"semibold"} paddingRight={1}>
                                {item.field}
                              </Text>
                            </Flex>
                            <Input
                              id={"Input-" + uuidv4()}
                              type="text"
                              name={item.field}
                              onChange={(evt) =>
                                handleExtraDataChange(
                                  item.field,
                                  evt.target.value
                                )
                              }
                              value={item.value || ""}
                            />
                          </Box>
                        );
                      })}
                  </Flex>
                </Box>
              )}
          </form>
        </Card>
      </Flex>
    );
  };

  const metadataForm = <>{createMetadataForm(customMetadata)}</>;

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Test Recipient Listing
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Test Recipient Listing",
                },
              ]}
            />
          </Flex>
          {screenType !== "NEWNOT" && (
            <Box
              display={"flex"}
              alignSelf={"center"}
              pr={{
                base: 0,
                md: Spacing.containerPx,
              }}
            >
              <Buttons
                variant={"outline"}
                borderColor={Colors.SUCCESS}
                color={Colors.SUCCESS}
                buttonText="Custom Metadata"
                style={{ alignSelf: "center" }}
                buttonDefaultType="CUSTOM"
                buttonHoverBackgroundColor={Colors.SUCCESS3}
                buttonHoverColor={Colors.BACKGROUND}
                onClick={() => onOpen()}
              />
            </Box>
          )}
        </Flex>
        <Card p={4} mt={5}>
          <Flex bgColor="#fff" justifyContent={"space-between"} pb={3}>
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
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={list}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              pstrctyp: notChannel === "EMLE" ? "EML" : notChannel,
              psrsvsts: notStatus,
              psnotcde: notTempCode,
              psnotchn: notChannel,
              psmsglng: notLang,
            }}
          />
        </Card>
      </Box>
      {/* Modal Dialog */}
      <ModalDialogPopUp
        isOpen={isOpen}
        onClose={onClose}
        footerClose={true}
        footerCloseText="OK"
        size="4xl"
        children={<Box>{metadataForm}</Box>}
      />
    </>
  );
}

const SendEmailDetail = (email: string, name: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      <Text p={3}>Are you sure to send?</Text>
      <Text>
        {name} - {email}
      </Text>
    </Box>
  );
};

type TestReceiverTableProps = {
  notChannel: "EML" | "EMLE" | "PSH" | string;
  notStatus: "Y" | "N";
  notLang: string;
  notTempCode: string;
  screenType?: string;
  msgTitle?: string;
  msgBody?: string;
  attachment?: any[];
  selectedAttachment?: any[];
  //notComChannel?: string;
  notCategory?: string;
  pushNotType?: string;
  pushNotSubType?: string;
};

interface CustomMetaJson {
  field: string;
  value?: string;
}

//For Multiple Upload
interface ReturnedFileUploadStatus {
  ext: string;
  orgfnm: string;
  sysfnm: string;
}
