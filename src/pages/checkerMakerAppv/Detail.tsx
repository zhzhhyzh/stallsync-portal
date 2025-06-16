// import TestReceiverForm from "@app/components/forms/TestReceiver/TestReceiverForm";
// import MemberCard from "@app/components/pages/rewards/MemberCard";
import useFetchRequestDetail from "@app/hooks/selector/useFetchRequestDetail";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
// import RewardsTransForm from "@app/components/forms/Rewards/RewardsTransForm";
import ApprovalInformationForm from "@app/components/forms/Rewards/ApprovalInformationForm";
import { ChkMkrAppvSchema } from "@app/components/forms/@schemas/chkMkrAppvSchema";

import { Box, Flex, Text } from "@chakra-ui/react";

import useApi from "@app/hooks/useApi";
import { DatePicker, Form, Space, Tag } from "antd";
import Buttons from "@app/components/common/Buttons/Buttons";
import Spacing from "@app/constants/Spacing";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import dayjs from "dayjs";
import { fetchApproveRequest } from "@app/redux/request/slice";
import { showModal } from "@app/helpers/modalHelper";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
// import VehicleRequestForm from "@app/components/forms/Rewards/VehicleRequestForm";

export default function Detail() {
  const router = useRouter();
  const id = String(router.query?.id);
  const mode = String(router.query?.mode);
  const myReq = Boolean(String(router.query?.myReq) === "true");
  const [detailData] = useFetchRequestDetail(id);
  const { sendRequest, loading } = useApi({ title: "Checker Maker Approval" });

  const initialValues = {
    psrwaccn: "",
    pstrxtcd: "",
    pstrxref: "",
    pstrxdat: dayjs(),
    pstrxamt: 0,
    pstrxexp: "",
    // userName:userName,
    pstrxrmk: "",
  };
  const addVehicleInitialValues = {
    psrwmuid: "",
    psrwmbnm: "",
    currentVehicleNo: 0,
    newRequestNo: 0,
    psrwmeml: "",
    psrwmphn: "",
  };
  const formik = useFormik({
    enableReinitialize: false,
    initialValues:
      detailData?.pscmkcde === "CTRX" ? initialValues : addVehicleInitialValues,
    // validationSchema: TranCodeSchema,
    onSubmit: (values) => {
      // onSubmit(values);
    },
  });

  const initialValues2 = {
    psrqtmkr: "",
    psrqtmkd: "",
    psrqtckr: "",
    psrqtrmk: "",
    psrqtsts: "",
    psrqtstd: dayjs(),
  };
  const formik2 = useFormik({
    enableReinitialize: false,
    initialValues: initialValues2,
    validationSchema: ChkMkrAppvSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  const dispatch: any = useAppDispatch();

  async function onSubmit(data: any) {
    data.psrqtbdy = detailData?.psrqtbdy;
    const { success } = await sendRequest({
      fn: fetchApproveRequest(data),
      formik: formik2,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: "Checker Maker Approval",
          message: "Record Updated",
        });
        router.back();
      }, 200);
    }
  }
  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      let requestBody: any = {};
      if (typeof detailData?.psrqtbdy == "string") {
        requestBody = JSON.parse(detailData?.psrqtbdy);
      }

      formik.setValues(requestBody);
      formik2.setValues({ ...detailData, id: detailData?.psrqtrfn });
    }
  }, [detailData]);

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        pl={4}
        pr={4}
        pt={4}
      >
        <Flex flexDir="column" alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Checker Maker Approval Detail
          </Text>
          <Breadcrumbs
            breadcrumbItems={[
              {
                title: "Checker Maker Approval Listing",
                href: "/checkerMakerAppv",
              },

              {
                title: "Check Maker Approval Detail",
              },
            ]}
          />
        </Flex>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            <Buttons
              buttonDefaultType={"SAVE"}
              buttonLoading={loading}
              onClick={formik2.submitForm}
            />
          </Space>
        </Box>
      </Flex>

      <ApprovalInformationForm
        detailData={detailData}
        formik={formik2}
        myReq={myReq}
      />

      <Space
        size="small"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          marginTop: Spacing.containerPx,
          paddingRight: Spacing.containerPx,
        }}
      >
        <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
        <Buttons
          buttonDefaultType={"SAVE"}
          buttonLoading={loading}
          onClick={formik2.submitForm}
        />
      </Space>
    </>
  );
}
