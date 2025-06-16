// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useRef, useState } from "react";

import { Space, Tooltip, Typography, Upload, UploadFile, Image } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import {
  DownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { download, fetchMetadata } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import useApi from "@app/hooks/useApi";
import { genDocumentUrl } from "@app/helpers/commonHelper";

export default function PreviewEmailHTMLNotification({
  mode,
  id,
  detailData,
  formik,
}: PreviewEmailHTMLNotificationProps) {
  const { sendRequest, loading } = useApi({ title: "Email HTML Notification" });
  const dispatch = useAppDispatch();

  const { Dragger } = Upload;
  const [emailHTMLFile, setEmailHTMLFile] = useState<any[]>([]); //For multiple upload
  const [selectedEmailHTMLFile, setSelectedEmailHTMLFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  useEffect(() => {
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        //Set File
        if (detailData?.attachments && detailData?.attachments.length > 0) {
          //Reset selected file
          setSelectedEmailHTMLFile([]);
          setEmailHTMLFile([]);

          //Multiple File
          (detailData?.attachments).forEach((fileItem: any) => {
            setSelectedEmailHTMLFile((previousFile) => [
              ...previousFile,
              {
                uid: fileItem.psdocfnm,
                name: fileItem.psdoconm,
                status: "done",
                fileStatus: "old",
                url: fileItem?.download_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
                thumbUrl: fileItem?.document_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
                preview: fileItem?.document_url
              },
            ]);
          });
        } else {
          setSelectedEmailHTMLFile([]);
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
      //Multiple Upload
      setSelectedEmailHTMLFile((previousFile) => [
        ...previousFile,
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
      setEmailHTMLFile((previousFile) => [...previousFile, file.originFileObj]); //For multiple file
    }
    return false;
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
      <Flex direction={"row"} justifyContent={"space-between"} width="49%">
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
            />
            {formik.errors.psmsgttl && (
              <FormErrorMessage>{formik.errors.psmsgttl}</FormErrorMessage>
            )}
          </FormControl>
        </Box>
      </div>
      <Box>
        <Text fontSize={14} fontWeight="600" color={"#526069"}>
          Message
        </Text>
        <>
          <iframe
            title="Preview"
            srcDoc={formik.values.psmsgbdy}
            style={{ width: "100%", height: "60vh", border: "none" }}
          />
        </>
      </Box>
      <FormControl
        id="attachments"
        isInvalid={
          Boolean(formik.errors.attachments) &&
          Boolean(formik.touched.attachments)
        }
      >
        <FormLabel>Attachment</FormLabel>
        <div>
          <Dragger
            name="file"
            style={{ marginBottom: 10 }}
            fileList={selectedEmailHTMLFile ? selectedEmailHTMLFile : undefined}
            onChange={(e: any) => handleFileUpload(e)}
            customRequest={dummyReq}
            disabled={true}
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
                Drop Files here
              </Text>
              <Text>or click to upload</Text>
            </Flex>
          </Dragger>
        </div>
        {formik.errors.attachments && (
          <FormErrorMessage>{formik.errors.attachments}</FormErrorMessage>
        )}
      </FormControl>
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

interface PreviewEmailHTMLNotificationProps {
  mode?: string;
  id: string;
  detailData?: any;
  formik?: any;
}
