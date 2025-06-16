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
import NotificationPreviewWhatsapp from "./NotificationPreviewWhatsapp";
import { genDocumentUrl } from "@app/helpers/commonHelper";
import ModalDialogPopUp from "@app/components/modal/ModalDialogPopUp";
import { GrAddCircle, GrEmoji, GrFormAdd } from "react-icons/gr";
import { BiCodeCurly } from "react-icons/bi";
import { MdAddCircle, MdAddCircleOutline } from "react-icons/md";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import dynamic from "next/dynamic";
import TestReceiverTable from "./TestReceiverTable";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import useFetchNotMetadata from "@app/hooks/selector/useFetchNotMetadata";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import NotificationTemplateTable from "../NotificationAdHoc/NotificationTemplateTable";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

export default function WhatsappNotification({
  mode,
  id,
  detailData,
  formik,
  notLang,
  screenType,
  onChangeImages,
}: WhatsappNotificationProps) {
  const { sendRequest, loading } = useApi({ title: "Whatsapp Notification" });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ddlData] = useFetchDDL({
    code: ["MDAGRP", "MBRNSTP"],
  });

  const [metadata] = useFetchNotMetadata({});

  const [previewType, setPreviewType] = useState("PHONE");
  const [webPush, setWebPush] = useState("WEBWIN");
  const [phonePush, setPhonePush] = useState("AND");

  const { Dragger } = Upload;
  //const [pushFile, setPushFile] = useState<any[]>([]); //For multiple upload
  const [pushFile, setPushFile] = useState("");
  const [selectedPushFile, setSelectedPushFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isMsgHovered, setIsMsgHovered] = useState(false);
  const [titleEmoji, setTitleEmoji] = useState(false);
  const [titleMetadata, setTitleMetadata] = useState(false);
  const [msgEmoji, setMsgEmoji] = useState(false);
  const [msgMetadata, setMsgMetadata] = useState(false);

  const [modalType, setModalType] = useState("TESTSEND");
  const [templateValue, setTemplateValue] = useState<any>();

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
              url: genDocumentUrl(
                detailData?.message?.attachments[0].psdocfnm,
                "3"
              ),
              thumbUrl: genDocumentUrl(
                detailData?.message?.attachments[0].psdocfnm,
                "3"
              ),
            },
          ]);
        } else {
          setSelectedPushFile([]);
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
      formik.setFieldValue("psnotcde", templateValue?.psnotcde);

      if (templateValue?.message?.psmsgttl) {
        formik.setFieldValue("psmsgttl", templateValue?.message?.psmsgttl);
      }

      if (templateValue?.message?.psmsgbdy) {
        formik.setFieldValue("psmsgbdy", templateValue?.message?.psmsgbdy);
      }

      if (templateValue?.message?.psmsgtid) {
        formik.setFieldValue("psmsgtid", templateValue?.message?.psmsgtid);
      }

      if (templateValue?.message?.pswapmsg) {
        formik.setFieldValue("pswapmsg", templateValue?.message?.pswapmsg);
      }

      // //Set File
      // if (
      //   templateValue?.message !== "" &&
      //   templateValue?.message?.attachments.length > 0
      // ) {
      //   //Reset selected file
      //   setSelectedPushFile([]);
      //   setPushFile("");

      //   //Single File
      //   setSelectedPushFile(() => [
      //     {
      //       uid: templateValue?.message?.attachments[0].psdocfnm,
      //       name: templateValue?.message?.attachments[0].psdoconm,
      //       status: "done",
      //       fileStatus: "old",
      //       url: genDocumentUrl(
      //         templateValue?.message?.attachments[0].psdocfnm,
      //         "3"
      //       ),
      //       thumbUrl: genDocumentUrl(
      //         templateValue?.message?.attachments[0].psdocfnm,
      //         "3"
      //       ),
      //     },
      //   ]);
      // } else {
      //   setSelectedPushFile([]);
      // }
    }
  }, [templateValue]);

  useEffect(() => {
    if (onChangeImages && pushFile && selectedPushFile) {
      onChangeImages(pushFile, selectedPushFile);
    }
  }, [selectedPushFile]);

  useEffect(() => {
    if (screenType === "NEWNOT") {
      //Reset Field whenever channel change
      formik.setFieldValue("psmsgttl", "");
      formik.setFieldValue("psmsgbdy", "");
      formik.setFieldValue("psnotcde", "");
      formik.setFieldValue("psmsgtid", "");
      formik.setFieldValue("pswapmsg", "");
      formik.setFieldValue("isTemplate", false);

      //Reset Attachment
      setSelectedPushFile([]);
      setPushFile("");
    }
    if(mode === "ADD"){
      //Reset Field whenever channel change
      formik.setFieldValue("psmsgttl", "");
      formik.setFieldValue("psmsgbdy", "");

      //Reset Attachment
      setSelectedPushFile([]);
      setPushFile("");
    }
  }, [formik.values.psnotchn]);

  useEffect(() => {
    if (formik.values.resetFlag) {
      resetComponent();
    }
  }, [formik.values.resetFlag]);


  function resetComponent() {
    //Reset Field whenever channel change
    formik.setFieldValue("psmsgttl", "");
    formik.setFieldValue("psmsgbdy", "");
    formik.setFieldValue("psmsgurl", "");

    //Reset validation status
    formik.setFieldError("psmsgttl", "");
    formik.setFieldTouched("psmsgttl", false);
    formik.setFieldError("psmsgbdy", "");
    formik.setFieldTouched("psmsgbdy", false);
    formik.setFieldError("psmsgurl", "");
    formik.setFieldTouched("psmsgurl", false);

    //Reset Attachment
    setSelectedPushFile([]);
    setPushFile("");

    //Reset resetFlag
    formik.setFieldValue("resetFlag", false);
  }

  function previewTypeOnchange(event: any) {
    setPreviewType(event);
  }

  function webPushOnchange(event: any) {
    setWebPush(event.target.value);
  }

  function phonePushOnchange(event: any) {
    setPhonePush(event.target.value);
  }

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
          },
        ]);

        //Single Upload
        setPushFile(file.originFileObj);

        //Set isContentChanged flag to true
        if (screenType !== "NEWNOT") {
          formik.setFieldValue("isContentChanged", true);
        }
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

    //Set isContentChanged flag to true
    if (screenType !== "NEWNOT") {
      formik.setFieldValue("isContentChanged", true);
    }
  };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  const handleMsgMouseOver = () => {
    setIsMsgHovered(true);
  };

  const handleMsgMouseLeave = () => {
    setIsMsgHovered(false);
  };

  function alertSendTestReceiver() {
    if (screenType === "NEWNOT") {
      if(formik.values.psnotchn !== "WAP"){
        if (formik.values.psmsgttl !== "" && formik.values.psmsgbdy !== "") {
          setModalType("TESTSEND");
          onOpen();
        } else {
          showModal(dispatch, {
            title: "Send To Test Device",
            message:
              "Please ensure your message title and message body is not empty.",
            status: "error",
          });
        }
      }else{
        if (formik.values.psmsgttl !== ""){
          setModalType("TESTSEND");
          onOpen();
        }else{
          showModal(dispatch, {
            title: "Send To Test Device",
            message:
              "Please ensure your Template Name is not empty.",
            status: "error",
          });
        }
      }
    } else {
      dispatch(
        openGlobalModal({
          title: "Send to Test Device",
          message: TestReceiverMsg(),
          status: "warning",
          actions: [
            {
              title: "Confirm",
              onClick: () => handleSendTestReceiver(),
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
  }

  function handleSendTestReceiver() {
    dispatch(closeGlobalModal());
    onOpen();
  }

  function handleSelectTemplate() {
    setModalType("TEMPLATE");
    onOpen();
  }

  async function handleGroupSelect(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
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
    let newValue = event.target.value;
    if (msgMetadata) {
      let currentValue = formik.values.psmsgbdy;
      formik.setFieldValue(
        "psmsgbdy",
        currentValue + (newValue !== "" ? "{{" + event.target.value + "}}" : "")
      );
      //Set isContentChanged flag to true
      formik.setFieldValue("isContentChanged", true);
    } else if (titleMetadata) {
      let currentValue = formik.values.psmsgttl;
      formik.setFieldValue(
        "psmsgttl",
        currentValue + (newValue !== "" ? "{{" + event.target.value + "}}" : "")
      );
      //Set isContentChanged flag to true
      formik.setFieldValue("isContentChanged", true);
    }
  }

  async function handleFieldBlur() {
    formik.setFieldValue("metafield", "");
  }

  function handleTemplateRemove() {
    //Reset Field
    formik.setFieldValue("psmsgttl", "");
    formik.setFieldValue("psmsgbdy", "");
    formik.setFieldValue("psmsgtid", "");
    formik.setFieldValue("pswapmsg", "");
    formik.setFieldValue("psnotcde", "");
    formik.setFieldValue("isTemplate", false);

    //Reset Attachment
    setSelectedPushFile([]);
    setPushFile("");
  }

  function handleContentChange() {
    formik.setFieldValue("isContentChanged", true);
  }

  return (
    <Box>
      <Flex direction={"column"} gap={Spacing.gap}>
        <Flex
          flexDir={{
            base: "column",
            lg: "row",
          }}
          gap={Spacing.gap}
          mt={Spacing.gap}
          position={"relative"}
        >
          <Card className="grid grid-cols-1 gap-6" borderRadius={0} zIndex="99">
            <Flex direction={"row"} justifyContent={"space-between"}>
              <Text fontSize={"19pt"} fontWeight="500">
                {screenType !== "NEWNOT" ? "Messages" : "2. Messages"}
              </Text>
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
                      onClick={() => handleSelectTemplate()}
                    />
                  )}
                </>
              )}
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
                        handleContentChange();
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgtid}
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                  </InputGroup>
                  {formik.errors.psmsgtid && (
                    <FormErrorMessage>
                      {formik.errors.psmsgtid}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmsgttl"
                  isInvalid={
                    Boolean(formik.errors.psmsgttl) &&
                    Boolean(formik.touched.psmsgttl)
                  }
                  isReadOnly={screenType === "NEWNOT" ? true : false}
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
                        handleContentChange();
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgttl}
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                    {/* {!formik.values.isTemplate && (
                      <InputRightElement>
                        <Menu isLazy>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={
                              <Icon
                                as={MdAddCircle}
                                color={isTitleHovered ? Colors.PRIMARY : "none"}
                              />
                            }
                            transform={
                              isTitleHovered
                                ? "rotate(90deg) scale(1.2)"
                                : "none"
                            }
                            transition={"all 0.5s"}
                            variant="unsyled"
                            sx={{
                              _hover: {
                                backgroundColor: "none",
                                color: "none",
                              },
                            }}
                            onMouseOver={handleTitleMouseOver}
                            onMouseLeave={handleTitleMouseLeave}
                          />
                          <MenuList>
                            {screenType !== "NEWNOT" && (
                              <MenuItem
                                onClick={() => setTitleMetadata(true)}
                                icon={<BiCodeCurly />}
                              >
                                Metadata
                              </MenuItem>
                            )}

                            <MenuItem
                              icon={<GrEmoji />}
                              onClick={() => setTitleEmoji(true)}
                            >
                              Emoji
                            </MenuItem>
                          </MenuList>
                        </Menu>
                        <Popover
                          isLazy
                          isOpen={titleEmoji}
                          onClose={() => setTitleEmoji(false)}
                        >
                          <PopoverTrigger>
                            <Box
                              style={{
                                width: 0,
                                height: 0,
                                overflow: "hidden",
                              }}
                            >
                              <Button variant="unstyled"></Button>
                            </Box>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Picker
                              lazyLoadEmojis
                              emojiStyle={EmojiStyle.GOOGLE}
                              onEmojiClick={(e) => {
                                formik.setFieldValue(
                                  "psmsgttl",
                                  formik.values.psmsgttl + e.emoji
                                );
                                handleContentChange();
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {screenType !== "NEWNOT" && (
                          <Popover
                            isLazy
                            isOpen={titleMetadata}
                            onClose={() => setTitleMetadata(false)}
                          >
                            <PopoverTrigger>
                              <Box
                                style={{
                                  width: 0,
                                  height: 0,
                                  overflow: "hidden",
                                }}
                              >
                                <Button variant="unstyled"></Button>
                              </Box>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Card>
                                <Text>Metdata</Text>
                                <Stack spacing={3} pt={1}>
                                  <Select
                                    placeholder="Please Select Meta Data Group"
                                    value={formik.values.metagroup}
                                    onChange={(evt) => handleGroupSelect(evt)}
                                    onBlur={formik.handleBlur}
                                  >
                                    {ddlData?.MDAGRP?.map(
                                      (option: DDL_TYPES) => (
                                        <option
                                          key={option.prgecode}
                                          value={option.prgecode}
                                        >
                                          {option.prgedesc}
                                        </option>
                                      )
                                    )}
                                  </Select>
                                  <Select
                                    placeholder="Please Select Metadata Field"
                                    value={formik.values.metafield}
                                    onChange={(evt) => handleFieldSelect(evt)}
                                    onBlur={() => handleFieldBlur()}
                                  >
                                    {Array.isArray(metadata) &&
                                      metadata.map((option: any) => (
                                        <option
                                          key={option.psmdafld}
                                          value={option.psmdafld}
                                          data-key={option.psmdafld}
                                        >
                                          {option.psmdadsp} - {option.psmdadsc}
                                        </option>
                                      ))}
                                  </Select>
                                </Stack>
                              </Card>
                            </PopoverContent>
                          </Popover>
                        )}
                      </InputRightElement>
                    )} */}
                  </InputGroup>
                  {formik.errors.psmsgttl && (
                    <FormErrorMessage>
                      {formik.errors.psmsgttl}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psmsgbdy"
                  isInvalid={
                    Boolean(formik.errors.psmsgbdy) &&
                    Boolean(formik.touched.psmsgbdy)
                  }
                  isReadOnly={screenType === "NEWNOT" ? true : false}
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
                        handleContentChange();
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgbdy}
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                    {screenType !== "NEWNOT" && (
                      <InputRightElement>
                        <Menu isLazy>
                          <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={
                              <Icon
                                as={MdAddCircle}
                                color={isMsgHovered ? Colors.PRIMARY : "none"}
                              />
                            }
                            transform={
                              isMsgHovered ? "rotate(90deg) scale(1.2)" : "none"
                            }
                            transition={"all 0.5s"}
                            variant="unsyled"
                            sx={{
                              _hover: {
                                backgroundColor: "none",
                                color: "none",
                              },
                            }}
                            onMouseOver={handleMsgMouseOver}
                            onMouseLeave={handleMsgMouseLeave}
                          />
                          <MenuList>
                            {screenType !== "NEWNOT" && (
                              <MenuItem
                                onClick={() => setMsgMetadata(true)}
                                icon={<BiCodeCurly />}
                              >
                                Metadata
                              </MenuItem>
                            )}

                            {/* <MenuItem
                              icon={<GrEmoji />}
                              onClick={() => setMsgEmoji(true)}
                            >
                              Emoji
                            </MenuItem> */}
                          </MenuList>
                        </Menu>
                        {/* <Popover
                          isLazy
                          isOpen={msgEmoji}
                          onClose={() => setMsgEmoji(false)}
                        >
                          <PopoverTrigger>
                            <Box
                              style={{
                                width: 0,
                                height: 0,
                                overflow: "hidden",
                              }}
                            >
                              <Button variant="unstyled"></Button>
                            </Box>
                          </PopoverTrigger>
                          <PopoverContent>
                            <EmojiPicker
                              lazyLoadEmojis
                              emojiStyle={EmojiStyle.GOOGLE}
                              onEmojiClick={(e) => {
                                formik.setFieldValue(
                                  "psmsgbdy",
                                  formik.values.psmsgbdy + e.emoji
                                );
                                handleContentChange();
                              }}
                            />
                          </PopoverContent>
                        </Popover> */}
                        {screenType !== "NEWNOT" && (
                          <Popover
                            isLazy
                            isOpen={msgMetadata}
                            onClose={() => setMsgMetadata(false)}
                          >
                            <PopoverTrigger>
                              <Box
                                style={{
                                  width: 0,
                                  height: 0,
                                  overflow: "hidden",
                                }}
                              >
                                <Button variant="unstyled"></Button>
                              </Box>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Card>
                                <Text>Metdata</Text>
                                <Stack spacing={3} pt={1}>
                                  <Select
                                    placeholder="Please Select Meta Data Group"
                                    value={formik.values.metagroup}
                                    onChange={(evt) => handleGroupSelect(evt)}
                                    onBlur={formik.handleBlur}
                                  >
                                    {ddlData?.MDAGRP?.map(
                                      (option: DDL_TYPES) => (
                                        <option
                                          key={option.prgecode}
                                          value={option.prgecode}
                                        >
                                          {option.prgedesc}
                                        </option>
                                      )
                                    )}
                                  </Select>
                                  <Select
                                    placeholder="Please Select Meta Data Field"
                                    value={formik.values.metafield}
                                    onChange={(evt) => handleFieldSelect(evt)}
                                    onBlur={formik.handleBlur}
                                  >
                                    {Array.isArray(metadata) &&
                                      metadata.map((option: any) => (
                                        <option
                                          key={option.psmdafld}
                                          value={option.psmdafld}
                                          data-key={option.psmdafld}
                                        >
                                          {option.psmdadsp} - {option.psmdadsc}
                                        </option>
                                      ))}
                                  </Select>
                                </Stack>
                              </Card>
                            </PopoverContent>
                          </Popover>
                        )}
                      </InputRightElement>
                    )}
                  </InputGroup>

                  {formik.errors.psmsgbdy && (
                    <FormErrorMessage>
                      {formik.errors.psmsgbdy}
                    </FormErrorMessage>
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
                        handleContentChange();
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.pswapmsg}
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                  {formik.errors.pswapmsg && (
                    <FormErrorMessage>
                      {formik.errors.pswapmsg}
                    </FormErrorMessage>
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
                                    onClick={() => handleDownload(file?.uid)}
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
                                    window.open(file?.url, "_blank")
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
          <Card
            className="grid grid-cols-1 gap-6"
            borderRadius={0}
            height={"650px"}
          >
            <Text fontSize={"19pt"} fontWeight="500">
              Preview
            </Text>
            <div className="flex flex-col sm:flex-column gap-6">
              <Box display="flex" flexDir="column" gap={6} width="100%">
                {/* <RadioGroup
                  name="previewType"
                  value={previewType}
                  onChange={previewTypeOnchange}
                >
                  <Stack gap={3} direction="row">
                    <Radio value="PHONE">Mobile Push</Radio>
                    {/* <Radio value="WEB">Web Push</Radio> 
                  </Stack>
                </RadioGroup> */}
                {/* {previewType === "PHONE" ? (
                  <Select
                    name="phonePush"
                    onChange={phonePushOnchange}
                    //placeholder="Please Select"
                    value={phonePush}
                  >
                    <option value={"AND"}>{"Android"}</option>
                    <option value={"IOS"}>{"iOS"}</option>
                  </Select>
                ) : (
                  <Select
                    name="webPush"
                    onChange={webPushOnchange}
                    //placeholder="Please Select"
                    value={webPush}
                  >
                    <option value={"WEBWIN"}>{"Web - Windows"}</option>
                    <option value={"WEBAND"}>{"Web - Android"}</option>
                    <option value={"WEBIOS"}>{"Web - iOS"}</option>
                    <option value={"WEBMAC"}>{"Web - macOS"}</option>
                  </Select>
                )} */}
              </Box>
              <Flex flexDir={"row"} justifyContent={"space-evenly"}>
                <NotificationPreviewWhatsapp
                  selectedPushFile={selectedPushFile}
                  pushFile={pushFile}
                  formik={formik}
                />
                {(mode !== "ADD" || screenType === "NEWNOT") && (
                  <Buttons
                    variant={"outline"}
                    borderColor={Colors.PRIMARY}
                    color={Colors.PRIMARY}
                    buttonText="Send to Test Device"
                    style={{ alignSelf: "center" }}
                    buttonDefaultType="CUSTOM"
                    onClick={(e) => alertSendTestReceiver()}
                  />
                )}
              </Flex>
            </div>
          </Card>
        </Flex>
      </Flex>

      {/* Modal Dialog */}
      <ModalDialogPopUp
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        children={
          modalType !== "TESTSEND" ? (
            <NotificationTemplateTable
              onClose={onClose}
              onChangeTemplate={(template) => setTemplateValue(template)}
              channel={"WAP"}
              msgType={""}
            />
          ) : (
            <TestReceiverTable
              notChannel={formik.values.psnotchn}
              notStatus={"Y"}
              notLang={screenType === "NEWNOT" ? "1" : notLang}
              notTempCode={
                screenType === "NEWNOT"
                  ? formik.values.isTemplate
                    ? formik.values.psnotcde
                    : ""
                  : formik.values.psnotcde
              }
              screenType={screenType}
              msgTitle={formik.values.psmsgttl}
              msgBody={formik.values.psmsgbdy}
              attachment={screenType === "NEWNOT" ? [pushFile] : []}
              selectedAttachment={screenType === "NEWNOT" ? [pushFile] : []}
            />
          )
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
}

interface WhatsappNotificationProps {
  mode?: string;
  id?: string;
  id2?: string;
  detailData?: any;
  formik?: any;
  notLang: string;
  screenType?: string;
  onChangeImages?: (image: string, selectedImage: any[]) => void;
}

interface PickedList {
  group: string;
  pickedField: any[];
}

const TestReceiverMsg = () => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      <Text p={3}>
        Please ensure you had saved the latest content before proceed.
      </Text>
    </Box>
  );
};
