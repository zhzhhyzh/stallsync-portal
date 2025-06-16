// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  Textarea,
  Tooltip as ChakraToolTip,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";

import { Space, Tooltip, Typography, Upload, UploadFile, Image } from "antd";

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
import { genDocumentUrl } from "@app/helpers/commonHelper";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

export default function PreviewWhatsappNotification({
  mode,
  id,
  detailData,
  formik,
}: PreviewWhatsappNotificationProps) {
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
          detailData?.message !== "" &&
          detailData?.message?.attachments.length > 0
        ) {
          //Reset selected file
          setSelectedPushFile([]);
          setPushFile("");

          //Single File
          setSelectedPushFile(() => [
            {
              uid: detailData?.message?.attachments[0].psdocfnm,
              name: detailData?.message?.attachments[0].psdoconm,
              status: "done",
              fileStatus: "old",
              url: detailData?.message?.attachments[0].download_url, //genDocumentUrl(detailData?.message?.attachments[0].psdocfnm,"3"),
              thumbUrl: detailData?.message?.attachments[0].document_url, //genDocumentUrl(detailData?.message?.attachments[0].psdocfnm,"3"),
              preview: detailData?.message?.attachments[0].document_url,
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
      // const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(file.name);
      const isImage = true;
      if (isImage) {
        //Single Upload
        //Set File
        setSelectedPushFile(() => [
          {
            uid: file?.name,
            name: file?.name,
            status: "done",
            fileStatus: "new",
            size: file?.size,
            url: genThumbUrl(file.originFileObj),
            thumbUrl: genThumbUrl(file.originFileObj),
            preview: genThumbUrl(file.originFileObj),
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

  const handleRemove = (file: any) => {
    // Remove the file from the fileList state
    setSelectedPushFile([]);
    setPushFile("");
  };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  return (
    <Card className="grid grid-cols-1 gap-6" borderRadius={0} zIndex="99">
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Text fontSize={"19pt"} fontWeight="500">
          Messages
        </Text>
      </Flex>
      <div className="flex flex-col sm:flex-row gap-6">
        <Box display="flex" flexDir="column" gap={6} width="100%">
          <FormControl
            id="psmsgtid"
            isInvalid={
              Boolean(formik.errors.psmsgtid) &&
              Boolean(formik.touched.psmsgtid)
            }
            isReadOnly={true}
            //isReadOnly={mode === "VIEW" ? true : false}
          >
            <FormLabel>Template ID</FormLabel>
            <InputGroup size="md" zIndex="101">
              <Input
                placeholder={"Enter Template Id"}
                type="text"
                name="psmsgtid"
                //onChange={formik.handleChange}
                onChange={(event) => {
                  const { value } = event.target;
                  formik.handleChange({
                    target: { value, name: "psmsgtid" },
                  });
                }}
                onBlur={formik.handleBlur}
                value={formik.values.psmsgtid}
                //isDisabled={mode === "EDIT" ? true : false}
              />
            </InputGroup>
            {formik.errors.psmsgtid && (
              <FormErrorMessage>{formik.errors.psmsgtid}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="psmsgttl"
            isInvalid={
              Boolean(formik.errors.psmsgttl) &&
              Boolean(formik.touched.psmsgttl)
            }
            isReadOnly={true}
            //isReadOnly={mode === "VIEW" ? true : false}
          >
            <CustomFormLabel labelText="Template Name" />
            <InputGroup size="md" zIndex="101">
              <Input
                placeholder={"Enter Template Name"}
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
            </InputGroup>
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
            //isReadOnly={mode === "VIEW" ? true : false}
          >
            {/* <CustomFormLabel labelText="Message" /> */}
            <FormLabel>Metadata</FormLabel>
            <InputGroup size="md" zIndex="100">
              <Textarea
                placeholder={"Enter Metadata"}
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
            </InputGroup>

            {formik.errors.psmsgbdy && (
              <FormErrorMessage>{formik.errors.psmsgbdy}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            id="pswapmsg"
            isInvalid={
              Boolean(formik.errors.pswapmsg) &&
              Boolean(formik.touched.pswapmsg)
            }
            isReadOnly={true}
            //isReadOnly={mode === "VIEW" ? true : false}
          >
            <FormLabel>Message Body</FormLabel>
            <Textarea
              placeholder={"Enter Message Body"}
              //type="text"
              name="pswapmsg"
              //onChange={formik.handleChange}
              onChange={(event) => {
                const { value } = event.target;
                formik.handleChange({
                  target: { value, name: "pswapmsg" },
                });
              }}
              onBlur={formik.handleBlur}
              value={formik.values.pswapmsg}
              //isDisabled={mode === "EDIT" ? true : false}
            />
            {formik.errors.pswapmsg && (
              <FormErrorMessage>{formik.errors.pswapmsg}</FormErrorMessage>
            )}
          </FormControl>
          {/* <FormControl
          id="psmsgurl"
          isInvalid={
            Boolean(formik.errors.psmsgurl) &&
            Boolean(formik.touched.psmsgurl)
          }
          isDisabled={formik.values.isTemplate ? true : false}
          //isReadOnly={mode === "VIEW" ? true : false}
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
              handleContentChange();
            }}
            onBlur={formik.handleBlur}
            value={formik.values.psmsgurl}
            //isDisabled={mode === "EDIT" ? true : false}
          />
          {formik.errors.psmsgurl && (
            <FormErrorMessage>
              {formik.errors.psmsgurl}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="attachments"
          isInvalid={
            Boolean(formik.errors.attachments) &&
            Boolean(formik.touched.attachments)
          }
        >
          <FormLabel>Image/Attachment</FormLabel>
          <div>
            <Dragger
              name="file"
              listType="picture"
              style={{ marginBottom: 10 }}
              disabled={
                formik.values.isTemplate
                  ? true
                  : selectedPushFile && selectedPushFile.length > 0
                  ? true
                  : false
              }
              fileList={selectedPushFile ? selectedPushFile : undefined}
              onChange={(e: any) => handleFileUpload(e)}
              customRequest={dummyReq}
              itemRender={(originNode, file, fileList, action) => {
                const isImage = /\.(jpg|jpeg|png|gif|bmp)$/.test(
                  file.name
                );

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
                    <Space
                      style={{ alignSelf: "flex-end" }}
                      size={"small"}
                    >
                      {fileList.filter(
                        (item: any) =>
                          item.uid === file.uid &&
                          item.fileStatus === "old"
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
                          onClick={() =>
                            window.open(file?.preview, "_blank")
                          }
                        />
                      </Tooltip>
                      {formik.values.isTemplate !== true && (
                        <Tooltip title="Remove">
                          <DeleteOutlined
                            style={{
                              color: "gray",
                              fontSize: 14,
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              marginBottom: "6px",
                            }}
                            onClick={() => {
                              handleRemove(file);
                            }}
                          />
                        </Tooltip>
                      )}
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
            <FormErrorMessage>
              {formik.errors.attachments}
            </FormErrorMessage>
          )}
        </FormControl> */}
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

interface PreviewWhatsappNotificationProps {
  mode?: string;
  id: string;
  detailData?: any;
  formik?: any;
}
