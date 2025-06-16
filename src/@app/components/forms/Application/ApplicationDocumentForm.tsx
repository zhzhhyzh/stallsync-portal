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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Textarea,
    Checkbox,
    Switch,
    Image,
    Tooltip,
} from "@chakra-ui/react";
import { message, Progress, Typography, Upload, UploadFile, } from 'antd';
import {
    DownloadOutlined,
    FolderViewOutlined,
    DeleteOutlined
} from '@ant-design/icons';
// import { postRemoveFile,postUploadFile } from "@app/redux/app/slice";

import {

    CloudUploadOutlined,
    FileOutlined,
    ExportOutlined,
} from '@ant-design/icons';

// assets
import React, { ReactNode, useEffect, useState } from "react";

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, download, openGlobalModal, postBulkUploadFile } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import { getApplicationDocDetail, getApplicationDocList, getManageApplicationDoc } from "@app/redux/application/slice";
import useFetchApplicationDocuments from "@app/hooks/selector/useFetchApplicationDocuments";
import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";
import useFetchApplicationDocDetail from "@app/hooks/selector/useFetchApplicationDocDetail";



export default function ApplicationDocumentForm(props: any) {
    const { sendRequest, loading } = useApi({ title: "Application Document" });
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = props.id;
    const filename = props.filename;
    const mode = props.mode;

    const { Dragger } = Upload;

    const [detailData] = useFetchApplicationDocDetail(filename);
    // const [entities] = useFetchDDLEntity();
    const [emailFile, setEmailFile] = useState<any[]>([]);
    const [selectedEmailFile, setSelectedEmailFile] = useState<
        UploadFile<any>[]
    >([]);
    const initialValues = {
        psaplref: id,
        psdocnme: "",
        psdocdsc: "",
        createdAt: dayjs(),

    };
    async function handleDownload(link: string, filename:string) {
        // await sendRequest({
        //     fn: download({
        //         filename,
        //     }),
        // });
        const response = await fetch(link);
        alert("HJAHAHAH")
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Set desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    //   const [ddlData] = useFetchDDL({ code: ["STATE", "ENTSTS"] });

    function genDocumentUrl(file_link: string) {
        // const hostname = process.env.NEXT_PUBLIC_API_URL;
        // // const nowTs = new Date().getTime();

        return file_link
    }


    const formik = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        // validationSchema: mode === "ADD" ? EntityAddSchema : EntityUpdateSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handleRemove = (file: any) => {
        // Remove the file from the fileList state
        setSelectedEmailFile(selectedEmailFile.filter((f: any) => f.uid !== file.uid));


        //For multiple upload
        setEmailFile(emailFile.filter((f: any) => f.uid !== file.uid));
    };
    const dummyReq = async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
    };
    useEffect(() => {
        // if(mode==="EDIT") setSubmit(formik.handleSubmit)
    }, [formik])

    useEffect(() => {
        if (mode !== "ADD" && filename) {
            if (Object.keys(detailData).length === 0) {
                formik.resetForm();
            }
            if (Object.keys(detailData).length > 0) {
                formik.setValues({
                    ...detailData,
                    id: detailData.psdocnme,
                    createdAt: dayjs(new Date(detailData.createdAt)),
                    //   psentkpd: detailData.psentkpd ? dayjs(formatDate(new Date(detailData.psentkpd), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
                    //   psentjdt: detailData.psentjdt ? dayjs(formatDate(new Date(detailData.psentjdt), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
                    //   psentdoi: detailData.psentdoi ? dayjs(formatDate(new Date(detailData.psentdoi), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
                    //   psentstd: detailData.psentstd ? dayjs(formatDate(new Date(detailData.psentstd), "DD/MM/YYYY"), "DD/MM/YYYY") : null,
                });

                //Set File
                if (
                    detailData?.psdocnme && detailData?.psdocnme !== ""
                ) {
                    //Reset selected file
                    setSelectedEmailFile([]);
                    setEmailFile([]);
                    formik.setFieldValue("psdocnme", detailData?.psdocnme)

                    //Multiple File
                    // (detailData?.attachments).forEach((fileItem: any) => {
                    setSelectedEmailFile((previousFile: any) => [
                        // ...previousFile,
                        {
                            uid: detailData?.psdocnme,
                            name: detailData?.original_filename,
                            status: "done",
                            fileStatus: "old",
                            url: genDocumentUrl(detailData?.document_link),
                            thumbUrl: genDocumentUrl(detailData?.document_link),
                            preview: genDocumentUrl(detailData?.document_link),
                        },
                    ]
                    );
                    // }
                    // console.log("HAHA",selectedEmailFile)
                    // );
                } else {
                    setSelectedEmailFile([]);
                }

            }
        }
    }, [detailData]);

    async function onSubmit(data: any) {
        //Default Attachment
        data.psdocnme = null
        //Multiple Upload
        let uploadedEmailFile: string[] = [];
        // if(emailFile.length<=0&&selectedEmailFile.length<=0) formik.setErrors({psdocnme:"Field is required"})
        if (emailFile.length > 0) {
            const formData = new FormData();


            //For Multiple upload purpose
            emailFile.forEach((fileItem, index) => {
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
                        (fileItem: any) => {
                            uploadedEmailFile.push(fileItem.sysfnm);
                        }
                    );
                }

                //Add Existing Uploaded File
                (selectedEmailFile).forEach(
                    (fileItem: any) => {
                        if (fileItem?.fileStatus === "old") uploadedEmailFile.push(fileItem.uid)
                    }
                );

                data.psdocnme = uploadedEmailFile[0];
            } else {
                return;
            }
        } else {
            (selectedEmailFile).forEach(
                (fileItem) => uploadedEmailFile.push(fileItem.uid)
            );
            data.psdocnme = uploadedEmailFile[0];
        }



        const { success } = await sendRequest({
            fn: getManageApplicationDoc({
                ...data, id: mode === "EDIT" ? filename : "",
            }),
            formik,
        });

        if (success) {
            setTimeout(async () => {
                showModal(dispatch, {
                    title: mode !== "ADD" ? "Update Record" : "Add Record",
                    message: mode !== "ADD" ? "Record Updated" : "Record Added",
                });
                props.onClose()
                await dispatch(getApplicationDocList({ psaplref: id }))
                // router.back();
            }, 200);
        }
    }
    const genThumbUrl = (file: any) => {
        return URL.createObjectURL(file);
    };
    // useEffect(() => {
    //   console.log(formik.errors)
    // }, [formik.errors])
    const handleFileUpload = ({ file }: { file: any }) => {
        if (file.size > 5242880) {
            showModal(dispatch, {
                title: "File Upload",
                message: "File size cannot be more than 5MB",
                status: "error",
            });
        } else {
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
                },
            ]);


            //Multiple Upload
            setEmailFile((previousFile: any) => [
                // ...previousFile,
                file.originFileObj]); //For multiple file
        }
        return false;
    };
    return (
        <form onSubmit={formik.handleSubmit} id="form1">
            {/* <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4} py={Spacing.gap}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Entity Group Organization
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Entity Code",
              href: `/entity`
            },
            {
              title: `Entity Group Organization Detail`
            }
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
            {
              mode && mode !== "VIEW" && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space>
        </Box>
      </Flex> */}

            <Flex flexDir="row" gap={Spacing.containerPx}>


                {/* <Card
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
        > */}

                <Box display="flex" flexDir="column" gap={5} width="100%">
                    {mode === "EDIT" && <Box display="flex" flexDir="row" gap={5} width="100%">

                        <FormControl
                            id="psdocnme"
                            isInvalid={Boolean(formik.errors.psdocnme) && Boolean(formik.touched.psdocnme)}
                            isReadOnly={true}
                            width="50%"
                        >
                            <FormLabel>Document ID</FormLabel>
                            <Input
                                placeholder={"Enter Document ID"}
                                type="text"
                                name="psdocnme"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.psdocnme || ""}
                                isDisabled={mode === "EDIT"}
                            />
                            {formik.errors.psdocnme && (
                                <FormErrorMessage>{formik.errors.psdocnme}</FormErrorMessage>
                            )}
                        </FormControl>

                    </Box>}
                    <Box display="flex" flexDir="row" gap={5} width="100%">

                        <FormControl
                            id="psdocdsc"
                            isInvalid={Boolean(formik.errors.psdocdsc) && Boolean(formik.touched.psdocdsc)}
                            isReadOnly={mode === "VIEW" ? true : false}
                        // width="50%"
                        >
                            <FormLabel>Document Description</FormLabel>
                            <Input
                                placeholder={"Enter Document Description"}
                                type="text"
                                name="psdocdsc"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.psdocdsc || ""}
                            // isDisabled={mode === "EDIT"}
                            />
                            {formik.errors.psdocdsc && (
                                <FormErrorMessage>{formik.errors.psdocdsc}</FormErrorMessage>
                            )}
                        </FormControl>


                    </Box>

                    <Box display="flex" flexDir="row" gap={5} width="100%">

                        <FormControl
                            id="createdAt"
                            isInvalid={Boolean(formik.errors.createdAt) && Boolean(formik.touched.createdAt)}
                        // isReadOnly={mode === "VIEW" ? true : false}
                        >
                            <FormLabel>Date Received</FormLabel>
                            <DatePicker
                                disabled style={{ width: '50%' }} value={formik.values.createdAt ? formik.values.createdAt : null} onChange={(date) => formik.setFieldValue('createdAt', date ? date : null)} />

                            {/* {formik.errors.createdAt && (
                  <FormErrorMessage>{formik.errors.createdAt as ReactNode}</FormErrorMessage>
                )} */}
                        </FormControl>

                    </Box>

                    <Box display="flex" flexDir="row" gap={5} width="100%">


                        <FormControl
                            id="attachments"
                            isInvalid={
                                Boolean(formik.errors.psdocnme) &&
                                Boolean(formik.touched.psdocnme)
                            }
                        >
                            <FormLabel>Attached Document</FormLabel>
                            <div>
                                <Dragger
                                    name="file"
                                    style={{ marginBottom: 10 }}
                                    disabled={mode === "VIEW" ? true : false}

                                    // disabled={
                                    //   selectedPushFile && selectedPushFile.length > 0
                                    //     ? true
                                    //     : false
                                    // }
                                    fileList={selectedEmailFile ? selectedEmailFile : undefined}
                                    onChange={(e: any) => handleFileUpload(e)}
                                    customRequest={dummyReq}
                                    itemRender={(originNode, file:any, fileList, action) => {
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
                                                            <Tooltip title="Download">
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
                                                                    onClick={() => handleDownload(file?.url, file?.name)}
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
                                                            onClick={() => window.open(file?.url, "_blank")}
                                                        // rev={undefined}
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
                                                                if (mode !== "VIEW") handleRemove(file);
                                                            }}
                                                        // rev={undefinsed}
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
                            {formik.errors.psdocnme && (
                                <FormErrorMessage>{formik.errors.psdocnme}</FormErrorMessage>
                            )}
                        </FormControl>

                    </Box>
                    <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
                        <Box>
                            <Space size="small">
                                <Buttons
                                    buttonDefaultType={"BACK"} onclick={() => {props.onClose(); props.setMode("EDIT")}}
                                />
                                {
                                    mode && mode !== "VIEW" && (
                                        <Buttons
                                            buttonDefaultType={"SAVE"} buttonLoading={loading}
                                        />
                                    )}
                            </Space>
                        </Box>
                    </Flex>
                </Box>


                {/* </Card> */}


            </Flex>




        </form>
    );
}

