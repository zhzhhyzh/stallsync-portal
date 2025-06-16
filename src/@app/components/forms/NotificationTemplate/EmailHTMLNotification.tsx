// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  useDisclosure,
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

import useFetchNotMetadata from "@app/hooks/selector/useFetchNotMetadata";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import EmailHtmlEditor, {
  htmlEditorLoadDesign,
} from "@app/components/common/HtmlEditor/EmailHtmlEditor";
import Buttons from "@app/components/common/Buttons/Buttons";
import Colors from "@app/constants/Colors";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import NotificationTemplateTable from "../NotificationAdHoc/NotificationTemplateTable";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import SubHeader from "@app/components/common/Header/SubHeader";

export default function EmailHTMLNotification({
  mode,
  id,
  detailData,
  formik,
  screenType,
  notLang,
  onChangeFiles,
}: EmailNotificationProps) {
  const { sendRequest, loading } = useApi({ title: "Email HTML Notification" });
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [ddlData] = useFetchDDL({
    code: ["MDAGRP"],
  });

  const [metadata] = useFetchNotMetadata({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { Dragger } = Upload;
  const [emailHTMLFile, setEmailHTMLFile] = useState<any[]>([]); //For multiple upload
  const [selectedEmailHTMLFile, setSelectedEmailHTMLFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const [templateValue, setTemplateValue] = useState<any>();

  useEffect(() => {
    //setCurrentMsgLang(notLang || "1");
    if (mode !== "ADD" && id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {
        setTimeout(() => {
          formik.setFieldValue("metagroup", "");
          formik.setFieldValue("metafield", "");
        }, 100);
        
        //Set File
        if (
          detailData?.message !== "" &&
          detailData?.message?.attachments.length > 0
        ) {
          //Reset selected file
          setSelectedEmailHTMLFile([]);
          setEmailHTMLFile([]);

          //Multiple File
          (detailData?.message?.attachments).forEach((fileItem: any) => {
            setSelectedEmailHTMLFile((previousFile) => [
              ...previousFile,
              {
                uid: fileItem.psdocfnm,
                name: fileItem.psdoconm,
                status: "done",
                fileStatus: "old",
                url: fileItem.download_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
                thumbUrl: fileItem.document_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
                preview: fileItem.document_url
              },
            ]);
          });
        } else {
          setSelectedEmailHTMLFile([]);
        }
      }
    }
  }, [detailData]);

  useEffect(() => {
    if (
      screenType === "NEWNOT" &&
      templateValue &&
      Object.keys(templateValue).length > 0
    ) {
      //Set isTemplate to true
      formik.setFieldValue("isTemplate", true);
      formik.setFieldValue("psnotcde", templateValue.psnotcde);

      if (templateValue?.message?.psmsgttl) {
        formik.setFieldValue("psmsgttl", templateValue?.message?.psmsgttl);
      }

      //Set Editor Content
      if (templateValue?.message?.psmsgobj) {
        formik.setFieldValue(
          "psmsgobj",
          typeof templateValue?.message?.psmsgobj === "string"
            ? JSON.parse(templateValue?.message?.psmsgobj)
            : templateValue?.message?.psmsgobj
        );
        //formik.setFieldValue("forceLoad", true);
      }

      if (templateValue?.message?.psmsgbdy) {
        formik.setFieldValue("psmsgbdy", templateValue?.message?.psmsgbdy);
      }

      //Set File
      if (
        templateValue?.message !== "" &&
        templateValue?.message?.attachments.length > 0
      ) {
        //Reset selected file
        setSelectedEmailHTMLFile([]);
        setEmailHTMLFile([]);

        //Multiple File
        (templateValue?.message?.attachments).forEach((fileItem: any) => {
          setSelectedEmailHTMLFile((previousFile) => [
            ...previousFile,
            {
              uid: fileItem.psdocfnm,
              name: fileItem.psdoconm,
              status: "done",
              fileStatus: "old",
              url: fileItem.download_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
              thumbUrl: fileItem.document_url,//genDocumentUrl(fileItem.psdocfnm, "4"),
              preview: fileItem.document_url,
            },
          ]);
        });
      } else {
        setSelectedEmailHTMLFile([]);
      }
    }
  }, [templateValue]);

  useEffect(() => {
    if (onChangeFiles && emailHTMLFile && selectedEmailHTMLFile) {
      onChangeFiles(emailHTMLFile, selectedEmailHTMLFile);
    }
  }, [selectedEmailHTMLFile]);

  useEffect(() => {
    if (screenType === "NEWNOT") {
      //Reset Field whenever channel change
      formik.setFieldValue("psmsgttl", "");
      formik.setFieldValue("psmsgbdy", "");
      formik.setFieldValue("psmsgurl", "");
      formik.setFieldValue("psnotcde", "");

      //Reset Editor Content whenever channel change
      formik.setFieldValue("psmsgobj", {});
      formik.setFieldValue("forceLoad", false);
      formik.setFieldValue("isTemplate", false);

      //Reset Attachment
      setSelectedEmailHTMLFile([]);
      setEmailHTMLFile([]);
    }

    if(mode === "ADD"){
      //Reset Field whenever channel change
      formik.setFieldValue("psmsgttl", "");
      formik.setFieldValue("psmsgbdy", "");
      formik.setFieldValue("psmsgurl", "");

      //Reset Editor Content whenever channel change
      formik.setFieldValue("psmsgobj", {});

      //Reset Attachment
      setSelectedEmailHTMLFile([]);
      setEmailHTMLFile([]);
    }
  }, [formik.values.psnotchn]);

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

      //Set isContentChanged flag to true
      if (screenType !== "NEWNOT") {
        formik.setFieldValue("isContentChanged", true);
      }
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

  const handleRemove = (file: any) => {
    // Remove the file from the fileList state
    setSelectedEmailHTMLFile((prevList) =>
      prevList.filter((item) => item.uid !== file.uid)
    );

    //For multiple upload
    setEmailHTMLFile((prevFile) =>
      prevFile.filter((item) => item.name !== file.uid)
    );

    //Set isContentChanged flag to true
    if (screenType !== "NEWNOT") {
      formik.setFieldValue("isContentChanged", true);
    }
  };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  const copyToClipboard = (metadata: string) => {
    navigator.clipboard.writeText(metadata);
    toast({
      description: "Copied to clipboard.",
      status: "success",
      duration: 2500,
      isClosable: false,
    });
  };

  async function handleGroupSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    formik.setFieldValue("metagroup", event.target.value);

    await sendRequest({
      fn: fetchMetadata({
        group: event.target.value,
      }),
    });
  }

  async function handleFieldSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    formik.setFieldValue("metafield", event.target.value);
    copyToClipboard("{{" + event.target.value + "}}");
  }

  async function handleFieldBlur() {
    formik.setFieldValue("metafield", "");
  }

  function handleTemplateRemove() {
    //Reset Field whenever channel change
    formik.setFieldValue("psmsgttl", "");
    formik.setFieldValue("psmsgbdy", "");
    formik.setFieldValue("psmsgurl", "");
    formik.setFieldValue("psnotcde", "");

    //Reset Editor Content whenever channel change
    formik.setFieldValue("psmsgobj", {});
    formik.setFieldValue("forceLoad", false);
    formik.setFieldValue("isTemplate", false);

    //Reset Attachment
    setSelectedEmailHTMLFile([]);
    setEmailHTMLFile([]);
  }

  useEffect(() => {
    if (formik.values.resetFlag) {
      resetComponent();
    }
  }, [formik.values.resetFlag]);

  function resetComponent() {
    //Reset Field
    formik.setFieldValue("psmsgttl", "");
    formik.setFieldValue("psmsgbdy", "");
    formik.setFieldValue("psmsgurl", "");
    formik.setFieldValue("psmsgobj", {});

    //Reset validation status
    formik.setFieldError('psmsgttl', '');
    formik.setFieldTouched('psmsgttl', false);
    formik.setFieldError('psmsgbdy', '');
    formik.setFieldTouched('psmsgbdy', false);

    //Reset Editor Content
    formik.setFieldValue("forceLoad", true);
    //formik.setFieldValue("isContentChanged", false);

    //Reset Attachment
    setSelectedEmailHTMLFile([]);
    setEmailHTMLFile([]);

    //Reset resetFlag
    formik.setFieldValue("resetFlag", false);
  }

  function handleContentChange() {
    formik.setFieldValue("isContentChanged", true);
  }

  return (
    <Box
      flexDir={{
        base: "column",
        lg: "row",
      }}
      gap={Spacing.gap}
      mt={Spacing.gap}
    >
      <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
        <Flex direction={"row"} justifyContent={"space-between"} width="49%">
          <Text fontSize={"19pt"} fontWeight="500">
            {screenType !== "NEWNOT" ? "Messages" : "2. Messages"}
          </Text>
          {/* {screenType !== "NEWNOT" ?
          <SubHeader labelText="Messages"/>:
          <SubHeader labelText="2. Messages"/>} */}
          {screenType === "NEWNOT" && (
            <>
              {formik.values.isTemplate ? (
                <Buttons
                  variant={"outline"}
                  borderColor={Colors.DANGER}
                  color={Colors.DANGER}
                  buttonText="Remove Template"
                  style={{ alignSelf: "center" }}
                  buttonDefaultType="CUSTOM"
                  buttonHoverBackgroundColor={Colors.DANGER}
                  buttonHoverColor={Colors.BACKGROUND}
                  onClick={() => handleTemplateRemove()}
                />
              ) : (
                <Buttons
                  variant={"outline"}
                  borderColor={Colors.PRIMARY}
                  color={Colors.PRIMARY}
                  buttonText="Select Template"
                  style={{ alignSelf: "center" }}
                  buttonDefaultType="CUSTOM"
                  buttonHoverBackgroundColor={Colors.PRIMARY}
                  buttonHoverColor={Colors.BACKGROUND}
                  onClick={() => onOpen()}
                />
              )}
            </>
          )}
        </Flex>
        <div className="flex flex-col sm:flex-row gap-6">
          <Box display="flex" flexDir="column" gap={6} width="100%">
            <FormControl
              id="psmsgttl"
              isInvalid={
                Boolean(formik.errors.psmsgttl) &&
                Boolean(formik.touched.psmsgttl)
              }
              isDisabled={formik.values.isTemplate ? true : false}
            >
              
              <CustomFormLabel labelText="Title"/>
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
                  handleContentChange();
                }}
                onBlur={formik.handleBlur}
                value={formik.values.psmsgttl}
              />
              {formik.errors.psmsgttl && (
                <FormErrorMessage>{formik.errors.psmsgttl}</FormErrorMessage>
              )}
            </FormControl>
            {screenType !== "NEWNOT" ? (
              <>
                <FormControl
                  id="metagroup"
                  isInvalid={
                    Boolean(formik.errors.metagroup) &&
                    Boolean(formik.touched.metagroup)
                  }
                >
                  <FormLabel>Meta Data Grouping</FormLabel>
                  <Select
                    placeholder="Please Select Meta Data Group"
                    value={formik.values.metagroup}
                    onChange={(evt) => handleGroupSelect(evt)}
                    onBlur={formik.handleBlur}
                  >
                    {ddlData?.MDAGRP?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.metagroup && (
                    <FormErrorMessage>
                      {formik.errors.metagroup}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="metafield"
                  isInvalid={
                    Boolean(formik.errors.metafield) &&
                    Boolean(formik.touched.metafield)
                  }
                >
                  <FormLabel>Meta Data Fields</FormLabel>
                  <Select
                    placeholder="Please Select Meta Data Field"
                    value={formik.values.metafield}
                    onChange={(evt) => handleFieldSelect(evt)}
                    onBlur={() => handleFieldBlur()}
                  >
                    {Array.isArray(metadata) &&
                      metadata.map((option: any) => (
                        <option key={option.psmdafld} value={option.psmdafld}>
                          {option.psmdadsp} - {option.psmdadsc}
                        </option>
                      ))}
                  </Select>
                  {formik.errors.metafield && (
                    <FormErrorMessage>
                      {formik.errors.metafield}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </>
            ) : (
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
                    fileList={
                      selectedEmailHTMLFile ? selectedEmailHTMLFile : undefined
                    }
                    onChange={(e: any) => handleFileUpload(e)}
                    customRequest={dummyReq}
                    disabled={formik.values.isTemplate ? true : false}
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
                                onClick={() => window.open(file?.preview, "_blank")}
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
                        Drop Files here
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
              </FormControl>
            )}
          </Box>
          <Box display="flex" flexDir="column" gap={6} width="100%">
            {screenType !== "NEWNOT" && (
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
                    fileList={
                      selectedEmailHTMLFile ? selectedEmailHTMLFile : undefined
                    }
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
                                onClick={() => window.open(file?.preview, "_blank")}
                              />
                            </Tooltip>

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
                  <FormErrorMessage>
                    {formik.errors.attachments}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          </Box>
        </div>
        <Box>
          {formik.values.isTemplate ? (
            <>
              <Text fontSize={"lg"} fontWeight="normal">
                Preview
              </Text>
              <>
                <iframe
                  title="Preview"
                  srcDoc={formik.values.psmsgbdy}
                  style={{ width: "100%", height: "60vh", border: "none" }}
                />
              </>
            </>
          ) : (
            <FormControl
              id="psmsgbdy"
              isInvalid={
                Boolean(formik.errors.psmsgbdy) &&
                Boolean(formik.touched.psmsgbdy)
              }
            >
              <EmailHtmlEditor
                formik={formik}
                designContent={formik.values.psmsgobj}
              />
              {formik.errors.psmsgbdy && (
                <FormErrorMessage>{formik.errors.psmsgbdy}</FormErrorMessage>
              )}
            </FormControl>
          )}
        </Box>
      </Card>
      {/* Modal Dialog */}
      <ModalDialogPopUp
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        children={
          <NotificationTemplateTable
            onClose={onClose}
            onChangeTemplate={(template) => setTemplateValue(template)}
            channel={"EMLE"}
          />
        }
      />
    </Box>
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

interface EmailNotificationProps {
  mode?: string;
  id?: string;
  id2?: string;
  detailData?: any;
  formik?: any;
  screenType?: string;
  notLang?: string;
  onChangeFiles?: (file: any[], selectedFile: any[]) => void;
}
