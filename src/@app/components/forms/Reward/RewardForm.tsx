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
  Switch,
  InputGroup,
  Stack,
  Tabs,
  TabList, Tooltip,
} from "@chakra-ui/react";
import Table from "@app/components/common/Table/Table";

import {
  DownloadOutlined,
  FolderViewOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { postUploadFile } from "@app/redux/app/slice";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import {
  fetchredemptions,

} from "@app/redux/reward/slice";
import {
  numberWithCommas,
  parseThousandsToNumber,
  numberPattern,
} from "@app/utils/StringUtils";
// assets
import React, { useEffect, useState } from "react";
import { message, Upload, } from 'antd';

import { DatePicker, Space, Tag, Select as AntdSelect, TimePicker, Typography } from "antd";
import Spacing from "@app/constants/Spacing";

import Card from "@app/components/common/Card/Card";

import { IoChevronBack, IoSave } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal } from "@app/redux/app/slice";
import useFetchDDLMerchants from "@app/hooks/selector/useFetchDDLMerchants";

import { showModal } from "@app/helpers/modalHelper";
import router, { useRouter } from "next/router";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { getmanageReward, getrewardDetail } from "@app/redux/reward/slice";
import useFetchRewardDetail from "@app/hooks/selector/useFetchRewardDetail";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { AiOutlineLeft } from "react-icons/ai";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
// import TextArea from "antd/es/input/TextArea";
import { api } from "@app/utils/AxiosUtils"
import { RewardSchema } from "@app/components/forms/@schemas/rewardSchema";
import dayjs from 'dayjs'
import { formatDate } from "@app/utils/DateUtils";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { useToast } from "@chakra-ui/react";
import useFetchRewardRedemptions from "@app/hooks/selector/useFetchRewardRedemptions";


export default function RewardForm(props: any) {
  const { sendRequest, loading } = useApi({ title: "Reward" });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = props.id;
  const mode = props.mode;

  const [detailData] = useFetchRewardDetail(id);
  const [ddlData1] = useFetchDDLMerchants();
  const [skillArr, setSkillArr] = useState<string[]>([]);

  const [tabIndex, setTabIndex] = useState(0)
  const toast = useToast()


  const initialValues = {



    psrwduid: null,
    psrwddsc: null,
    psrwdlds: null,
    psrwdsts: "",
    psrwdtyp: null,

    psrwdnme: "",
    psrwdfdt: "",
    psrwdtdt: "",
    psrwddva: "",
    psrwdmin: "",
    psrwdica: false,
    psrwdism: false,
    psrwdaam: true,
    psrwdqty: "",
    psrwdcap: "",




  };


  const [ddlData] = useFetchDDL({ code: ["YESORNO", "RWDSTS", "DISTYPE"] });
  const handleICAChange = () => {
    formik.setFieldValue("psrwdica", !formik.values.psrwdica);
  };
  const handleISMChange = () => {
    formik.setFieldValue("psrwdism", !formik.values.psrwdism);
  };
  const handleAAMChange = () => {
    const newValue = !formik.values.psrwdaam;
    formik.setFieldValue("psrwdaam", newValue);
    if (newValue) {
      setSkillArr([]); // clear merchant list when "Allow All Merchant" is true
    }
  };

  const autoUpdateRewardStatus = (from: any, to: any) => {
    if (!from || !to) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (fromDate <= today && today <= toDate) {
      formik.setFieldValue("psrwdsts", "A"); // Active
    } else if (today < fromDate) {
      formik.setFieldValue("psrwdsts", "I"); // Incoming
    } else {
      formik.setFieldValue("psrwdsts", "P"); // Past (optional)
    }
  };


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: RewardSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  useEffect(() => {
    if (mode !== "ADD" && id && Object.keys(detailData).length > 0) {
      formik.setValues({
        ...detailData,
        id: detailData.psrwduid,
        psrwdfdt: dayjs(detailData?.psrwdfdt),
        psrwdtdt: dayjs(detailData?.psrwdtdt),
        psrwdica: detailData?.psrwdica == "Y" ? true : false,
        psrwdism: detailData?.psrwdism == "Y" ? true : false,
        psrwdaam: detailData?.psrwdaam == "Y" ? true : false,
        psrwddtl: detailData?.psrwddtl ? setSkillArr(detailData?.psrwddtl) : setSkillArr([])
      });
    }
  }, [detailData]);

  async function onSubmit(data: any) {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const fromDate = new Date(data.psrwdfdt);
    const toDate = new Date(data.psrwdtdt);

    let rewardStatus = "I"; // Default: Incoming

    if (fromDate <= today && today <= toDate) {
      rewardStatus = "A"; // Active
    }

    const finalData = {
      ...data,
      psrwddtl: data.psrwdaam ? [] : skillArr,
      psrwdsts: rewardStatus,

      psrwdaam: formik.values.psrwdaam ? "Y" : "N",
      psrwdica: formik.values.psrwdica ? "Y" : "N",
      psrwdism: formik.values.psrwdism ? "Y" : "N",
    };

    const { success } = await sendRequest({
      fn: getmanageReward({
        id: mode === "EDIT" ? data.id : "",
        ...finalData,
      }),
      formik,
    });

    if (success) {
      setTimeout(() => {
        showModal(dispatch, {
          title: mode !== "ADD" ? "Update item" : "Add item",
          message: mode !== "ADD" ? "Record Updated" : "Record Added",
        });
        router.back();
      }, 200);
    }
  }

  // Second tab - List

  const [tableData, refreshFn, totalRecords, extra] = useFetchRewardRedemptions({});
  const columns: any[] = [
    {
      title: "Order Id",
      dataIndex: "psorduid",
      key: "psorduid",
    },
    {
      title: "Order Date",
      dataIndex: "psordodt",
      key: "psordodt",
    },

    {
      title: "Member Redeem",
      dataIndex: "psmbruid",
      key: "psmbruid",
      render: (_: any, record: any) => (
        // <Text>{`${record.psrwdtypdsc}`}</Text>
        <Text>{`${record.psmbruid} - ${record.psmbrnam}`}</Text>

      )
    }

  ];
  const [dateError, setDateError] = useState(false);

  const [tempFromDate, setTempFromDate] = useState<any>();
  const [tempToDate, setTempToDate] = useState<any>();
  useEffect(() => {
    if (tempToDate && tempFromDate && tempToDate < tempFromDate)
      setDateError(true);
    else setDateError(false);
  }, [tempFromDate, tempToDate]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Reward
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Reward",
              href: `/tranCode`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: "Reward (" + mode + ")",
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
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && tabIndex == 0 && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space>
        </Box>
      </Flex>
      {mode != "ADD" && <Flex mt={4} bgColor="#fff" py={2}>
        <Tabs
          index={tabIndex}
          onChange={(index) => {
            let same = true;



            setTabIndex(index)






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
              <CustomTabs label="Reward Detail" index={0} selectedTabIndex={tabIndex} />
              <CustomTabs label="Reward Redemption" index={1} selectedTabIndex={tabIndex} />


            </TabList>
          </Flex>
        </Tabs>
      </Flex>}
      {tabIndex == 0 &&
        <Card
          p={4}
          mt={`${Spacing.containerPx}`}
          className="grid grid-cols-1 gap-6"
        >
          <Box>
            <div className="flex flex-col sm:flex-row gap-6">
              <Box display="flex" flexDir="column" gap={6} width="100%">
                <Flex justifyContent="space-between" alignItems="center" gap={5}>

                  <FormControl
                    id="psrwduid"
                    isInvalid={Boolean(formik.errors.psrwduid) && Boolean(formik.touched.psrwduid)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Reward*</FormLabel> */}
                    <CustomFormLabel labelText="Reward Code" />
                    <Input
                      placeholder={"Enter Reward Code"}
                      type="text"
                      name="psrwduid"
                      onChange={formik.handleChange}
                      value={formik.values.psrwduid || ""}
                      isDisabled={mode === "EDIT"}
                    />
                    {formik.errors.psrwduid && (
                      <FormErrorMessage>{formik.errors.psrwduid}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    id="psrwdnme"
                    isInvalid={Boolean(formik.errors.psrwdnme) && Boolean(formik.touched.psrwdnme)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {/* <FormLabel>Description*</FormLabel> */}
                    <CustomFormLabel labelText="Reward Name" />
                    <Input
                      placeholder={"Enter Reward Name"}
                      type="text"
                      name="psrwdnme"
                      onChange={formik.handleChange}
                      value={formik.values.psrwdnme || ""}
                    />
                    {formik.errors.psrwdnme && (
                      <FormErrorMessage>{formik.errors.psrwdnme}</FormErrorMessage>
                    )}
                  </FormControl>

                </Flex>
                <FormControl
                  id="psrwddsc"
                  isInvalid={Boolean(formik.errors.psrwddsc) && Boolean(formik.touched.psrwddsc)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  {/* <FormLabel>Description*</FormLabel> */}
                  <CustomFormLabel labelText="Description" />
                  <Input
                    placeholder={"Enter Description"}
                    type="text"
                    name="psrwddsc"
                    onChange={formik.handleChange}
                    value={formik.values.psrwddsc || ""}
                  />
                  {formik.errors.psrwddsc && (
                    <FormErrorMessage>{formik.errors.psrwddsc}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  id="psrwdlds"
                  isInvalid={Boolean(formik.errors.psrwdlds) && Boolean(formik.touched.psrwdlds)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Local Description</FormLabel>
                  <Input
                    placeholder={"Enter Local Description"}
                    type="text"
                    name="psrwdlds"
                    onChange={formik.handleChange}
                    value={formik.values.psrwdlds || ""}
                  />
                  {formik.errors.psrwdlds && (
                    <FormErrorMessage>{formik.errors.psrwdlds}</FormErrorMessage>
                  )}
                </FormControl>


                <FormControl
                  id="psrwdsts"
                  isInvalid={Boolean(formik.errors.psrwdsts) && Boolean(formik.touched.psrwdsts)}
                  isReadOnly={mode === "VIEW" ? true : false}
                >
                  <FormLabel>Reward Status</FormLabel>
                  {/* <CustomFormLabel labelText="Reward Status" /> */}
                  <Select
                    placeholder="Select Reward Status"
                    value={formik.values.psrwdsts || ""}
                    onChange={formik.handleChange}
                    style={{
                      fontSize: 14,
                    }}
                    isDisabled
                  >
                    {ddlData?.RWDSTS?.map((option: DDL_TYPES) => ( //change code
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psrwdsts && (
                    <FormErrorMessage>{formik.errors.psrwdsts}</FormErrorMessage>
                  )}
                </FormControl>
                <Flex justifyContent="space-between" alignItems="center" gap={5}>

                  <FormControl
                    id="psrwdtyp"
                    isInvalid={Boolean(formik.errors.psrwdtyp) && Boolean(formik.touched.psrwdtyp)}
                  >
                    {/* <FormLabel>Affect Code 1*</FormLabel> */}
                    <CustomFormLabel labelText="Reward Type" />
                    <Select
                      placeholder="Select Reward Type"
                      value={formik.values.psrwdtyp || ""}
                      onChange={formik.handleChange}
                      style={{
                        fontSize: 14,
                      }}
                    // isDisabled={mode === "VIEW" ? true : false}
                    >
                      {ddlData?.DISTYPE?.map((option: DDL_TYPES) => ( //change code
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>{formik.errors.psrwdtyp && (
                      <FormErrorMessage>{formik.errors.psrwdtyp}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    id="psrwddva"
                    isInvalid={Boolean(formik.errors.psrwddva) && Boolean(formik.touched.psrwddva)}
                    isReadOnly={mode == "VIEW" || !formik.values.psrwdtyp}
                  >
                    {
                      formik.values.psrwdtyp ? <CustomFormLabel labelText="Discount Value" /> : <FormLabel>Discount Value</FormLabel>
                    }



                    <Stack spacing={4}>
                      <InputGroup>

                        <Input
                          type="text"
                          name="psrwddva"
                          placeholder={formik.values.psrwdtyp == "P" ? "0.1234" : formik.values.psrwdtyp == "V" ? "345.34" : "Enter Discount Value"}
                          value={numberWithCommas(formik.values.psrwddva)}
                          pattern={numberPattern}
                          onChange={(event) => {
                            const value = event.target.value;

                            // Check if the value is a valid number or empty
                            if (!value || /^[0-9.,]*$/.test(value)) {
                              formik.handleChange({
                                target: {
                                  value: parseThousandsToNumber(value),
                                  name: "psrwddva",
                                },
                              });
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psrwddva && (
                      <FormErrorMessage>{formik.errors.psrwddva}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>




              </Box>

              <Box display="flex" flexDir="column" gap={6} width="100%">

                <FormControl
                  id="psrwdqty"
                  isInvalid={Boolean(formik.errors.psrwdqty) && Boolean(formik.touched.psrwdqty)}
                  isReadOnly={mode == 'VIEW'}
                >
                  {/* <FormLabel>Quantity</FormLabel> */}
                  <CustomFormLabel labelText="Quantity" />
                  <Stack spacing={4}>
                    <InputGroup>

                      <Input
                        type="text"
                        name="psrwdqty"
                        placeholder="Enter Quantity"
                        value={numberWithCommas(formik.values.psrwdqty)}
                        pattern={numberPattern}
                        onChange={(event) => {
                          const value = event.target.value;

                          // Check if the value is a valid number or empty
                          if (!value || /^[0-9.,]*$/.test(value)) {
                            formik.handleChange({
                              target: {
                                value: parseThousandsToNumber(value),
                                name: "psrwdqty",
                              },
                            });
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </InputGroup>
                  </Stack>
                  {formik.errors.psrwdqty && (
                    <FormErrorMessage>{formik.errors.psrwdqty}</FormErrorMessage>
                  )}
                </FormControl>

                <Flex justifyContent="space-between" alignItems="center" gap={5}>


                  <FormControl
                    id="psrwdism"
                    w={"49%"}
                    isInvalid={
                      Boolean(formik.errors.psrwdism) &&
                      Boolean(formik.touched.psrwdism)
                    }
                    isReadOnly={mode == "VIEW" ? true : false}
                  >
                    <FormLabel>Minimum Spend</FormLabel>
                    <Switch
                      id="psrwdism"
                      name="psrwdism"
                      isChecked={formik.values.psrwdism}
                      onChange={handleISMChange}
                      onBlur={formik.handleBlur}
                      size="lg"
                      colorScheme={"green"}
                      sx={{
                        "span.chakra-switch__track:not([data-checked])": {
                          backgroundColor: Colors.DANGER,
                        },
                      }}
                      mt={1}
                    />
                    {formik.errors.psrwdism && (
                      <FormErrorMessage>
                        {formik.errors.psrwdism}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psrwdmin"
                    isInvalid={Boolean(formik.errors.psrwdmin) && Boolean(formik.touched.psrwdmin)}
                    isReadOnly={mode == "VIEW" || !formik.values.psrwdism}
                  >
                    {

                      formik.values.psrwdism ? <CustomFormLabel labelText="Minimum Amount" /> : <FormLabel>Minimum Amount</FormLabel>
                    }

                    <Stack spacing={4}>
                      <InputGroup>

                        <Input
                          type="text"
                          name="psrwdmin"
                          placeholder="Enter Minimum Amount"
                          value={numberWithCommas(formik.values.psrwdmin)}
                          pattern={numberPattern}
                          onChange={(event) => {
                            const value = event.target.value;

                            // Check if the value is a valid number or empty
                            if (!value || /^[0-9.,]*$/.test(value)) {
                              formik.handleChange({
                                target: {
                                  value: parseThousandsToNumber(value),
                                  name: "psrwdmin",
                                },
                              });
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psrwdmin && (
                      <FormErrorMessage>{formik.errors.psrwdmin}</FormErrorMessage>
                    )}
                  </FormControl>

                </Flex>
                <Flex justifyContent="space-between" alignItems="center" gap={5}>
                  <FormControl
                    id="psrwdica"
                    w={"49%"}
                    isInvalid={
                      Boolean(formik.errors.psrwdica) &&
                      Boolean(formik.touched.psrwdica)
                    }
                    isReadOnly={mode == "VIEW" ? true : false}
                  >
                    <FormLabel>Capped Spend</FormLabel>
                    <Switch
                      id="psrwdica"
                      name="psrwdica"
                      isChecked={formik.values.psrwdica}
                      onChange={handleICAChange}
                      onBlur={formik.handleBlur}
                      size="lg"
                      colorScheme={"green"}
                      sx={{
                        "span.chakra-switch__track:not([data-checked])": {
                          backgroundColor: Colors.DANGER,
                        },
                      }}
                      mt={1}
                    />
                    {formik.errors.psrwdica && (
                      <FormErrorMessage>
                        {formik.errors.psrwdica}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psrwdcap"
                    isInvalid={Boolean(formik.errors.psrwdcap) && Boolean(formik.touched.psrwdcap)}
                    isReadOnly={mode == "VIEW" || !formik.values.psrwdica}
                  >
                    {

                      formik.values.psrwdica ? <CustomFormLabel labelText="Capped Amount" /> : <FormLabel>Capped Amount</FormLabel>
                    }

                    <Stack spacing={4}>
                      <InputGroup>

                        <Input
                          type="text"
                          name="psrwdcap"
                          placeholder="Enter Capped Amount"
                          value={numberWithCommas(formik.values.psrwdcap)}
                          pattern={numberPattern}
                          onChange={(event) => {
                            const value = event.target.value;

                            // Check if the value is a valid number or empty
                            if (!value || /^[0-9.,]*$/.test(value)) {
                              formik.handleChange({
                                target: {
                                  value: parseThousandsToNumber(value),
                                  name: "psrwdcap",
                                },
                              });
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                      </InputGroup>
                    </Stack>
                    {formik.errors.psrwdcap && (
                      <FormErrorMessage>{formik.errors.psrwdcap}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>

                <Flex justifyContent="space-between" alignItems="center" gap={5}>

                  <FormControl
                    id="psrwdfdt"
                    isInvalid={
                      Boolean(formik.errors.psrwdfdt) &&
                      Boolean(formik.touched.psrwdfdt)
                    }
                  //    isReadOnly
                  >
                    <FormLabel>From Date</FormLabel>
                    <DatePicker disabled={mode === "VIEW"}
                      format={"DD/MM/YYYY"}
                      style={{ width: "100%" }}
                      value={
                        formik.values.psrwdfdt
                          ? dayjs(formik.values.psrwdfdt)
                          : null
                      }
                      onChange={(value) => {
                        formik.setFieldValue("psrwdfdt", value);
                        autoUpdateRewardStatus(value, formik.values.psrwdtdt);
                      }}

                      onBlur={formik.handleBlur}
                    // disabled={true}
                    />
                    {formik.errors.psrwdfdt && (
                      <FormErrorMessage>{formik.errors.psrwdfdt}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    id="psrwdtdt"
                    isInvalid={
                      Boolean(formik.errors.psrwdtdt) &&
                      Boolean(formik.touched.psrwdtdt)
                    }
                  //    isReadOnly
                  >
                    <FormLabel>To Date</FormLabel>
                    <DatePicker disabled={mode === "VIEW"}
                      format={"DD/MM/YYYY"}
                      style={{ width: "100%" }}
                      value={
                        formik.values.psrwdtdt
                          ? dayjs(formik.values.psrwdtdt)
                          : null
                      }
                      onChange={(value) => {
                        formik.setFieldValue("psrwdtdt", value);
                        autoUpdateRewardStatus(formik.values.psrwdfdt, value);
                      }}

                      onBlur={formik.handleBlur}
                    // disabled={true}
                    />
                    {formik.errors.psrwdtdt && (
                      <FormErrorMessage>{formik.errors.psrwdtdt}</FormErrorMessage>
                    )}
                  </FormControl>
                </Flex>


                <Flex justifyContent="space-between" alignItems="center" gap={5}>



                  <FormControl
                    id="psrwdaam"
                    w={"49%"}
                    isInvalid={
                      Boolean(formik.errors.psrwdaam) &&
                      Boolean(formik.touched.psrwdaam)
                    }
                    isReadOnly={mode == "VIEW" ? true : false}
                  >
                    <FormLabel whiteSpace={"nowrap"}>Allow All Merchant</FormLabel>
                    <Switch
                      id="psrwdaam"
                      name="psrwdaam"
                      isChecked={formik.values.psrwdaam}
                      onChange={handleAAMChange}
                      onBlur={formik.handleBlur}
                      size="lg"
                      colorScheme={"green"}
                      sx={{
                        "span.chakra-switch__track:not([data-checked])": {
                          backgroundColor: Colors.DANGER,
                        },
                      }}
                      mt={1}
                    />
                    {formik.errors.psrwdaam && (
                      <FormErrorMessage>
                        {formik.errors.psrwdaam}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    // id="psrwddtl"
                    // isInvalid={Boolean(formik?.errors.psrwddtl)}
                    isReadOnly={mode === "VIEW" ? true : false}
                  >
                    {
                      formik.values.psrwdaam ? <FormLabel>Merchant Included</FormLabel> : <CustomFormLabel labelText="Merchant Included" />
                    }

                    <AntdSelect
                      mode="multiple"
                      disabled={mode === "VIEW" || formik.values.psrwdaam == true ? true : false}

                      style={{ width: '100%' }}
                      placeholder="Please Select Skill"
                      onChange={setSkillArr}
                      value={skillArr}
                      options={Array.isArray(ddlData1)
                        ? ddlData1.map((item: any) => ({
                          label: item.psmrcnme,
                          value: item.psmrcuid,
                        }))
                        : []}
                    />
                    {/* {formik?.errors.psrwddtl && (
                      <FormErrorMessage>{formik?.errors.psrwddtl}</FormErrorMessage>
                    )} */}
                  </FormControl>
                </Flex>
              </Box>






            </div>
          </Box>
        </Card>
      }
      {tabIndex == 1 && mode != "ADD" &&
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
                <Box display="flex" flexDir={"row"} gap={4} alignItems={"center"}>
                  <Text minW={"35%"}>From Date</Text>

                  <DatePicker
                    format="DD/MM/YYYY"
                    className="w-full"
                    placeholder="From Date"
                    onChange={(d) => {
                      // @ts-ignore
                      // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempFromDate(formatDate(d))
                      // else setTempFromDate("")
                      setTempFromDate(d);
                    }}
                    value={tempFromDate}
                  />
                  {/* <RangePicker style={{ width: '100%' }} placeholder={['From Date', 'To Date']} /> */}
                </Box>
                <FormControl isInvalid={dateError}>
                  <Box display="flex" flexDir="column">
                    <Box
                      display="flex"
                      flexDir={"row"}
                      gap={4}
                      alignItems={"center"}
                    >
                      <Text minW={"35%"}>To Date</Text>

                      <DatePicker
                        format="DD/MM/YYYY"
                        className="w-full"
                        placeholder="To Date"
                        onChange={(d) => {
                          // @ts-ignore
                          // if (new Date(formatDate(d)) instanceof Date && !isNaN(new Date(formatDate(d)))) setTempToDate(formatDate(d))
                          // else setTempToDate("")

                          setTempToDate(d);
                        }}
                        value={tempToDate}
                      />
                    </Box>
                    {dateError && (
                      <FormErrorMessage>
                        {"From Date cannot be greater than To Date"}
                      </FormErrorMessage>
                    )}
                  </Box>
                </FormControl>
              </Space>
            </Box>
          </Flex>
          <Table
            columns={columns}
            data={tableData}
            refreshFn={fetchredemptions}
            totalRecords={totalRecords}
            extraParams={{
              id: props.id,
              from: new Date(tempFromDate),
              to: new Date(tempToDate)

            }}
          //onDoubleClick={showInfo}
          //length={pageSize}
          />
        </Card>
      }
      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
        <Box>
          <Space size="small">
            <Buttons
              buttonDefaultType={"BACK"} onclick={() => router.back()}
            />
            {
              mode && mode !== "VIEW" && tabIndex == 0 && (
                <Buttons
                  buttonDefaultType={"SAVE"} buttonLoading={loading}
                />
              )}
          </Space>
        </Box>
      </Flex>
    </form>
  );
}

