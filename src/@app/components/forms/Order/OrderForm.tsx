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
  Image,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  Menu,
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
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
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
// import { useRef } from "react";



export default function OrderForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Merchant" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;




  const [detailData] = useFetchOrderDetail(id);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });


  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: initialValues,
  //   // validationSchema: MerchantSchema,
  //   onSubmit: (values) => {
  //     onSubmit(values);
  //   },
  // });

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


  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      setName(detailData?.psmrcuid + "-" + detailData?.psmrcuiddsc)
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
    }

  }, [detailData]);


  // async function onSubmit(data: any) {

  //   const { success } = await sendRequest({
  //     fn: getmanageMerchant({
  //       id: mode === "EDIT" ? data.id : "", ...data,
  //       psmrcsts: formik.values.psmrcsts ? "Y" : "N",
  //       // psmrcjdt: convertDateToString(new Date(data.psmrcjdt))
  //     }),
  //     formik,
  //   });

  //   if (success) {
  //     setTimeout(() => {
  //       showModal(dispatch, {
  //         title: mode !== "ADD" ? "Update item" : "Add item",
  //         message: mode !== "ADD" ? "Record Updated" : "Record Added",
  //       });
  //       router.back();
  //     }, 200);
  //   }
  // }
  // const componentRef = useRef(null);

  return (
    <>
      <main
        className="m-5 p-5 xl:grid grid-cols-2 gap-10 xl:items-start"
        style={{
          maxWidth: "1920px",
          margin: "auto",
        }}
      >
      

        {/* Invoice Preview */}
        <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">

          <button onClick={reactToPrintFn} className="bg-blue-500 ml-5 text-white font-bold py-2 px-8 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400">Print / Download</button>
          {/* <ReactToPrint
            trigger={() => (
              <button className="bg-blue-500 ml-5 text-white font-bold py-2 px-8 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400">
                Print / Download
              </button>
            )}
            content={() => contentRef.current}
          /> */}
          <div ref={contentRef} className="p-5">
            <header className="flex flex-col items-center justify-center text-center mb-5">
              <h1 className="font-bold uppercase tracking-wide text-4xl mb-3">
                Invoicer
              </h1>
            </header>


            <section className="w-full flex flex-col items-end justify-end text-right">
              <h2 className="font-bold text-3xl uppercase mb-1">{name}</h2>
              {address.split(',').map((line, index) => (
                <p key={index}>{line.trim()}</p>
              ))}
            </section>


            <section className="mt-10">
              <h2 className="text-2xl uppercase font-bold mb-1">{clientName}</h2>
            </section>

            <article className="mt-10 mb-14 flex items-end justify-end">
              <ul>
                <li className="p-1 ">
                  <span className="font-bold">Invoicer number:</span> {invoiceNumber}
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
              Invoicer is built by{" "}StallSync
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
        </div>
      </main>
    </>
  );
}

