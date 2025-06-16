// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Select,
  Tooltip,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  DeleteOutlined,
  ExportOutlined,
  FileOutlined,
} from "@ant-design/icons";
// assets
import React, { useState } from "react";
import {
  DatePicker,
  Space,
  Tag,
  Upload,
  UploadFile,
  Image,
  Typography,
} from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { IoTrash } from "react-icons/io5";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  //download,
  openGlobalModal,
  postBulkUploadFile,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import { useFormik } from "formik";
import useFetchMetadatas from "@app/hooks/selector/useFetchMetadatas";
import {
  deleteMetadata,
  fetchMetadatas,
  uploadMetadataFile,
} from "@app/redux/metadata/slice";
import { UploadedFile } from "@app/interfaces/uploaded.types";

export default function MetadataPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);
  const { sendRequest, loading } = useApi({ title: "Metadata Listing" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchMetadatas();
  const [ddlData] = useFetchDDL({ code: ["MDAGRP", "MDASRC", "YESORNO"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [status, setStatus] = useState();
  const [group, setGroup] = useState();
  const [source, setSource] = useState();

  //Upload Metadata File
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { Dragger } = Upload;
  const [metadataFile, setMetadataFile] = useState("");
  const [selectedMetadataFile, setSelectedMetadataFile] = useState<
    UploadFile<UploadedFile>[]
  >([]);

  const columns: any[] = [
    {
      title: "Source Data",
      dataIndex: "psmdasrcdsc",
      key: "psmdasrcdsc",
    },
    {
      title: "Group",
      dataIndex: "psmdagrpdsc",
      key: "psmdagrpdsc",
    },
    {
      title: "Metadata File Name",
      dataIndex: "psmdafle",
      key: "psmdafle",
    },
    {
      title: "Metadata Fields",
      dataIndex: "psmdafld",
      key: "psmdafld",
      render: (_: any, record: any) => (
        <Text>
          {_} - {record?.psmdadsc}
        </Text>
      ),
    },
    {
      title: "Meta Data Description",
      dataIndex: "psmdadsp",
      key: "psmdadsp",
    },
    {
      title: "Active",
      dataIndex: "psmdasts",
      key: "psmdasts",
      render: (_: string, record: any) =>
        _ === "Y" ? (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 40,
              height: 20,
              backgroundColor: Colors.SUCCESS,
              borderRadius: 10,
            }}
          >
            Yes
          </Text>
        ) : (
          <Text
            fontWeight={"normal"}
            color={"white"}
            textAlign="center"
            style={{
              width: 40,
              height: 20,
              backgroundColor: Colors.DANGER,
              borderRadius: 10,
            }}
          >
            No
          </Text>
        ),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      width: "10rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.MTDA_EDIT) && (
                <Tooltip label="Edit" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.PRIMARY,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id)}
                  />
                </Tooltip>
              )}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.MTDA_DEL) && (
                <Tooltip label="Delete" fontSize="sm">
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{
                      _hover: {
                        backgroundColor: Colors.DANGER,
                        color: Colors.BACKGROUND,
                      },
                    }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() =>
                      alertRemove(
                        record?.id,
                        record?.psmdafld + " - " + record?.psmdafle
                      )
                    }
                  />
                </Tooltip>
              )}
            <TableMenu
              menus={[
                {
                  url: `/maintLogs`,
                  query: {
                    id: record?.psmdafle + "-" + record?.psmdafld,
                    file: extra.file,
                  },
                  label: "Maint Log",
                  breadcrumbRoute: [
                    {
                      title: "Notification Metadata Listing",
                      href: `/metadata`,
                    },
                    {
                      title: "Maintenance Log",
                    },
                  ],
                },
              ]}
            />
          </Space>
        </Flex>
      ),
    },
  ];

  function alertRemove(id: string, desc: string) {
    dispatch(
      openGlobalModal({
        title: "Delete Record",
        message: RemoveDetail(desc),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => onRemove(id),
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

  function goUpload(id: string) {
    //setSelectedId(id);
    onOpen();
  }

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: deleteMetadata({ id }),
    });

    if (success) {
      dispatch(refreshTable());
      setTimeout(() => {
        showModal(dispatch, {
          title: "Delete Record",
          message: "Record Deleted",
        });
      }, 200);
    }
  }
  

  function goAdd() {
    router.push({
      pathname: "/metadata/Detail",
      query: {
        id: "",
        mode: "ADD",
      },
    });
  }

  function goEdit(id: string) {
    router.push({
      pathname: "/metadata/Detail",
      query: {
        id: id,
        mode: "EDIT",
      },
    });
  }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function statusOnchange(event: any) {
    setStatus(event.target.value);
  }

  function groupOnchange(event: any) {
    setGroup(event.target.value);
  }

  function sourceOnchange(event: any) {
    setSource(event.target.value);
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
      //Multiple Upload
      setSelectedMetadataFile(() => [
        {
          uid: file?.name,
          name: file?.name,
          status: "done",
          fileStatus: "new",
          url: genThumbUrl(file.originFileObj),
          thumbUrl: genThumbUrl(file.originFileObj),
        },
      ]);

      //Multiple Upload
      setMetadataFile(file.originFileObj);
    }
    return false;
  };

  // async function handleDownload(filename: string) {
  //   await sendRequest({
  //     fn: download({
  //       filename,
  //     }),
  //   });
  // }

  const handleRemove = (file: any) => {
    // Remove the file from the fileList state
    setSelectedMetadataFile([]);
    setMetadataFile("");
  };

  const dummyReq = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  function resetMetadataFile() {
    formik.resetForm();
    setMetadataFile("");
    setSelectedMetadataFile([]);
  }

  async function onSubmit(data: any) {
    //Default Attachment
    data.document = [];

    //Single Upload
    let uploadedFile = "";

    if (metadataFile !== "") {
      const formData = new FormData();

      //For single upload
      formData.append(`document`, metadataFile);

      const { success, message } = await sendRequest({
        fn: postBulkUploadFile(formData),
        formik,
      });

      if (success) {
        //Single Upload
        uploadedFile = message?.document[0]?.sysfnm;
        data.document.push(uploadedFile);

        if (data.document.length > 0) {
          const { success } = await sendRequest({
            fn: uploadMetadataFile(data),
            formik,
          });

          if (success) {
           
            setTimeout(() => {
              onClose();
              showModal(dispatch, {
                title: "Upload Metadata",
                message: "Metadata Uploaded.",
              });
            }, 200);
             //dispatch(refreshTable());
         }
        }
      } else {
        return;
      }
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      document: "",
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Notification Metadata Listing
            </Text>
            <Breadcrumbs
              breadcrumbItems={[
                {
                  title: "Notification Metadata Listing",
                },
              ]}
            />
          </Flex>
          <Box
            display={"flex"}
            alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
          >
            {/* {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.MTDA_UPLOAD) && (
                <Buttons
                  style={{ marginRight: "5px" }}
                  buttonDefaultType={"CUSTOM"}
                  buttonText="Upload Metadata (i2Go)"
                  bgColor={Colors.SUCCESS}
                  leftIcon={<AiOutlineCloudUpload size={20} />}
                  variant={"primary"}
                  sx={{ _hover: { backgroundColor: Colors.SUCCESS3 } }}
                  onclick={() => goUpload("test")}
                />
              )} */}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.MTDA_UPLOAD) && (
                <Buttons
                  style={{ marginRight: "5px" }}
                  buttonDefaultType={"CUSTOM"}
                  buttonText="Upload Metadata"
                  bgColor={Colors.SUCCESS}
                  leftIcon={<AiOutlineCloudUpload size={20} />}
                  variant={"primary"}
                  sx={{ _hover: { backgroundColor: Colors.SUCCESS3 } }}
                  onclick={() => goUpload("test")}
                />
              )}
            {homeData?.access &&
              checkAccessMatrix(homeData?.access, accessType.MTDA_ADD) && (
                <Buttons buttonDefaultType={"ADD"} onclick={() => goAdd()} />
              )}
          </Box>
        </Flex>
        <Card p={1} mt={4}>
          <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
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
                <Select
                  name="source"
                  onChange={sourceOnchange}
                  placeholder="Please Select Source"
                  value={source}
                >
                  {ddlData?.MDASRC?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="group"
                  onChange={groupOnchange}
                  placeholder="Please Select Group"
                  value={group}
                >
                  {ddlData?.MDAGRP?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="status"
                  onChange={statusOnchange}
                  placeholder="Please Select Status"
                  value={status}
                >
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
              </Space>
            </Box>
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={fetchMetadatas}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psmdasts: status,
              psmdagrp: group,
              psmdasrc: source,
            }}
            //onDoubleClick={showInfo}
            //length={pageSize}
          />
        </Card>
      </Box>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        onCloseComplete={() => resetMetadataFile()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Metadata</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={formik.handleSubmit}>
            <ModalBody pb={6}>
              <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
                width={"100%"}
              >
                <Box>
                  <Box display="flex" flexDir="column" gap={6}>
                    <FormControl
                      id="document"
                      isInvalid={
                        Boolean(formik.errors.document) &&
                        Boolean(formik.touched.document)
                      }
                    >
                      <FormLabel>Metadata Attachment</FormLabel>
                      <div>
                        <Dragger
                          name="file"
                          style={{ marginBottom: 10 }}
                          disabled={
                            selectedMetadataFile &&
                            selectedMetadataFile.length > 0
                              ? true
                              : false
                          }
                          fileList={
                            selectedMetadataFile
                              ? selectedMetadataFile
                              : undefined
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
                                  {/* {fileList.filter(
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
                                        onClick={() =>
                                          handleDownload(file?.uid)
                                        }
                                      />
                                    </Tooltip>
                                  )} */}
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
                      {formik.errors.document && (
                        <FormErrorMessage>
                          {formik.errors.document}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              </Card>
            </ModalBody>

            <ModalFooter>
              <Space size={"middle"}>
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} />
                <Buttons buttonDefaultType={"CLOSE"} onclick={onClose} />
              </Space>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

const RemoveDetail = (itemDesc: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{itemDesc}</Text>
    </Box>
  );
};
