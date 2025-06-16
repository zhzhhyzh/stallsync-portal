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
import NotificationPreviewAndroid from "./NotificationPreviewAndroid";
import NotificationPreviewIos from "./NotificationPreviewIos";
import NotificationPreviewWebWin from "./NotificationPreviewWebWin";
import NotificationPreviewWebMacos from "./NotificationPreviewWebMacos";
import NotificationPreviewWebIos from "./NotificationPreviewWebIos";
import NotificationPreviewWebAndroid from "./NotificationPreviewWebAndroid";
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
import useFetchExtraDataFields from "@app/hooks/selector/useFetchExtraDataFields";
import { FaAndroid, FaApple } from "react-icons/fa";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

export default function PushNotification({
  mode,
  id,
  detailData,
  formik,
  notLang,
  screenType,
  onChangeImages,
}: PushNotificationProps) {
  const { sendRequest, loading } = useApi({ title: "Push Notification" });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [ddlData] = useFetchDDL({
    code: ["MDAGRP", "MBRNSTP"],
  });

  const [metadata] = useFetchNotMetadata({});
  const [extraDataField] = useFetchExtraDataFields({ type: "1" });

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

  const [pickedList, setPickedList] = useState<PickedList[]>([]);

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
              url: detailData?.message?.attachments[0].download_url,//genDocumentUrl(detailData?.message?.attachments[0].psdocfnm,"3"),
              thumbUrl: detailData?.message?.attachments[0].document_url,//genDocumentUrl(detailData?.message?.attachments[0].psdocfnm,"3"),
              preview: detailData?.message?.attachments[0].document_url,
            },
          ]);
        } else {
          setSelectedPushFile([]);
        }

        //Set Picked List
        let keyBodyArr = formik.values.pskeybdy;
        let newPickedList = [];
        for (var i = 0; i < keyBodyArr.length; i++) {
          let keyBodyObj = keyBodyArr[i];

          if (newPickedList.length > 0) {
            for (var z = 0; z < newPickedList.length; z++) {
              let newPickedListObj = newPickedList[z];
              if (newPickedListObj.group == keyBodyObj.group) {
                let tempPickedFieldArr = newPickedListObj.pickedField;
                tempPickedFieldArr.push(keyBodyObj.key);
                newPickedListObj.pickedField = tempPickedFieldArr;
              }
            }
          } else {
            newPickedList.push({
              group: keyBodyObj.group,
              pickedField: [keyBodyObj.key],
            });
          }
        }

        setPickedList(newPickedList);
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
      formik.setFieldValue("psnotcat", templateValue?.psnotcat);

      if (templateValue?.message?.psmsgttl) {
        formik.setFieldValue("psmsgttl", templateValue?.message?.psmsgttl);
      }

      if (templateValue?.message?.psmsgbdy) {
        formik.setFieldValue("psmsgbdy", templateValue?.message?.psmsgbdy);
      }

      if (templateValue?.message?.psmsgurl) {
        formik.setFieldValue("psmsgurl", templateValue?.message?.psmsgurl);
      }

      if (templateValue?.pskeybdy) {
        let tempKeybdy = templateValue?.pskeybdy;

        //Recreate Extra Data Array
        let newKeybdyArr: any[] = [];
        if (tempKeybdy && tempKeybdy !== "") {
          let newObj =
            typeof tempKeybdy === "string"
              ? JSON.parse(tempKeybdy)
              : tempKeybdy;

          if (newObj && Object.keys(newObj).length > 0) {
            let newKeybdy = newObj.body;
            let newDataArr = [];
            for (var i = 0; i < newKeybdy.length; i++) {
              let objItem = newKeybdy[i];

              newDataArr.push({
                _id: objItem._id,
                key: objItem.key,
                group: objItem.group,
              });
            }
            newKeybdyArr = newDataArr;
          }
        }
        formik.setFieldValue("pskeybdy", newKeybdyArr);
      }

      if (templateValue?.psmsptyp) {
        formik.setFieldValue("psmsptyp", templateValue?.psmsptyp);
      }

      if (templateValue?.psmspstp) {
        formik.setFieldValue("psmspstp", templateValue?.psmspstp);
      }

      //Set File
      if (
        templateValue?.message !== "" &&
        templateValue?.message?.attachments.length > 0
      ) {
        //Reset selected file
        setSelectedPushFile([]);
        setPushFile("");

        //Single File
        setSelectedPushFile(() => [
          {
            uid: templateValue?.message?.attachments[0].psdocfnm,
            name: templateValue?.message?.attachments[0].psdoconm,
            status: "done",
            fileStatus: "old",
            url: templateValue?.message?.attachments[0].download_url,//genDocumentUrl(templateValue?.message?.attachments[0].psdocfnm,"3"),
            thumbUrl: templateValue?.message?.attachments[0].document_url,//genDocumentUrl(templateValue?.message?.attachments[0].psdocfnm,"3"),
            preview: templateValue?.message?.attachments[0].document_url,
          },
        ]);
      } else {
        setSelectedPushFile([]);
      }
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
      formik.setFieldValue("psmsgurl", "");
      formik.setFieldValue("psnotcde", "");
      formik.setFieldValue("isTemplate", false);

      //Reset Attachment
      setSelectedPushFile([]);
      setPushFile("");

      //Reset Extra Data Array
      formik.setFieldValue("psmspstp", "");
      formik.setFieldValue("pskeybdy", []);
      formik.setFieldValue("psmsptyp", "");
      setPickedList([]);
    }
    if(mode === "ADD"){
      //Reset Field whenever channel change
      formik.setFieldValue("psmsgttl", "");
      formik.setFieldValue("psmsgbdy", "");
      formik.setFieldValue("psmsgurl", "");

      //Reset Attachment
      setSelectedPushFile([]);
      setPushFile("");

      //Reset Extra Data Array
      formik.setFieldValue("psmspstp", "");
      formik.setFieldValue("pskeybdy", []);
      formik.setFieldValue("psmsptyp", "");
      setPickedList([]);
    }
  }, [formik.values.psnotchn]);

  useEffect(() => {
    if (formik.values.resetFlag) {
      resetComponent();
    }
  }, [formik.values.resetFlag]);

  useEffect(() => {
    if (!formik.values.pskeybdy || formik.values.pskeybdy.length == 0) {
      setPickedList([]);
    }
  }, [formik.values.pskeybdy]);

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

    //Reset Extra Data Array
    formik.setFieldValue("psmspstp", "");
    formik.setFieldValue("pskeybdy", []);
    formik.setFieldValue("psmsptyp", "");
    setPickedList([]);
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
  function selectAndroid() {
    setPhonePush("AND");
  }
  
  function selectIOS() {
    setPhonePush("IOS");
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
            preview: genThumbUrl(file.originFileObj),
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

  const handleTitleMouseOver = () => {
    setIsTitleHovered(true);
  };

  const handleTitleMouseLeave = () => {
    setIsTitleHovered(false);
  };

  const handleMsgMouseOver = () => {
    setIsMsgHovered(true);
  };

  const handleMsgMouseLeave = () => {
    setIsMsgHovered(false);
  };

  function alertSendTestReceiver() {
    if (screenType === "NEWNOT") {
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
    formik.setFieldValue("psmsgurl", "");
    formik.setFieldValue("psnotcde", "");
    formik.setFieldValue("psnotcat", "");
    formik.setFieldValue("isTemplate", false);

    //Reset Extra Data Array
    formik.setFieldValue("psmspstp", "");
    formik.setFieldValue("pskeybdy", []);
    formik.setFieldValue("psmsptyp", "");
    setPickedList([]);

    //Reset Attachment
    setSelectedPushFile([]);
    setPushFile("");
  }

  function handleContentChange() {
    formik.setFieldValue("isContentChanged", true);
  }

  function addKey() {
    let genId = uuidv4();
    let keybodyArr = formik.values.pskeybdy;
    formik.setFieldValue("pskeybdy", [
      ...keybodyArr,
      {
        _id: genId,
        group: "",
        key: "",
      },
    ]);
  }

  function removeKey(keyId: string, group: string, field: string) {
    let keybodyArr = formik.values.pskeybdy;
    let newArray = [...keybodyArr];

    newArray = newArray.filter((item) => item._id !== keyId);

    formik.setFieldValue("pskeybdy", newArray);

    //Remove Picked List
    if (pickedList.length > 0) {
      let filteredPickedList = pickedList.filter((x) => x.group === group);
      if (filteredPickedList.length > 0) {
        let pickedField = filteredPickedList[0].pickedField;
        if (pickedField.includes(field)) {
          pickedField = pickedField.filter((x) => x !== field);
        }

        let newPickedList = pickedList.filter((x) => x.group !== group);
        let newPickedArray: PickedList[] = [];
        newPickedArray = [
          ...newPickedList,
          {
            group: group,
            pickedField: pickedField,
          },
        ];
        setPickedList(newPickedArray);
      }
    }
  }

  function handleArrayValue(
    keyId: string,
    type: string,
    value: string,
    group: string
  ) {
    let keybodyArr = formik.values.pskeybdy;
    let newArray = [...keybodyArr];
    let previousField = "";
    newArray.forEach((item, index) => {
      if (item._id === keyId) {
        if (type === "key") {
          previousField = newArray[index].key;
          newArray[index].key = value;
          //newArray[index].value = value !== "" ? "{" + value + "}" : "";
        }
      }
    });

    //Set Picked List
    let newPickedArray: PickedList[] = [];
    if (value !== "") {
      if (pickedList && pickedList.length > 0) {
        for (var i = 0; i < pickedList.length; i++) {
          let currentPickedField = [];
          let pickedListObj = pickedList[i];
          let isExistGroup = false;
          if (pickedListObj.group === group) {
            isExistGroup = true;
            currentPickedField = pickedListObj.pickedField;
            currentPickedField = currentPickedField.filter(
              (item) => item !== previousField
            );
            currentPickedField.push(value);
            let filteredArray = pickedList.filter(
              (item) => item.group !== group
            );

            newPickedArray = [
              ...filteredArray,
              {
                group: group,
                pickedField: currentPickedField,
              },
            ];
          }

          if (!isExistGroup) {
            newPickedArray = [
              ...pickedList,
              {
                group: group,
                pickedField: [value],
              },
            ];
          }
        }
      } else {
        newPickedArray = [
          {
            group: group,
            pickedField: [value],
          },
        ];
      }
    } else {
      if (pickedList && pickedList.length > 0) {
        for (var i = 0; i < pickedList.length; i++) {
          let currentPickedField = [];
          let pickedListObj = pickedList[i];

          if (pickedListObj.group === group) {
            currentPickedField = pickedListObj.pickedField;
            currentPickedField = currentPickedField.filter(
              (item) => item !== previousField
            );

            let filteredArray = pickedList.filter(
              (item) => item.group !== group
            );

            newPickedArray = [
              ...filteredArray,
              {
                group: group,
                pickedField: currentPickedField,
              },
            ];
          }
        }
      }
    }
    setPickedList(newPickedArray);

    formik.setFieldValue("pskeybdy", newArray);

    let fieldElement = document.getElementById("Field-" + keyId);
    if (fieldElement && fieldElement.style.borderColor == "red") {
      fieldElement.style.borderColor = "inherit";
    }
    let fieldErrorElement = document.getElementById("FieldError-" + keyId);
    if (fieldErrorElement && fieldErrorElement.style.display == "block") {
      fieldErrorElement.style.display = "none";
      fieldErrorElement.innerText = "";
    }
  }

  async function handleGroupChange(
    event: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) {
    let keybodyArr = formik.values.pskeybdy;
    let newArray = [...keybodyArr];
    newArray.forEach((item, index) => {
      if (item._id === id) {
        item.group = event.target.value;
        item.key = "";
      }
    });

    formik.setFieldValue("pskeybdy", newArray);

    let groupElement = document.getElementById("Group-" + id);
    if (groupElement && groupElement.style.borderColor == "red") {
      groupElement.style.borderColor = "inherit";
    }
    let groupErrorElement = document.getElementById("GroupError-" + id);
    if (groupErrorElement && groupErrorElement.style.display == "block") {
      groupErrorElement.style.display = "none";
      groupErrorElement.innerText = "";
    }
  }

  // async function handleChangeRequestType(
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) {
  //   let keybodyArr = formik.values.pskeybdy;
  //   let newArray = [...keybodyArr];

  //   formik.setFieldValue("pskeybdy", newArray);

  //   if (event.target.value !== "") {
  //     formik.setFieldTouched("psmspstp", false);
  //     formik.setFieldError("psmspstp", "");
  //   }
  // }

  const createExtraData = (dataArr: any) => {
    return (
      Array.isArray(dataArr) &&
      dataArr.map((items: any, index: number) => {
        return (
          <Flex
            key={"Main-" + items._id}
            id={"Main-" + items._id}
            borderRadius={20}
            borderWidth={1}
            p={5}
            mb={1}
            direction={"row"}
          >
            <Text pr={5}>{index + 1}.</Text>
            <Flex direction={"row"} justifyContent={"space-between"} w={"100%"}>
              <Flex gap={1} direction={"column"} w={"40%"}>
                <Select
                  id={"Group-" + items._id}
                  placeholder="Please Select Meta Data Group"
                  value={items.group}
                  onChange={(evt) => handleGroupChange(evt, items._id)}
                  disabled={formik.values.isTemplate ? true : false}
                >
                  {ddlData?.MDAGRP?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Text
                  id={"GroupError-" + items._id}
                  fontSize={"sm"}
                  color={"red"}
                  display={"none"}
                ></Text>
              </Flex>
              <Flex
                gap={1}
                direction={"column"}
                //justifyContent={"space-between"}
                w={"50%"}
              >
                <Select
                  id={"Field-" + items._id}
                  placeholder="Please Select Field"
                  value={items.key}
                  onChange={(evt) =>
                    handleArrayValue(
                      items._id,
                      "key",
                      evt.target.value,
                      items.group
                    )
                  }
                  disabled={formik.values.isTemplate ? true : false}
                >
                  {Array.isArray(extraDataField) &&
                    extraDataField
                      .filter((x) => x.psmdagrp === items.group)
                      .filter((x) => {
                        let filteredPickedList = pickedList.filter(
                          (pl) => pl.group === items.group
                        );
                        let filteredPickedField =
                          filteredPickedList.length > 0
                            ? filteredPickedList[0].pickedField
                            : [];
                        if (filteredPickedField.includes(items.key)) {
                          filteredPickedField = filteredPickedField.filter(
                            (pf) => pf !== items.key
                          );
                          return !filteredPickedField.includes(x.psmdafld);
                        } else {
                          return !filteredPickedField.includes(x.psmdafld);
                        }
                      })
                      .map((option: any) => (
                        <option
                          key={option.psmdafld}
                          value={option.psmdafld}
                          data-key={option.id}
                        >
                          {option.psmdafld} - {option.psmdadsp}
                        </option>
                      ))}
                </Select>
                <Text
                  id={"FieldError-" + items._id}
                  fontSize={"sm"}
                  color={"red"}
                  display={"none"}
                ></Text>
              </Flex>
              <Flex alignSelf={"center"}>
                {!formik.values.isTemplate && (
                  <ChakraToolTip label="Delete Key" fontSize="sm">
                    <IconButton
                      variant="ghost"
                      verticalAlign={"center"}
                      size={"sm"}
                      borderRadius={2}
                      colorScheme="red"
                      sx={{
                        _hover: {
                          //backgroundColor: Colors.BACKGROUND,
                          color: Colors.DANGER,
                        },
                      }}
                      icon={<CloseIcon />}
                      aria-label={"delete"}
                      onClick={() =>
                        removeKey(items._id, items.group, items.key)
                      }
                    />
                  </ChakraToolTip>
                )}
              </Flex>
            </Flex>
          </Flex>
        );
      })
    );
  };

  const extraData = <>{createExtraData(formik.values.pskeybdy)}</>;

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
                  id="psmsgttl"
                  isInvalid={
                    Boolean(formik.errors.psmsgttl) &&
                    Boolean(formik.touched.psmsgttl)
                  }
                  isDisabled={formik.values.isTemplate ? true : false}
                  //isReadOnly={mode === "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Title" />
                  <InputGroup size="md" zIndex="101">
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
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                    {!formik.values.isTemplate && (
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
                    )}
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
                  isDisabled={formik.values.isTemplate ? true : false}
                  //isReadOnly={mode === "VIEW" ? true : false}
                >
                  <CustomFormLabel labelText="Message" />
                  <InputGroup size="md" zIndex="100">
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
                        handleContentChange();
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.psmsgbdy}
                      //isDisabled={mode === "EDIT" ? true : false}
                    />
                    {!formik.values.isTemplate && (
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

                            <MenuItem
                              icon={<GrEmoji />}
                              onClick={() => setMsgEmoji(true)}
                            >
                              Emoji
                            </MenuItem>
                          </MenuList>
                        </Menu>
                        <Popover
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
                        </Popover>
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
                  <FormLabel>Image</FormLabel>
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
                </FormControl>
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
                <RadioGroup
                  name="previewType"
                  value={previewType}
                  onChange={previewTypeOnchange}
                >
                  <Stack gap={3} direction="row">
                    <Radio value="PHONE">Mobile Push</Radio>
                    {/* <Radio value="WEB">Web Push</Radio> */}
                  </Stack>
                </RadioGroup>
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
              <Box display="flex" flexDir="row" gap={12} width="100%">
                <div style={{display:"flex", flexDirection:"row", alignSelf: "center", justifyContent: "space-evenly"}}>
                  <div style={{display: 'flex', alignItems: 'center', padding: "5px", margin: "3px", cursor: "pointer", border: "1px solid #ccc",
                    backgroundColor: phonePush === "IOS" ? "#ccc" : "transparent"}}
                    onClick={selectIOS}
                  >
                    <FaApple size={20}/>
                    <span style={{ marginLeft: '2px', fontSize: "12px" }}>ios</span>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', padding: "5px", margin: "3px", cursor: "pointer", border: "1px solid #ccc",
                    backgroundColor: phonePush === "AND" ? "#ccc" : "transparent"}}
                    onClick={selectAndroid}
                  >
                    <FaAndroid size={20}/>
                    <span style={{ marginLeft: '2px', fontSize: "12px" }}>android</span>
                  </div>
                </div>
              </Box>

              <Flex flexDir={"row"} justifyContent={"space-evenly"}>
                {previewType === "PHONE" && phonePush === "AND" ? (
                  <NotificationPreviewAndroid formik={formik} />
                ) : previewType === "PHONE" && phonePush === "IOS" ? (
                  <NotificationPreviewIos formik={formik} />
                ) : previewType === "WEB" && webPush === "WEBWIN" ? (
                  <NotificationPreviewWebWin formik={formik} />
                ) : previewType === "WEB" && webPush === "WEBAND" ? (
                  <NotificationPreviewWebAndroid formik={formik} />
                ) : previewType === "WEB" && webPush === "WEBIOS" ? (
                  <NotificationPreviewWebIos formik={formik} />
                ) : (
                  previewType === "WEB" &&
                  webPush === "WEBMAC" && (
                    <NotificationPreviewWebMacos formik={formik} />
                  )
                )}
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
        {formik.values.psmsptyp && formik.values.psmsptyp === "ACTION" && (
          <Card className="grid grid-cols-1 gap-6" borderRadius={0}>
            <Text fontSize={"19pt"} fontWeight="500">
              Extra Data
            </Text>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box
                display="flex"
                flexDir="column"
                gap={6}
                width={{ base: "100%", lg: "60%" }}
              >
                <FormControl
                  id="psmspstp"
                  isInvalid={
                    Boolean(formik.errors.psmspstp) &&
                    Boolean(formik.touched.psmspstp)
                  }
                >
                  <CustomFormLabel labelText="Notification Sub Type" />
                  <Select
                    placeholder="Please Select Notification Sub Type"
                    value={formik.values.psmspstp}
                    // onChange={(event) => {
                    //   formik.handleChange(event);
                    //   handleChangeRequestType(event);
                    // }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.values.isTemplate ? true : false}
                  >
                    {ddlData?.MBRNSTP?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psmspstp && (
                    <FormErrorMessage>
                      {formik.errors.psmspstp}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {formik.values.psmspstp && formik.values.psmspstp !== "" && (
                  <FormControl
                    id="pskeybdy"
                    isInvalid={
                      Boolean(formik.errors.pskeybdy) &&
                      Boolean(formik.touched.pskeybdy)
                    }
                  >
                    <Flex direction={"row"} justifyContent={"space-between"}>
                      {/* <CustomFormLabel labelText="Keys" /> */}
                      <FormLabel>Keys</FormLabel>
                      {!formik.values.isTemplate && (
                        <ChakraToolTip
                          label="Add Key"
                          fontSize="sm"
                          alignSelf={"flex-end"}
                        >
                          <IconButton
                            variant="ghost"
                            verticalAlign={"center"}
                            size={"sm"}
                            borderRadius={2}
                            colorScheme="green"
                            sx={{
                              _hover: {
                                //backgroundColor: Colors.BACKGROUND,
                                color: Colors.SUCCESS,
                              },
                            }}
                            icon={<AddIcon />}
                            aria-label={"add"}
                            onClick={() => addKey()}
                          />
                        </ChakraToolTip>
                      )}
                    </Flex>
                    {extraData}
                    {formik.errors.pskeybdy && (
                      <FormErrorMessage>
                        {formik.errors.pskeybdy}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Box>
            </div>
          </Card>
        )}
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
              channel={"PSH"}
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
              pushNotType={formik.values.psmsptyp}
              pushNotSubType={formik.values.psmspstp}
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
  preview?: string;
}

interface PushNotificationProps {
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
