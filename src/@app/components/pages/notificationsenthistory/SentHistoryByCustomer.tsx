// Chakra imports
import {
  Box,
  Flex,
  Text,
  Input,
} from "@chakra-ui/react";
// assets
import React, { useState } from "react";
import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import Card from "@app/components/common/Card/Card";
import Table from "@app/components/common/Table/Table";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { fetchHistoriesByCustomer } from "@app/redux/notificationSentHistory/slice";
import useFetchSentHistoriesByCustomer from "@app/hooks/selector/useFetchSentHistoryByCustomer";

export default function SentHistoryByCustomerPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Notification Sent History By Customer" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchSentHistoriesByCustomer();
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  const columns: any[] = [
    {
      title: "Notification Template",
      dataIndex: "prnottmp",
      key: "prnottmp",
      // render: (_: any, record: any) => (
      //   <Link color={Colors.PRIMARY} textDecoration={"underline"} onClick={() => goView(record?.id)}>{record?.psusrunm}</Link>
      // )
    },
    {
      title: "Title",
      dataIndex: "prnotttl",
      key: "prnotttl",
    },
    {
      title: "Type",
      dataIndex: "prnottypdsc",
      key: "prnottypdsc",
    },
    {
      title: "Recipients",
      dataIndex: "prnotrcv",
      key: "prnotrcv",
    },
    {
      title: "Sent At",
      dataIndex: "prnotdvd",
      key: "prnotdvd",
    },
  ];

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function fromOnchange(value: any) {
    setFrom(value);
  }

  function toOnchange(value: any) {
    setTo(value);
  }

  return (
    <>
      <Box>
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
                <DatePicker
                  id="from"
                  name="from"
                  placeholder="From Date"
                  className="w-full"
                  format={"DD/MM/YYYY"}
                  value={from}
                  onChange={fromOnchange}
                />
                <DatePicker
                  id="to"
                  name="to"
                  placeholder="To Date"
                  className="w-full"
                  format={"DD/MM/YYYY"}
                  value={to}
                  onChange={toOnchange}
                />
              </Space>
            </Box>
          </Flex>
          <Table
            rowKey="id"
            columns={columns}
            data={tableData}
            refreshFn={fetchHistoriesByCustomer}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              from_date: from,
              to_date: to,
            }}
            //onDoubleClick={showInfo}
            //length={pageSize}
          />
        </Card>
      </Box>
    </>
  );
}
