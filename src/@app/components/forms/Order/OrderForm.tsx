// Chakra imports
import Colors from "@app/constants/Colors";

import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Progress,
  Select,
  FormControl,
  Image,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  Menu,
  Circle,
  Icon,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  HStack,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Checkbox,
  Stack,
  Switch,
  InputGroup,
  Tooltip
} from "@chakra-ui/react";
import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined, ExportOutlined,
  FileOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";
const { Dragger } = Upload;
import SubHeader from "@app/components/common/Header/SubHeader";

import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// assets
import React, { useEffect, useState, useRef } from "react";
import { message, Upload, Typography, UploadFile } from 'antd';

import { DatePicker, Space, Tag, } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";
import { postBulkUploadFile } from "@app/redux/app/slice";

import { IoChevronBack, IoSave, IoAddSharp, IoCloseCircle } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import { download } from "@app/redux/app/slice";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getmanageMerchant, getmerchantDetail } from "@app/redux/merchant/slice";
import useFetchOrderDetail from "@app/hooks/selector/useFetchOrderDetail";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
// import { MerchantSchema } from "@app/components/forms/@schemas/merchantSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import useFetchDDLMchuser from "@app/hooks/selector/useFetchDDLMchuser";

// import ReactToPrint from "react-to-print";


import { useReactToPrint } from "react-to-print";
import { manageOrder } from "@app/redux/order/api";
// import { useRef } from "react";
import { FaClipboardList, FaDollarSign, FaTruckLoading, FaCheckCircle } from "react-icons/fa";

import { CheckIcon } from "@chakra-ui/icons";

export default function OrderForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Merchant" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;




  const [detailData, refetchOrderDetail] = useFetchOrderDetail(id);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });



  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  // const[id, setId] = useState("");
  const [status, setStatus] = useState("")
  const [statusDsc, setStatusDsc] = useState("")
  const [updatedAt, setUpdatedAt] = useState("")


  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      setName(detailData?.psmrcuiddsc)
      setAddress("Ground Floor, Bangunan Tan Sri Khaw Kai Boh (Block A), Jalan Genting Kelang, Setapak, 53300 Kuala Lumpur, Federal Territory of Kuala Lumpur")
      setEmail(detailData?.psmrceml);
      setPhone(detailData?.psmrcphn);
      if (detailData.psmbruid) {
        setClientName(detailData?.psmbruid + " - " + detailData?.psmbrnam);
      } else {
        setClientName(detailData?.psordpredsc + detailData?.psordphn);
      }
      setInvoiceDate(detailData?.psordodt);
      setInvoiceNumber(detailData?.psorduid);
      setStatus(detailData?.psordsts);
      setList(detailData?.psorditm);
      setTotal(detailData?.total)
      setUpdatedAt(detailData?.updatedAt);
      setStatusDsc(detailData?.psordstsdsc);

    }

  }, [detailData]);
  const steps = [
    { label: "New", icon: FaClipboardList, code: "N" },
    { label: "Paid", icon: FaDollarSign, code: "P" },
    { label: "Preparing", icon: FaTruckLoading, code: "A" },
    { label: "Completed", icon: FaCheckCircle, code: "D" },
  ];

  function OrderStatusBar({ status }: { status: string }) {
    const currentIndex = steps.findIndex((step) => step.code === status);

    return (
      <Box bg="white" borderRadius="xl" p={5} boxShadow="lg">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="bold" color="gray.600">
            ORDER <Text as="span" color="blue.500">{invoiceNumber}</Text>
          </Text>
          <Box textAlign="right">
            <Text fontSize="sm">invoice Date: <b>{invoiceDate}</b></Text>
          </Box>
        </Flex>

        <Flex position="relative" justify="space-between" align="center">
          {/* Line behind all steps */}
          <Box
            position="absolute"
            top="20px"
            left="5%"
            right="5%"
            height="2px"
            bg="gray.300"
            zIndex={0}
          >
            <Box
              width={`${(currentIndex) / (steps.length - 1) * 100}%`}
              height="100%"
              bg="purple.500"
            />
          </Box>

          {/* Step Icons */}
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            return (
              <Flex key={index} flex="1" direction="column" align="center" zIndex={1}>
                <Circle
                  size="10"
                  bg={isCompleted ? Colors.PRIMARY : "gray.300"}
                  color="white"
                >
                  {isCompleted ? <CheckIcon boxSize={4} /> : <Icon as={step.icon} boxSize={5} />}
                </Circle>
                <Text mt={2} fontSize="sm">{step.label}</Text>
              </Flex>
            );
          })}
        </Flex>

      </Box>
    );
  }

  async function onSubmit(data: any) {

    try {

      const response = await manageOrder({
        id: id,
        status: status,
        updatedAt: updatedAt,
      });

      // Assuming the response structure is like:
      // { httpCode: 200, result: "success", message: "Record has been updated" }
      if (response?.httpCode === 200 && response?.result === "success") {
        await refetchOrderDetail();
        setTimeout(() => {
          showModal(dispatch, {
            title: mode !== "ADD" ? "Update item" : "Add item",
            message: mode !== "ADD" ? "Record Updated" : "Record Added",
          });
        }, 200);
      } else {
        showModal(dispatch, {
          title: "Order Update",
          message: response?.message || "Unexpected Error",
          status: "error",
        });
      }
    } catch (err) {
      console.error("API error:", err);
      showModal(dispatch, {
        title: "Order Update",
        message: "Unexpected Error",
        status: "error",
      });
    }
  }

  async function onSubmitCancel(data: any) {

    try {

      const response = await manageOrder({
        id: id,
        // status: status,
        updatedAt: updatedAt,
      });

      // Assuming the response structure is like:
      // { httpCode: 200, result: "success", message: "Record has been updated" }
      if (response?.httpCode === 200 && response?.result === "success") {
        await refetchOrderDetail();
        setTimeout(() => {
          showModal(dispatch, {
            title: mode !== "ADD" ? "Update item" : "Add item",
            message: mode !== "ADD" ? "Record Updated" : "Record Added",
          });
        }, 200);
      } else {
        showModal(dispatch, {
          title: "Order Update",
          message: response?.message || "Unexpected Error",
          status: "error",
        });
      }
    } catch (err) {
      console.error("API error:", err);
      showModal(dispatch, {
        title: "Order Update",
        message: "Unexpected Error",
        status: "error",
      });
    }
  }

  return (
    <>

      <Flex justifyContent="space-between" alignItems="center" gap={5}  >

        <main
          className="w-4/5 m-5 p-5 grid grid-cols-1 xl:grid-cols-1 gap-10"
          style={{
            maxWidth: "1920px",
            margin: "auto",
          }}
        >


          {/* Invoice Preview */}
          <div className="invoice__preview bg-white p-5 rounded-2xl ">


            {/* <ReactToPrint
            trigger={() => (
              <button className="bg-blue-500 ml-5 text-white font-bold py-2 px-8 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400">
                Print / Download
              </button>
            )}
            content={() => contentRef.current}
          /> */}
            <div className="flex justify-end items-center gap-4 mb-4">
              {/* Print Button - Left of Back */}
              <button
                onClick={reactToPrintFn}
                style={{ backgroundColor: Colors.SUCCESS }}
                className="text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-all duration-150 hover:ring-4 hover:ring-blue-400"
              >
                Print / Download
              </button>

              {/* Back Button */}
              <Buttons
                buttonDefaultType="BACK"
                onclick={() => router.back()}
              />
            </div>
            <OrderStatusBar status={status} />


            <div ref={contentRef} className="p-5">

              <header className="print:block hidden flex-col items-center justify-center text-center mb-5">
                <h1 className="font-bold uppercase tracking-wide text-4xl mb-3">
                  Invoice - {statusDsc}
                </h1>
              </header>

              <section className="print:block hidden w-full flex flex-col items-start justify-start text-left">
                <p className="font- text-1xl uppercase mb-1">From:</p>
                <h2 className="font-bold text-3xl uppercase mb-1">{name}</h2>
                {address.split(',').map((line, index) => (
                  <p key={index}>{line.trim()}</p>
                ))}
              </section>


              <section className="mt-10">
                <p className="font- text-1xl uppercase mb-1">To:</p>

                <h2 className="text-2xl uppercase font-bold mb-1">{clientName}</h2>
              </section>

              <article className="print:block hidden mt-10 mb-14 flex items-end justify-start">
                <ul>
                  <li className="p-1 ">
                    <span className="font-bold">Invoice number:</span> {invoiceNumber}
                  </li>
                  <li className="p-1 bg-gray-100">
                    <span className="font-bold">Invoice date:</span> {invoiceDate}
                  </li>

                </ul>
              </article>

              <table width="100%" className="mb-10">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">No.</td>
                    <td className="font-bold">Description</td>
                    <td className="font-bold">Quantity</td>
                    <td className="font-bold">Price</td>
                    <td className="font-bold">Amount</td>
                    <td className="font-bold">Remarks</td>
                  </tr>
                </thead>
                {list.map(({ psitmcno, psprduid, psprdnme, psitmqty, psitmunt, psitmsbt, psitmrmk }) => (
                  <React.Fragment key={id}>
                    <tbody>
                      <tr className="h-10">
                        <td>{psitmcno}</td>
                        <td>{psprduid}-{psprdnme}</td>
                        <td>{psitmqty}</td>
                        <td>{psitmunt}</td>
                        <td>{psitmsbt}</td>
                        <td>{psitmrmk}</td>
                      </tr>
                    </tbody>
                  </React.Fragment>
                ))}
              </table>

              <div>
                <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
                  RM {total.toLocaleString()}
                </h2>
              </div>



              <footer className="footer border-t-2 border-gray-300 pt-5">
                <ul className="flex flex-col items-center justify-center gap-2">
                  <li>
                    <span className="font-bold">Your name:</span> {name}
                  </li>
                  <li>
                    <span className="font-bold">Your email:</span> {email}
                  </li>
                  <li>
                    <span className="font-bold">Phone number:</span> {phone}
                  </li>
                </ul>
              </footer>


              <p className="text-center px-5 mt-8 text-xs ">
                Powered by{" "}StallSync
                {/* <a
                href="https://tsbsankara.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Thomas Sankara
              </a> */}
              </p>

            </div>
            {/* Bottom Action Buttons */}
            {(status !== 'C' && status !== 'D') && (
              <div className="mt-5 flex flex-row gap-4">
                <button
                  onClick={onSubmit}
                  style={{ backgroundColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR }}
                  className="w-2/3 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-all duration-150 hover:ring-4 hover:ring-blue-400"
                >
                  Update Status
                </button>
                {
                  (status != 'A' && status != 'D') && (
                    <button
                      onClick={onSubmitCancel}
                      className="w-1/3 text-red-700 font-bold py-2 px-4 rounded border border-red-400 hover:bg-red-200 transition-all duration-150"
                    >
                      Cancel Order
                    </button>
                  )
                }
              </div>
            )}


          </div>
        </main>


      </Flex>
    </>
  );
}

