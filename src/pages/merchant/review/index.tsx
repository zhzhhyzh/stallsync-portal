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
import { Rate } from "antd";
import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import useFetchReviews from "@app/hooks/selector/useFetchReviews";
import {
  fetchReview,
  // getremoveReview,
} from "@app/redux/review/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import SubHeader from "@app/components/common/Header/SubHeader";

export default function ReviewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "Review" });
  const homeData = useAppSelector(selectHome);
  const id = String(router?.query.id);
  const name = String(router?.query.name);
  const rating = String(router?.query.rating);

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchReviews({ id });
  // const [ddlData] = useFetchDDL({ code: ["GTCAT"] });
  //pass tableData to table
  const [ddlData] = useFetchDDL({ code: ["YESORNO"] });
  const [search, setSearch] = useState();
  const [status, setStatus] = useState();

  const columns: any[] = [
    {
      title: "Comment Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Order Id",
      dataIndex: "psorduid",
      key: "psorduid",
    },


    {
      title: "Description",
      dataIndex: "psrvwdsc",
      key: "psrvwdsc",
    },


    {
      title: "Rating",
      dataIndex: "psrvwrtg",
      key: "psrvwrtg",
      render: (rating: any) => {
        const numericRating = parseFloat(rating) || 0;

        return (
          <Flex alignItems="center" gap={2}>
            <Rate allowHalf disabled defaultValue={numericRating} />
            {/* <Text fontSize="sm">{numericRating.toFixed(1)}</Text> */}
          </Flex>
        );
      },

    },




    // {
    //   title: "Active",
    //   dataIndex: "psmrcsts",
    //   key: "psmrcsts",
    //   render: (_: any, record: any) => (
    //     _ === "Y" ? <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
    //       width: 40,
    //       height: 20,
    //       backgroundColor: Colors.SUCCESS,
    //       borderRadius: 10
    //     }}>Yes</Text> : <Text fontWeight={"normal"} color={"white"} textAlign="center" style={{
    //       width: 40,
    //       height: 20,
    //       backgroundColor: Colors.DANGER,
    //       borderRadius: 10,
    //     }}>No</Text>
    //   )
    // },
    // {
    //   title: "Action",
    //   key: "action",
    //   align: "center",
    //   render: (_: any, record: any) => (
    //     <Flex justifyContent="flex-end">
    //       <Space size="small">
    //         {
    //           (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MCH_VIEW)) && (

    //             <Tooltip label='View' fontSize='sm'>

    //               <IconButton
    //                 variant="outline"
    //                 size={"sm"}
    //                 borderRadius={2}
    //                 colorScheme="teal"
    //                 sx={{ _hover: { backgroundColor: Colors.SUCCESS2, color: Colors.BACKGROUND } }}

    //                 icon={<AiFillEye />}
    //                 aria-label={"view"}
    //                 onClick={() => goView(record?.id)}
    //               />
    //             </Tooltip>
    //           )
    //         }
    //         {
    //           (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MCH_EDIT)) && (
    //             <Tooltip label='Edit' fontSize='sm'>
    //               <IconButton
    //                 variant="outline"
    //                 size={"sm"}
    //                 borderRadius={2}
    //                 colorScheme="yellow"
    //                 sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
    //                 icon={<BsPencil />}
    //                 aria-label={"edit"}
    //                 onClick={() => goEdit(record?.id)}
    //               />
    //             </Tooltip>

    //           )
    //         }
    //         {
    //           // todo
    //           (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MCH_DEL)) && (
    //             <Tooltip label='Delete' fontSize='sm'>
    //               <IconButton
    //                 variant="outline"
    //                 size={"sm"}
    //                 borderRadius={2}
    //                 colorScheme="red"
    //                 sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
    //                 icon={<IoTrash />}
    //                 aria-label={"delete"}
    //                 onClick={() => alertRemove(record?.id, record?.psmrcnme)}
    //               />
    //             </Tooltip>
    //           )
    //         }

    //         <TableMenu menus={[
    //           {
    //             url: `/Review/review`,
    //             query: {
    //               id: record?.id,
    //               // file: extra.file
    //             },
    //             label: "Review",
    //             breadcrumbRoute: [
    //               {
    //                 title: "Review",
    //                 href: `/Review`,// Add parameter if needed eg. /generalParameter/?id=123
    //               },
    //               {
    //                 title: "Review",
    //               },
    //             ]
    //           },   {
    //             url: `/maintLogs`,
    //             query: {
    //               id: record?.id,
    //               file: extra.file
    //             },
    //             label: "Maint Log",
    //             breadcrumbRoute: [
    //               {
    //                 title: "Review",
    //                 href: `/Review`,// Add parameter if needed eg. /generalParameter/?id=123
    //               },
    //               {
    //                 title: "Maintenance Log",
    //               },
    //             ]
    //           }
    //         ]} />

    //       </Space>
    //     </Flex>
    //   ),
    // },
  ];

  // function showInfo(record: any, index: number) {
  //   dispatch(
  //     openGlobalModal({
  //       title: "Function Account Detail",
  //       status: "custom",
  //       message: <ShowDetail data={record} />,
  //     })
  //   );
  // }

  // function alertRemove(id: string, desc: string) {

  //   dispatch(
  //     openGlobalModal({
  //       title: "",
  //       message: RemoveDetail(id, desc),
  //       status: "warning",
  //       actions: [
  //         {
  //           title: "Confirm",
  //           onClick: () => {
  //             onRemove(id);
  //           },

  //         },
  //         {
  //           title: "Cancel",
  //           isClose: true,
  //         },
  //       ],
  //     })
  //   );
  // }

  // async function onRemove(id: string) {
  //   const { success } = await sendRequest({
  //     fn: getremoveReview({ id }),
  //   });
  //   if (success) {

  //     setTimeout(() => {
  //       dispatch(refreshTable())
  //       showModal(dispatch, {
  //         title: "Remove item",
  //         message: "Removed",
  //       });
  //       router.push("/Review");
  //     }, 200);
  //   }
  // }

  // function goAdd() {
  //   router.push({
  //     pathname: "/Review/Detail",
  //     query: {
  //       id: "",
  //       mode: "ADD"
  //     },
  //   });
  // }

  // function goEdit(id: string) {
  //   router.push({
  //     pathname: "/Review/Detail",
  //     query: {
  //       id: id,
  //       mode: "EDIT"
  //     },
  //   });
  // }

  // function goView(id: string) {
  //   router.push({
  //     pathname: "/Review/Detail",
  //     query: {
  //       id: id,
  //       mode: "VIEW"
  //     },
  //   });
  // }

  function searchOnChange(event: any) {
    setSearch(event.target.value);
  }


  function statusOnChange(event: any) {
    setStatus(event.target.value);
  }



  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
          <Flex direction={"column"} alignSelf={"center"}>
            <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
              Review
            </Text>
            <Breadcrumbs breadcrumbItems={[
              {
                title: "Merchant",
                href: `/merchant/review`
              },
              {
                title: "Review"
              },
            ]} />
          </Flex>
          {/* <Box
            display={"flex"}
            alignSelf={"center"}
            pr={{
              base: 0,
              md: Spacing.containerPx,
            }}
          >
            {
              (homeData?.access && checkAccessMatrix(homeData?.access, accessType.MCH_ADD)) && (
                <Buttons
                  buttonDefaultType={"ADD"} onclick={() => goAdd()}
                />
              )
            }
          </Box> */}
        </Flex>
        <Card p={0} mt={4} mb={4}>
          <Flex flexDir={"column"} p={5}>
            {/* <Text fontWeight={"semibold"} pb={3}>
              Maintenance Log Infomation
            </Text> */}
            <SubHeader labelText="Merchant Infomation" />
            <Text>Merchant: {`${id} - ${name}` || ""}</Text>
            <Flex flexDir={"row"} >
              <Text pr={10}>Rating: {rating || "-"}</Text>
              <Text>Total Rating: {totalRecords || "-"}</Text>
            </Flex>

          </Flex>
        </Card>
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
                {/* <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                />

                <Select
                  name="Status"
                  onChange={statusOnChange}
                  placeholder="Please Select Review Status"
                  value={status}
                >
                  {ddlData?.YESORNO?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select> */}


              </Space>
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchReview}
            totalRecords={totalRecords}
            extraParams={{
              search: search,
              psmrcsts: status,
              id: id

            }}
          //onDoubleClick={showInfo}
          //length={pageSize}
          />
        </Card>
      </Box>
    </>
  );
}


const RemoveDetail = (item: string, itemDesc: string) => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Are you sure to delete this record?</Text>
      <Text>{item} - {itemDesc}</Text>
    </Box>
  )
};
