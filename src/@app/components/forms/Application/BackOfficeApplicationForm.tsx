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
  Highlight

} from "@chakra-ui/react";
// assets
import React, { useEffect, useState, CSSProperties } from "react";

import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import MemberProfileForm from "@app/components/forms/Application/MemberProfileForm";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal, openGlobalModal, selectHome,
} from "@app/redux/app/slice";
import type { DatePickerProps } from 'antd';
import { DatePicker, Form, Space, Tag } from 'antd';
import dayjs from "dayjs";
// import {
//   numberWithCommas,
//   parseThousandsToNumber,
//   numberPattern,
// } from "@app/utils/StringUtils";


import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/navigation";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
// import { FormikConfig, FormikTouched } from 'formik';
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";

import { getApplicationDetail, getApproveApplication, getManageApplication } from "@app/redux/application/slice";

import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";

// import { RewardsPromoSchema } from "../@schemas/rewardsPromoSchema";
import { CalendarIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import PeopleImage from "@app/assets/img/people-image.png"
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import DocumentListing from "./DocumentListing";
import Approval from "./Approval";
import { formatDate } from "@app/utils/DateUtils";
import HistoryTimeline from "./HistoryTimeline";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
// import CompanyForm from "./CompanyForm";
// import DocumentListing from "./DocumentListing";
// import EvaluationAndApproval from "./EvaluationAndApproval";
// import ApprovalHistory from "./ApprovalHistory";

export default function BackOfficeApplicationForm(props: any) {
  // const { sendRequest, loading } = useApi({ title: "Agent Application" });
  const router = useRouter();
  const id = props.id;
  const mode = props.mode;
  const status = props.status;
  const [tabIndex, setTabIndexx] = useState(0);
  const { sendRequest, loading: submissionLoading } = useApi({ title: "Application Submission" });
  const dispatch = useAppDispatch();

  // const [detailData] = useFetchApplicationDetail(id,tabIndex);
  const [showPassword, setShowPassword] = useState(false);
  const [formik, setFormik] = useState<any>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  const homeData = useAppSelector(selectHome);

  const [loading, setLoading] = useState(false)


  // useEffect(() => {
  //   console.log("ID",id);
  //   if (mode !== "ADD" && id) {
  //     console.log(detailData,"HEHEx ")

  //     if (Object.keys(detailData).length === 0) formik?.resetForm();

  //     if (Object.keys(detailData).length > 0) {
  //       formik?.setValues({
  //         ...detailData,
  //         id: detailData?.id,
  //       });
  //     }
  //   }
  // }, [mode, id, detailData, formik?.resetForm, formik?.setValues]);


  // async function onSubmit(data: any) {
  //   const { success } = await sendRequest({
  //     fn: getApplicationDetail(data
  //     ),
  //     formik,
  //   });

  //   if (success) {
  //     setTimeout(() => {
  //       showModal(dispatch, {
  //         title: mode !== "ADD" ? "Update Record" : "Add Record",
  //         message: mode !== "ADD" ? "Record Updated" : "Record Added",
  //       });
  //       router.back();
  //     }, 200);
  //   }
  // }const router = useRouter()

  function submissionAlert2(dispatch: any) {
  
    dispatch(
      openGlobalModal({
        title: "Submission Confirmation",
        message: ConfirmDetail(),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: async () => {
              const { result, message: resData } = await sendRequest({
                fn: getManageApplication({
                 
                }),
              });
              if (result == "success") {
                const { result: result2, message } = await sendRequest({
                  fn: getApproveApplication({})
                });
                if (result2 == "success") {
                  setTimeout(() => {
                    showModal(dispatch, {
                      title: "Submit Application",
                      message: (
                        <>
                          Application with Ref No <b>{resData?.application_number}</b>
                          <br />
                          has been submitted for review.
                        </>
                      ),
                    });
                    // if(mode === "ADD")  router.back();
                    // else reset()
                    // router.push({
                    //   pathname: "/application/Detail",
                    //   query: {
                    //     id: resData?.application_number,
                    //     mode: "EDIT",
                    //     status: resData?.application_status,
                    //   },
                    // });
                    router.push( `/application` )
                  }, 200);
                }
  
              }; dispatch(closeGlobalModal())
            },
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

  return (
    <form onSubmit={formik?.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} flex={mode === "EDIT" ? 1 : undefined} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Application Detail
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Application Listing",
              href: homeData?.psusrtyp === "ADM" ? `/application` : "/applicationAgent",
            },
            {
              title: "Application Detail (" + mode + ")",
            },
          ]}
          />
        </Flex>

        <Box
          flex={mode === "EDIT" ? 0.95 : undefined}
          display={"flex"}
          justifyContent={"space-between"}
          alignSelf={"center"}
          pr={{
            base: 0,
            md: Spacing.containerPx,
          }}
          gap={6}
        >
          {mode === "EDIT" && <Space size="small">
            <Flex
              mr={42} flexDir="row" fontSize="sm" gap={2}>

              <Flex flexDir="column" whiteSpace={"nowrap"} >
                {/* <Text fontWeight={"black"}>{headerInfo?.name}</Text> */}
                <Text>Application No:</Text>
                <Text>Application Date:</Text>
                <Text>Application Status:</Text>

              </Flex>
              <Flex flexDir="column" whiteSpace={"nowrap"} >
                <Text fontWeight={"black"}>{headerInfo?.number}</Text>
                <Text fontWeight={"black"}>{headerInfo?.date}</Text>
                <Text fontWeight={"black"}>{headerInfo?.status}</Text>

              </Flex>
            </Flex>
          </Space>
          }  <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={tabIndex===0?homeData?.psusrtyp==="AGT"?()=>router.push('/applicationAgent'):()=>router.push('/application'):()=>setTabIndexx(0)} />
            {
              tabIndex !== 1 && mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} onClick={() => formik.setFieldValue("submitAction", "save")} />

              )}
            {
              tabIndex === 1 && mode && mode !== "VIEW" && (
                <Buttons buttonDefaultType={"SAVE"} buttonLoading={loading} onClick={() => formik.setFieldValue("submitAction", "save")} />

              )}
            {tabIndex === 0 && mode && mode === "EDIT" && detailData?.editable && detailData?.psaplsts === "NEW" && (
              <Buttons onClick={() => { formik.setFieldValue("submitAction", "submit"); submissionAlert(dispatch, formik) }}
                buttonDefaultType={"CUSTOM"} buttonLoading={loading} buttonText="Submit" />
            )}
            {tabIndex === 1 && mode && mode === "EDIT" && detailData?.editable && detailData?.psaplsts === "NEW" && (
              <Buttons onClick={() => { submissionAlert(dispatch, formik) }}
                buttonDefaultType={"CUSTOM"} buttonLoading={loading} buttonText="Submit" />
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
              {mode !== "ADD" && <>    <CustomTabs label="Documents" index={1} selectedTabIndex={tabIndex} />
                {homeData?.psusrtyp === "ADM" && <CustomTabs label="Approval" index={2} selectedTabIndex={tabIndex} />}

                <CustomTabs label="History" index={homeData?.psusrtyp === "ADM" ? 3 : 2} selectedTabIndex={tabIndex} /></>
              }

            </TabList>
          </Flex>
        </Tabs>
      </Flex>

      {tabIndex === 0 ? (
        <MemberProfileForm submissionAlert={() => submissionAlert(dispatch, formik)} headerInfo={headerInfo} setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id} />
      ) : <> </>}
      {tabIndex === 1 ? (
        <DocumentListing setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id} />
      ) : <> </>}
      {(tabIndex === 2) && (homeData?.psusrtyp === "ADM" ? (
        <Approval setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id} />
      ) : (<HistoryTimeline setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id} />)
      )}     {tabIndex === 3 ? (
        <HistoryTimeline setLoading={setLoading} setDetailData={setDetailData} setHeaderInfo={setHeaderInfo} mode={mode} setFormik={setFormik} id={id} />
      ) : <> </>}


    </form >
  );
}


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

function submissionAlert(dispatch: any, formik: any) {

  dispatch(
    openGlobalModal({
      title: "Submission Confirmation",
      message: ConfirmDetail(),
      status: "warning",
      actions: [
        {
          title: "Confirm",
          onClick: () => { formik?.submitForm(); dispatch(closeGlobalModal()) },
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






const ConfirmDetail = () => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text >Make sure to submit your documents. Proceed?</Text>
      {/* <Text>{item} - {itemDesc}</Text> */}
    </Box>
  )
};