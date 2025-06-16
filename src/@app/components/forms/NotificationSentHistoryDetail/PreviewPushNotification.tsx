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
  RadioGroup,
  Radio,
  Stack,
  useDisclosure,
  InputGroup,
  InputRightElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
  Tooltip as ChakraToolTip,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tooltip, Typography, Upload, UploadFile, Image } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import {
  FileOutlined,
  ExportOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  download,
  fetchMetadata,
  openGlobalModal,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import Buttons from "@app/components/common/Buttons/Buttons";
import { genDocumentUrl } from "@app/helpers/commonHelper";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import { GrAddCircle, GrEmoji, GrFormAdd } from "react-icons/gr";
import { BiCodeCurly } from "react-icons/bi";
import { MdAddCircle, MdAddCircleOutline } from "react-icons/md";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import dynamic from "next/dynamic";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import useFetchNotMetadata from "@app/hooks/selector/useFetchNotMetadata";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import NotificationTemplateTable from "../NotificationAdHoc/NotificationTemplateTable";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import useFetchExtraDataFields from "@app/hooks/selector/useFetchExtraDataFields";
import { FaAndroid, FaApple } from "react-icons/fa";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

export default function PreviewPushNotification({
  mode,
  id,
  detailData,
  formik,
}: PushNotificationProps) {
  const { sendRequest, loading } = useApi({ title: "Push Notification" });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { Dragger } = Upload;
  //const [pushFile, setPushFile] = useState<any[]>([]); //For multiple upload
  const [pushFile, setPushFile] = useState("");
  const [selectedPushFile, setSelectedPushFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        //Set File
        if (
          detailData?.attachments &&
          detailData?.attachments.length > 0
        ) {
          //Reset selected file
          setSelectedPushFile([]);
          setPushFile("");

          //Single File
          setSelectedPushFile(() => [
            {
              uid: detailData?.attachments[0].psdocfnm,
              name: detailData?.attachments[0].psdoconm,
              status: "done",
              fileStatus: "old",
              url: detailData?.attachments[0].download_url,//genDocumentUrl(detailData?.attachments[0].psdocfnm,"3"),
              thumbUrl: detailData?.attachments[0].document_url,//genDocumentUrl(detailData?.attachments[0].psdocfnm,"3"),
              preview: detailData?.attachments[0].document_url
            },
          ]);
        } else {
          setSelectedPushFile([]);
        }
      }
    }
  }, [detailData]);

  const genThumbUrl = (file: any) => {
    return URL.createObjectURL(file);
  };

  const handleFileUpload = ({ file }: { file: any }) => {
    if (file.size > 5242880) {
      showModal(dispatch, {
        title: "File Upload",
        message: "File size cannot be more than 5MB",
        status: "error",
      });
    } else {
      const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);
      if (isImage) {
        //Single Upload
        //Set File
        setSelectedPushFile(() => [
          {
            uid: file?.name,
            name: file?.name,
            status: "done",
            fileStatus: "new",
            url: genThumbUrl(file.originFileObj),
            thumbUrl: genThumbUrl(file.originFileObj),
            preview: genThumbUrl(file.originFileObj)
          },
        ]);

        //Single Upload
        setPushFile(file.originFileObj);
      } else {
        showModal(dispatch, {
          title: "File Upload",
          message: "Only Image file is allowed",
          status: "error",
        });
      }
    }
  };

  async function handleDownload(filename: string) {
    await sendRequest({
      fn: download({
        filename,
      }),
    });
  }

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  return (
    <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Text fontSize={"lg"}>Messages</Text>
      </Flex>
      <div className="flex flex-col sm:flex-row gap-6">
        <Box display="flex" flexDir="column" gap={6} width="100%">
          <FormControl
            id="psmsgttl"
            isInvalid={
              Boolean(formik.errors.psmsgttl) &&
              Boolean(formik.touched.psmsgttl)
            }
            isReadOnly={true}
          >
            <FormLabel>Title</FormLabel>
            <Input
              placeholder={"Enter Title"}
              type="text"
              name="psmsgttl"
              //onChange={formik.handleChange}
              onChange={(event) => {
                const { value } = event.target;
                formik.handleChange({
                  target: { value, name: "psmsgttl" },
                });
              }}
              onBlur={formik.handleBlur}
              value={formik.values.psmsgttl}
              //isDisabled={mode === "EDIT" ? true : false}
            />
            {formik.errors.psmsgttl && (
              <FormErrorMessage>{formik.errors.psmsgttl}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="psmsgbdy"
            isInvalid={
              Boolean(formik.errors.psmsgbdy) &&
              Boolean(formik.touched.psmsgbdy)
            }
            isReadOnly={true}
          >
            <FormLabel>Message</FormLabel>
            <Textarea
              fontSize={"sm"}
              placeholder={"Enter Message"}
              //type="text"
              name="psmsgbdy"
              //onChange={formik.handleChange}
              onChange={(event) => {
                const { value } = event.target;
                formik.handleChange({
                  target: { value, name: "psmsgbdy" },
                });
              }}
              onBlur={formik.handleBlur}
              value={formik.values.psmsgbdy}
              //isDisabled={mode === "EDIT" ? true : false}
            />
            {formik.errors.psmsgbdy && (
              <FormErrorMessage>{formik.errors.psmsgbdy}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="psmsgurl"
            isInvalid={
              Boolean(formik.errors.psmsgurl) &&
              Boolean(formik.touched.psmsgurl)
            }
            isReadOnly={true}
          >
            <FormLabel>URL</FormLabel>
            <Input
              placeholder={"Enter URL"}
              type="text"
              name="psmsgurl"
              //onChange={formik.handleChange}
              onChange={(event) => {
                const { value } = event.target;
                formik.handleChange({
                  target: { value, name: "psmsgurl" },
                });
              }}
              onBlur={formik.handleBlur}
              value={formik.values.psmsgurl}
              //isDisabled={mode === "EDIT" ? true : false}
            />
            {formik.errors.psmsgurl && (
              <FormErrorMessage>{formik.errors.psmsgurl}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="attachments"
            isInvalid={
              Boolean(formik.errors.attachments) &&
              Boolean(formik.touched.attachments)
            }
          >
            <FormLabel>Image</FormLabel>
            <div>
              <Dragger
                name="file"
                listType="picture"
                style={{ marginBottom: 10 }}
                disabled={true}
                fileList={selectedPushFile ? selectedPushFile : undefined}
                onChange={(e: any) => handleFileUpload(e)}
                customRequest={dummyReq}
                itemRender={(originNode, file, fileList, action) => {
                  const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);

                  return (
                    <Space
                      direction="horizontal"
                      style={{
                        backgroundColor: "white",
                        width: "100%",
                        paddingTop: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 5,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "lightgray",
                        justifyContent: "space-between",
                      }}
                    >
                      <Space size={"middle"}>
                        {file.thumbUrl && isImage ? (
                          <Image width={60} src={file.thumbUrl} />
                        ) : (
                          <FileOutlined
                            style={{
                              marginBottom: "7px",
                              width: "60px",
                              color: "gray",
                            }}
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
                          <Tooltip title="Download">
                            <DownloadOutlined
                              style={{
                                color: "gray",
                                fontSize: 14,
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                marginBottom: "6px",
                              }}
                              //onClick={() => handleDownload(file?.uid)}
                              onClick={() => {
                                window.open(file?.url, "_blank");
                              }}
                            />
                          </Tooltip>
                        )}
                        <Tooltip title="Preview">
                          <ExportOutlined
                            style={{
                              color: "gray",
                              fontSize: 14,
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              marginBottom: "6px",
                            }}
                            onClick={() => window.open(file?.preview, "_blank")}
                          />
                        </Tooltip>
                      </Space>
                    </Space>
                  );
                }}
              >
                <Flex flexDir={"column"} pb={6}>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    Drop image here
                  </Text>
                  <Text>or click to upload</Text>
                </Flex>
              </Dragger>
            </div>
            {formik.errors.attachments && (
              <FormErrorMessage>{formik.errors.attachments}</FormErrorMessage>
            )}
          </FormControl>
        </Box>
      </div>
    </Card>
  );
}

interface UploadedFile {
  uid: string;
  name: string;
  status: string;
  url?: string;
  thumbUrl?: string;
  preview?: string;
}

interface PushNotificationProps {
  mode?: string;
  id?: string;
  detailData?: any;
  formik?: any;
}
