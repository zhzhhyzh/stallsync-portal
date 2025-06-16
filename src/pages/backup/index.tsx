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
  Link,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState } from "react";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiDownload, FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchBackupDatabase from "@app/hooks/selector/useFetchBackupDatabase";
import {
  fetchBackup, backupFile, downloadFile
} from "@app/redux/backup/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Buttons from "@app/components/common/Buttons/Buttons";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import dayjs from "dayjs";

export default function BackupDatabasePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHome);  
  const { sendRequest, loading } = useApi({ title: "Backup Database" });

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchBackupDatabase();
  const [ddlData] = useFetchDDL({ code: ["BCKMODE", "BCKSTS"] });
  //pass tableData to table
  // const [pageSize, setPageSize] = useState(10);
  // const [page, setPage] = useState(1);

  const [search, setSearch] = useState();
  const [mode, setMode] = useState();
  const [status, setStatus] = useState();
  const [fromToDate, setFromToDate] = useState([]);


  const { RangePicker } = DatePicker;

  const columns: any[] = [
    {
      title: "File",
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: "Mode",
      dataIndex: "modedsc",
      key: "modedsc",
    },
    {
      title: "Status",
      dataIndex: "statusdsc",
      key: "statusdsc",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: "5rem",
      render: (_: any, record: any) => (
        <Flex justifyContent="center">
          <Space size="small">
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.BACKUP_DOWNLOAD)) && record.status !== "FAL" && (
                <Tooltip label='Download' fontSize='sm'>
                  <IconButton
                    type="submit"
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY2, color: Colors.BACKGROUND } }}
                    icon={<FiDownload />}
                    aria-label={"download"}
                    onClick={() => triggerDownload(record.filename)}
                  />
                </Tooltip>
              )
            }

            {/* <IconButton
              variant="primary"
              icon={<FiDownload />}
              aria-label={"download"}
              onClick={() => triggerDownload}
            /> */}
          </Space>
        </Flex>
      ),
    },
  ];

  async function triggerDownload(filename: any) {
    const { success } = await sendRequest({
      fn: downloadFile({filename}),
    });

    dispatch(refreshTable());
    // downloadFile("backup/download", {
    //     filename: row.filename,
    //     t: new Date().getTime()
    // }, row.filename)
}


async function generateBackup() {
  dispatch(
    openGlobalModal({
      title: "Backup Database",
      message: <BackupDetail/>,
      status: "warning",
      actions: [
        {
          title: "Confirm",
          onClick: () => onBackUp(),
        },
        {
          title: "Cancel",
          isClose: true,
          props: {
            variant: "danger",
          },
        },
        // {
        //   title: "Cancel",
        //   isClose: true,
        // },
        // {
        //   title: "Backup",
        //   onClick: () => onBackUp(),
        //   props: {
        //     variant: "danger",
        //   },
        // },
      ],
    })
  );

}

async function onBackUp() {
  const { success } = await sendRequest({
    fn: backupFile({}),
  });
  // const { payload } = await dispatch(backupFile({
                        
  // }))
  if (success) {
    dispatch(refreshTable())
    setTimeout(() => {
      showModal(dispatch, {
        title: "Backup Database",
        message: "Backup Successful",
      });
    }, 200);
  }
}

 
  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }

  function statusOnChange(event: any) {
    setStatus(event.target.value);
  }

  function modeOnChange(event: any) {
    setMode(event.target.value);
  }

  function fromToDateOnChange(value: any) {
    setFromToDate(value);
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Backup Database
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Backup Database"
              },
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
            {
                (homeData?.access && checkAccessMatrix(homeData?.access, accessType.BACKUP_ADD)) && (
                  <Buttons 
                    buttonDefaultType={"CUSTOM"} onclick={() => generateBackup()} buttonText={"BACKUP NOW"} bgColor={Colors.SUCCESS}
                  />
                )
            }
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
                  name="mode"
                  onChange={modeOnChange}
                  placeholder="Please Select Mode"
                  value={mode}
                >
                  {ddlData?.BCKMODE?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <Select
                  name="status"
                  onChange={statusOnChange}
                  placeholder="Please Select Status"
                  value={status}
                >
                  {ddlData?.BCKSTS?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
                <RangePicker 
                  name="fromToDate" 
                  placeholder={["From", "To"]} 
                  format={'DD/MM/YYYY'}
                  onChange={fromToDateOnChange} 
                  allowEmpty={[true, true]}
                />
              </Space>
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchBackup}
            totalRecords={totalRecords}
            extraParams={{
              filename: search,
              mode: mode,
              status: status,
              from: fromToDate && fromToDate.length > 0 ? fromToDate[0] : null,
              to: fromToDate && fromToDate.length === 2 ? fromToDate[1] : null,
            }}

          />
        </Card>
      </Box>
    </>
  );
}


const BackupDetail = () => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER} /> */}
      <Text p={3}> {"Do you wish to perform daily backup as at " + new Date()}</Text>
    </Box>
  )
}

// (
//   <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
//     <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER} />
//     <Text p={3}> {"Do you wish to perform daily backup as at " + new Date()}</Text>
//   </Box>
// );