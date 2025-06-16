// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Heading,
  Button,
  Select,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoArrowForward, IoChevronBack, IoMenu, IoTrash } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye, AiOutlineLeft } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, fetchMaintlogs, openGlobalModal, selectBreadcrumbInfo } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchMaintLogs from "@app/hooks/selector/useFetchMaintLogs";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";

export default function MaintLogsPage() {
  const router = useRouter();
  const breadcrumbInfo = useAppSelector(selectBreadcrumbInfo);
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const fileName = String(router.query?.file);
  const pstblnme = String(router.query?.pstblnme);
  const pstblkyn = String(router.query?.pstblkyn);

  console.log("pstblnme?", pstblnme);
  console.log("pstblkyn?", pstblkyn);

  const [tableData, refreshFn, totalData, tableLoading] = useFetchMaintLogs({ });

  const columns: any[] = [
    {
      title: "Field",
      dataIndex: "prfieldnme",
      key: "prfieldnme",
    },
    {
      title: "Previous Data",
      dataIndex: "prfldolddta",
      key: "prfldolddta",
    },
    {
      title: "New Data",
      dataIndex: "prfldnewdta",
      key: "prfldnewdta",
    },
    {
      title: "Action Data",
      dataIndex: "praction",
      key: "praction",
      render: (data: any) => {
          switch (data) {
              case 'A':
                  return <span className="text-green">ADD</span>;
              case 'C':
                  return <span className="text-yellow">CHANGE</span>;
              case 'D':
                  return <span className="text-red">DELETE</span>;
              default:
                  return <span>N/A</span>;
          }
      }
    },
    {
      title: "User",
      dataIndex: "prmntusr",
      key: "prmntusr",
    },
    {
      title: "Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
    }
  ];

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={10}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="500" mb={1}>
              Maintenance Logs
            </Text>
            <Breadcrumbs breadcrumbItems={breadcrumbInfo} />
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
            </Space>
          </Box>
        </Flex>
        <Card p={0} mt={4}>
          {
              <Table
                columns={columns}
                data={tableData}
                refreshFn={fetchMaintlogs}
                extraParams={{
                  file: fileName,
                  key: pstblnme + "-" + pstblkyn
                }}
                totalRecords={totalData}
              />
          }
        </Card>
      </Box>
    </>
  );
}