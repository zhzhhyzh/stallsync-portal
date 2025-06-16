// Import necessary Chakra UI and other components
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
  Textarea,
  Checkbox,
  Spacer,
  Card,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  Highlight,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { ContractSchema } from "@app/components/forms/@schemas/contractSchema";
import { IoChevronBack, IoSave } from "react-icons/io5";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import Spacing from "@app/constants/Spacing";
import { DatePicker, Space } from "antd";
import Buttons from "@app/components/common/Buttons/Buttons";
import router, { useRouter } from "next/router";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";
import { getContractDetail, getManageContract, selectContract, setResetContractDetail } from "@app/redux/contract/slice";
import useApi from "@app/hooks/useApi";
import { showModal } from "@app/helpers/modalHelper";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import dayjs, { Dayjs } from 'dayjs'
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import { useEffect, useState } from 'react'
import AutocompleteWithCustomInput from "@app/components/common/Input/AutocompleteWithCustomInput";
import useFetchDDLProduct from "@app/hooks/selector/useFetchDDLProduct";
import useFetchDDLAgent from "@app/hooks/selector/useFetchDDLAgent";
import useFetchDDLDsagent from "@app/hooks/selector/useFetchDDLDsAgent";
import { closeGlobalModal, openGlobalModal, selectHome } from "@app/redux/app/slice";
import useFetchContractDetail from "@app/hooks/selector/useFetchContractDetail";
import useFetchDDLCustomer from "@app/hooks/selector/useFetchDDLCustomer";
import useFetchMemberProfile from "@app/hooks/selector/useFetchAgentProfile";
import SubHeader from "@app/components/common/Header/SubHeader";
import useFetchProds from "@app/hooks/selector/useFetchProds";
import { CgFormatStrike } from "react-icons/cg";
import { isNull } from "node:util";
import { NumericFormat as NumberFormat } from "react-number-format";
import { CloseIcon } from "@chakra-ui/icons";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";
import ContractDocumentListing from "./ContractDocumentForm";
import DocumentListing from "./DocumentListing";
import useFetchDDLCurrency from "@app/hooks/selector/useFetchDDLCurrency";
import { useToast } from "@chakra-ui/react";

export default function SalesContractForm(props: any) {
  const [ddlData] = useFetchDDL({ code: ["CONSTS", "CTXSTS", "IDTYPE", "SALETYPE", "CUSTTYPE"] });
  const [products] = useFetchProds({});
  const [agents] = useFetchDDLAgent();
  const [designations] = useFetchDDLDsagent();
  const [currencies] = useFetchDDLCurrency();
  const [memberProfile] = useFetchMemberProfile({});
  const [options] = useFetchDDLCustomer(); // Predefined options
  const [id, setId] = useState("")

  const [newInd, setNewInd] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [detailData, onInit] = useFetchContractDetail(id);
  // const detailData = useAppSelector(selectContract);

  const [tabIndex, setTabIndex] = useState(0)


  const populateCustomerFields = (customer: any) => {
    formik.setFieldValue("pscifuid", customer.pscifuid);
    formik.setFieldValue("pscifnme", customer.pscifnme);
    formik.setFieldValue("pscifphn", customer.pscifphn);
    formik.setFieldValue("pscifeml", customer.pscifeml);
    formik.setFieldValue("pscifidt", customer.pscifidt);
    formik.setFieldValue("psciftyp", customer.psciftyp);
    formik.setFieldValue("newCifInd", false);
    dispatch(closeGlobalModal())
  }
  const removeCustomerFields = () => {
    formik.setFieldValue("pscifidn", "");
    formik.setFieldValue("pscifuid", "");
    formik.setFieldValue("pscifnme", "");
    formik.setFieldValue("pscifphn", "");
    formik.setFieldValue("pscifeml", "");
    // formik.setFieldValue("pscifidt", "");
    formik.setFieldValue("psciftyp", "");
    formik.setFieldValue("newCifInd", true);
    dispatch(closeGlobalModal())

  }




  const { sendRequest, loading } = useApi({ title: "Sales Contract" });
  const dispatch = useAppDispatch();
  const mode = props.mode
  const initialValues = {
    psconfcd: null,
    psconncd: null,
    psconsbd: dayjs(),
    psconesd: "",
    psconexd: "",
    commissionRecurringTerm: "",
    pscomtrc: null,
    pscomtrn: null,
    pscomstp: "",
    psconsts: "N",
    psprdcde: "",
    psconamt: 0.00,
    pscifidt: "",
    pscifidn: "",
    pscifuid: "",
    psciftyp: "I",
    pscifnme: "",
    pscifphn: "",
    pscifeml: "",
    psmbruid: "",
    pscomtna: "",
    psconfam: 0.00,
    psconcex: 0.00,
    agentDesignation: "",
    agentName: "",
    recruiterpsmbruid: "",
    recruiterAgentDesignation: "",
    recruiterAgentName: "",
    psconrmk: "",
    newCifInd: true,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ContractSchema,
    enableReinitialize:false, 
    onSubmit: (values) => {
      onSubmit(values); // replace with your submit logic
    },

  });

  useEffect(()=>{
    console.log(formik.values)
  },[formik.values])


  // useEffect(() => {
  //   console.log(formik.touched)
  // }, [formik.touched])
  useEffect(() => {
    if (formik.values.psprdcde) {
      let product = products.find((product: any) => product.psprdcde === formik.values.psprdcde)
      if (product) formik.setFieldValue('commissionRecurringTerm', product.psprdten)
    }
  }, [formik.values.psprdcde])
  function submissionAlert() {

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
  const toast = useToast()

  async function submissionAlert2() {

    dispatch(
      openGlobalModal({
        title: "Submission Confirmation",
        message: ConfirmDetail(),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: async () => {

              let errors = await formik.validateForm()

              if (Object.keys(errors).length > 0) {
                formik.setErrors(errors);

                formik.setTouched(Object.fromEntries(
                  Object.keys(errors).map((key) => [key, true])
                ));
                dispatch(closeGlobalModal());
                return;
              }
              const { success } = await sendRequest({
                fn: getManageContract({

                  ...(formik.values),
                  id: id ? detailData?.psconuid : "",
                  psconuid: detailData?.psconuid,
                  psconsts: "P",
                }),
                formik,

              });
              dispatch(closeGlobalModal())
              if (success) {


                setTimeout(() => {
                  showModal(dispatch, {
                    title: "Submit Contract",
                    message: "Contract Submitted",
                  });
                  // router.back();
                }, 200);

                router.back()
              }
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


  useEffect(() => {
    console.log("HELOOO", id, "LO>LOL")
    if (id) {
      //Reset Form if detailData is empty object
      if (Object.keys(detailData).length === 0) formik.resetForm();

      if (Object.keys(detailData).length > 0) {

        console.log("HELLOOOOO",detailData)
        let customer = Array.isArray(options) && options.find((option: any) => option?.pscifidn === formik.values.pscifidn)


        formik.setValues(
          {
            ...detailData,
            id: detailData?.psconuid,
            psconsbd: detailData?.psconsbd && dayjs(detailData?.psconsbd),
            psconesd: detailData?.psconesd && dayjs(detailData?.psconesd),
            psconlcd: detailData?.psconlcd && dayjs(detailData?.psconlcd),
            psconexd: detailData?.psconexd && dayjs(detailData?.psconexd),
            pscontmd: detailData?.pscontmd && dayjs(detailData?.pscontmd),
            pscomtrn: detailData?.pscomtrn && dayjs(detailData?.pscomtrn),
            pscomtrc: detailData?.pscomtrc && dayjs(detailData?.pscomtrc),
            psconfcd: detailData?.psconfcd && dayjs(detailData?.psconfcd),
            psconncd: detailData?.psconncd && dayjs(detailData?.psconncd),
            psconsts: (detailData?.editable && detailData?.psconsts !== "R" && detailData?.psconsts !== "C" && detailData?.psconsts !== "N") ? detailData?.actions.find((action: any) => action === detailData.psconsts) || "" : detailData?.psconsts,
            // newCifInd: false,
            //   pschnsts: detailData?.pschnsts === "Y" ? true : false,

          });
          
        console.log(formik.values, "HELLO")
        let agent = Array.isArray(agents) && (agents.find((mbr: any) => mbr.psmbruid === detailData?.psmbruid))
        if (agent) {
          formik?.setFieldValue("psmbruid", agent?.psmbruid)
          formik?.setFieldValue("agentDesignation", agent?.psmbrtyp)
          formik?.setFieldValue("agentName", agent?.psmbrnme)
          formik?.setFieldValue("recruiterpsmbruid", agent?.recruiter_agent_id)
          formik?.setFieldValue("recruiterAgentDesignation", agent?.recruiter_agent_designation)
          formik?.setFieldValue("recruiterAgentName", agent?.recruiter_agent_name)



        }
        if (customer) populateCustomerFields(customer)
      }
    } else{
    }
  }, [detailData]);
  const homeData = useAppSelector(selectHome);

  function generateMaturityDate(startDate: string | Dayjs, yearsToAdd: number): Dayjs {
    // If the startDate is a string, convert it to a dayjs object
    const start = dayjs(startDate);

    // Add the number of years to the start date
    const maturityDate = start.add(yearsToAdd, 'year');

    // Return the maturity date as a dayjs object
    return maturityDate;
  }

  useEffect(()=>{
    console.log("DETAILDATA",detailData)
  },[detailData])

  // useEffect(() => {
  //   if (formik?.values?.psprdcde&&formik?.values?.psconesd) formik?.setFieldValue('psconexd', generateMaturityDate(formik.values.psconesd, Array.isArray(products) && products?.find((prd: any) => prd.psprdcde === formik.values.psprdcde).psprdten))
  //     else formik?.setFieldValue('psconexd', null)
  //   }, [formik?.values?.psprdcde, formik?.values?.psconesd])


  // Utility function to format number with commas and exactly two decimals
  const formatNumber = (value: number) => {
    if (!value) return "0.00";
    const [integer, decimal] = value.toString().split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedInteger}.${(decimal || "").padEnd(2, "0")}`;
  };

  // Utility function to strip commas for internal raw value
  const parseNumber = (value: String) => parseFloat(value.replace(/,/g, ""));

  const onHandleNewItem = () => {
    // alert("TEsT")
    formik?.setFieldValue("newCifInd", true)
    setNewInd(true)

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    const numericValue = parseFloat(rawValue);

    if (!isNaN(numericValue)) {
      const cursorPosition = e.target.selectionStart;
      formik.setFieldValue("psconamt", numericValue);

      // Restore cursor position to prevent jumping to the end
      window.requestAnimationFrame(() => {
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }
  const customerHandleChange = (event: any) => {
    if (!event.target.value && formik?.values?.pscifidn) {
      setIsAnimating(true);

      // Wait until slide-out animation finishes before updating the strength
      setTimeout(() => {

        setIsAnimating(false); // Trigger slide-in animation
      }, 300); // Match timeout with animation duration

    } else {

      if (Array.isArray(options) && options.find((option: any) => option === event.target.value)) {
        formik?.setFieldValue("newCifInd", false)
        // Trigger slide-out only if the strength changes
        if (newInd) {
          setIsAnimating(true);

          // Wait until slide-out animation finishes before updating the strength
          setTimeout(() => {

            setIsAnimating(false); // Trigger slide-in animation
          }, 300); // Match timeout with animation duration
        }
        setNewInd(false)
      } else {
        if (!newInd) {
          setIsAnimating(true);

          // Wait until slide-out animation finishes before updating the strength
          setTimeout(() => {

            setIsAnimating(false); // Trigger slide-in animation
          }, 300); // Match timeout with animation duration
        }
        setNewInd(true)
        formik?.setFieldValue("newCifInd", true)

      }
    }
    formik?.setFieldValue("pscifidn", event.target.value)
  }

  const handleSelect = (selectedValue: any) => {
    // alert("TAN2")
    formik?.setFieldValue('pscifidn', selectedValue)
    formik?.setFieldValue("newCifInd", false)
  };
  useEffect(() => {
    if (mode === "EDIT" && props.id) {
      setId(prevId => {
        const newId = props.id;
       onInit(props.id)
        return newId;
      });
    }
  }, [mode, props.id]);

  useEffect(()=>{
    // console.log("BYE",formik.values)
  },[formik.values])
  
  const handleCifIdnBlur = () => {
    let customer = Array.isArray(options) && options.find((option: any) => option?.pscifidn === formik.values.pscifidn && option?.pscifidt === formik.values.pscifidt)
    if (formik.values.pscifidn && formik.values.pscifidt && customer) {

      dispatch(
        openGlobalModal({
          title: "Delete Record",
          message: PopulateDetail(customer),
          status: "warning",
          actions: [
            {
              title: "Confirm",
              onClick: () => populateCustomerFields(customer),
              // isClose: true,
            },
            {
              title: "Cancel",
              // isClose: true,
              onClick: () => removeCustomerFields(),

              props: {
                variant: "danger",
              },
            },
          ],
        })
      );
    }

    // else {
    //   formik.setFieldValue("newCifInd", true);
    //   formik.setFieldValue("pscifuid", "");
    //   formik.setFieldValue("pscifnme", "");
    //   formik.setFieldValue("pscifphn", "");
    //   formik.setFieldValue("pscifeml", "");
    //   formik.setFieldValue("psciftyp", "");
    // }
  }
  useEffect(() => {
    if (mode === "ADD") {
      if (homeData?.psusrtyp === "AGT") {
        formik?.setFieldValue("psmbruid", memberProfile?.psmbruid)
        formik?.setFieldValue("agentDesignation", memberProfile?.psmbrtyp)
        formik?.setFieldValue("agentName", memberProfile?.psmbrnme)
        formik?.setFieldValue("recruiterpsmbruid", memberProfile?.recruiter_agent_id)
        formik?.setFieldValue("recruiterAgentDesignation", memberProfile?.recruiter_agent_designation)
        formik?.setFieldValue("recruiterAgentName", memberProfile?.recruiter_agent_name)
      } else {
        let agent = Array.isArray(agents) && (agents.find((mbr: any) => mbr.psmbruid === detailData?.psmbruid))

        if (agent) {
          let upline =
          formik?.setFieldValue("psmbruid", agent?.psmbruid)
          formik?.setFieldValue("agentDesignation", agent?.psmbrtyp)
          formik?.setFieldValue("agentName", agent?.psmbrnme)
          formik?.setFieldValue("recruiterpsmbruid", agent?.recruiter_agent_id)
          formik?.setFieldValue("recruiterAgentDesignation", agent?.recruiter_agent_designation)
          formik?.setFieldValue("recruiterAgentName", agent?.recruiter_agent_name)

        }
      }
    }

  }, [homeData, memberProfile])


  useEffect(() => { 
   console.log("BRUHHHH",detailData)
  }, [detailData]);
  
  const getConFunc = async (id:string|number) => {
    await dispatch(
      getContractDetail({
        id,
      })
    );
  }

  async function onSubmit(data: any) {

    console.log(data, formik.values)

    const { result, message } = await sendRequest({
      fn: getManageContract({
        ...data,
        id: id ? id : "",
        psconuid: id ? id : "",
        psmbruid: String(data?.psmbruid),
      }

      ),

      formik,
    });

    if (result === "success" && !data.id) {
      setId(message.psconuid)
      return
      // formik.setValues(detailData)
    }

  }
  useEffect(() => {
    if (formik.values.psprdcde && products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr !== "MYR" && Array.isArray(currencies)) {
      formik.setFieldValue('psconamt', (formik.values.psconfam * currencies.find((c)=>products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr)?.pscurrat).toFixed(2) )
    }


  }, [formik.values.psprdcde, formik.values.psconfam])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
        <Flex direction={"column"} alignSelf={"center"}>
          <Text fontSize={"3xl"} fontWeight="normal" mb={1}>
            Sales Contract Information
          </Text>
          <Breadcrumbs breadcrumbItems={[
            {
              title: "Sales Contract Information",
              href: `/contract`,// Add parameter if needed eg. /generalParameter/?id=123
            },
            {
              title: " Sales Contract Information (" + mode + ")",
              // title: "Checker Maker Control Parameter",

            },
          ]}
          />
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
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {
              ((mode === "EDIT" && detailData && detailData?.editable && detailData?.psconsts !== "N")) && (
                <Buttons buttonDefaultType={"SAVE"} type={"button"} onclick={formik.values.psconsts == "N" ? (e: any) => submissionAlert() : (e: any) => {
                  formik.handleSubmit();

                  setTimeout(() => {
                    showModal(dispatch, {
                      title: mode !== "ADD" ? "Update Record" : "Add Record",
                      message: mode !== "ADD" ? "Record Updated" : "Record Added",
                    });
                    // router.back();
                  }, 200);

                  router.back()
                }} buttonLoading={loading} />
              )}
            {(mode === "ADD" || detailData?.psconsts === "N") && (
              <Buttons onClick={async () => {
                submissionAlert2()
              }}
                buttonDefaultType={"CUSTOM"} type="button" buttonLoading={loading} buttonText="Submit" />
            )}

          </Space>
        </Box>
      </Flex>
      <Flex mt={4} bgColor="#fff" py={2}>
        <Tabs
          index={tabIndex}
          onChange={(index) => {
            let same = true;
            // if (detailData && tabIndex !== 1 && (tabIndex !== 3) && (tabIndex !== 2 && homeData?.psusrunm !== "ADM")) {

            //   // Loop through all properties in obj1
            //   for (const key in formik.values) {
            //     // // Check if the property exists in obj2
            //     // if (!(key in detailData)) {
            //     //   return false; // Property not found in obj2
            //     // }
            //     // Check if the values are equal
            //     if (detailData[key] !== formik.values[key] && key !== 'psconamt' && key !== 'agentDesignation' && key !== 'agentName' && key !== 'recruiterpsmbruid' && key !== 'recruiterAgentDesignation' && key !== 'recruiterAgentName' && key !== 'commissionRecurringTerm') {
            //       // if (key === "psapldob") {
            //       if (formik.values[key] instanceof dayjs) {
            //         // let dateString = formik.values[key].getDate() + "-" + (formik.values[key].getMonth() + 1) + "-" + formik.values[key].getFullYear()
            //         if (dayjs(formik.values[key]).diff(dayjs(detailData[key])) !== 0) { console.log("RANNNN"); same = false; }
            //       }
            //     }
            //     else if( key !== 'psconamt' && key !== 'agentDesignation' && key !== 'agentName' && key !== 'recruiterpsmbruid' && key !== 'recruiterAgentDesignation' && key !== 'recruiterAgentName' && key !== 'commissionRecurringTerm'){
            //       // console.log(key)
            //       // // if (key !== 'isSameAsRegAdr') {
            //       // //   // console.log(formik.values[key] + ' ' + detailData[key])
            //       if (formik.values[key] !== detailData[key]) { same = false; console.log(key) }
            //       //   same = false; // Values are not the same
            //       // }
            //       // }
            //       // same = false
            //     }
            //     else if (key === 'psconamt' && parseFloat(detailData[key]) !== parseFloat(formik.values[key])) {
            //       same = false
            //     }
            //   }


            //   // return true; 
            //   // All properties matched
            //   if (mode !== "VIEW" && !same
            //   ) {
            //     dispatch(
            //       openGlobalModal({
            //         title: "Content Changed Alert",
            //         message: MessageDetail(),
            //         status: "warning",
            //         actions: [
            //           {
            //             title: "Confirm",
            //             onClick: async () => {
            //               dispatch(closeGlobalModal());


            //               setTabIndex(index);

            //               formik.setValues({})

            //             },
            //           },
            //           {
            //             title: "Cancel",
            //             isClose: true,
            //           },
            //         ],
            //       })
            //     );
            //   } else {
            //     setTabIndex(index);

            //     formik.setValues({})
            //   }
            // } else {
            //   setTabIndex(index);

            //   formik.setValues({})

            // }

            if (tabIndex === 0) {
              formik.handleSubmit()
              console.log(formik.values)
              if (Object.keys(formik.errors).length <= 0) {
                toast({
                  containerStyle: {
                    // w: '20px',
                    // bgColor:'black'
                    // maxWidth: '100%',
                  },
                  description: "Contract info has been saved",
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                })

                setTimeout(()=>{
                  setTabIndex(index)

                },500)
              }
              // formik.handleSubmit()
            } else {
              setTabIndex(index)
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
              <CustomTabs label="Contract" index={0} selectedTabIndex={tabIndex} />
              <CustomTabs label="Documents" index={1} selectedTabIndex={tabIndex} />


            </TabList>
          </Flex>
        </Tabs>
      </Flex>

      {tabIndex === 0 && <div className="flex flex-col gap-6">
        <Box display="flex" flexDir="column" gap={6} width="100%">
          <Card display="flex" flexDir="column" p={4} mt={`${Spacing.containerPx}`}>

            <SubHeader labelText="Customer Information" />
            <Flex direction="column" gap={Spacing.containerPx}>
              <Flex direction="row" gap={Spacing.containerPx}>
                <FormControl flex={1}
                  id="pscifidt"
                  isInvalid={Boolean(formik.errors.pscifidt) && Boolean(formik.touched.pscifidt)}
                >
                  <CustomFormLabel labelText="Customer ID Type" />
                  <Select
                    isDisabled={mode !== "ADD" || mode === "VIEW" || !formik?.values?.newCifInd ? true : false}

                    placeholder="Please Select Customer ID Type"
                    value={formik.values.pscifidt}
                    onChange={formik.handleChange}
                    onBlur={handleCifIdnBlur}
                  >
                    {ddlData?.IDTYPE?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.pscifidt && <FormErrorMessage>{formik.errors.pscifidt}</FormErrorMessage>}
                </FormControl>
                <FormControl flex={1}
                  id="pscifidn"
                  isInvalid={Boolean(formik.errors.pscifidn) && Boolean(formik.touched.pscifidn)}
                >
                  <CustomFormLabel labelText="Customer ID Number" />
                  <InputGroup>
                    <Input
                      isDisabled={mode !== "ADD" || mode === "VIEW" || !formik?.values?.newCifInd ? true : false} name="pscifidn"
                      onChange={formik.handleChange}
                      onBlur={handleCifIdnBlur}
                      value={formik.values.pscifidn}
                    />
                    {formik.values.pscifidn && !formik.values.newCifInd && (mode === "ADD") && (
                      <InputRightElement>
                        <IconButton
                          aria-label="Clear input"
                          icon={<CloseIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={removeCustomerFields} />
                      </InputRightElement>
                    )}
                  </InputGroup>
                  {formik.errors.pscifidn && <FormErrorMessage>{formik.errors.pscifidn}</FormErrorMessage>}
                </FormControl>
                <FormControl flex={2}

                  id="pscifphn"

                  isInvalid={Boolean(formik.errors.pscifphn) && Boolean(formik.touched.pscifphn)}
                >
                  <CustomFormLabel labelText="Customer Contact Number" />
                  <Input isDisabled={mode !== "ADD" || mode === "VIEW" || !formik?.values?.newCifInd ? true : false}
                    type="text" name="pscifphn" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pscifphn} />
                  {formik.errors.pscifphn && <FormErrorMessage>{formik.errors.pscifphn}</FormErrorMessage>}
                </FormControl>
              </Flex>
              <Flex direction="row" gap={Spacing.containerPx}>

                <FormControl
                  flex={1}
                  id="psciftyp"
                  onBlur={handleCifIdnBlur}
                  isInvalid={Boolean(formik.errors.psciftyp) && Boolean(formik.touched.psciftyp)}
                >
                  <CustomFormLabel labelText="Customer Class" />
                  <Select
                    onBlur={formik.handleBlur}

                    placeholder="Please Select Customer Class "
                    value={formik.values.psciftyp}
                    onChange={formik.handleChange}
                    isDisabled={mode !== "ADD" || mode === "VIEW" || !formik?.values?.newCifInd ? true : false}
                  >
                    {ddlData?.CUSTTYPE?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psciftyp && <FormErrorMessage>{formik.errors.psciftyp}</FormErrorMessage>}
                </FormControl>
                <FormControl flex={1}

                  id="pscifuid"

                  isInvalid={Boolean(formik.errors.pscifuid) && Boolean(formik.touched.pscifuid)}
                >
                  <CustomFormLabel labelText="Customer No." />
                  <Input isDisabled={true}
                    type="number" name="pscifuid" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pscifuid} />

                  {formik.errors.pscifuid && <FormErrorMessage>{formik.errors.pscifuid}</FormErrorMessage>}
                </FormControl>
                <FormControl flex={2}
                  id="pscifeml"
                  isInvalid={Boolean(formik.errors.pscifeml) && Boolean(formik.touched.pscifeml)}

                >
                  <CustomFormLabel labelText="Email Address" />
                  <Input isDisabled={mode !== "ADD" || mode === "VIEW" || !formik?.values?.newCifInd ? true : false}
                    type="email" name="pscifeml" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pscifeml} />
                  {formik.errors.pscifeml && <FormErrorMessage>{formik.errors.pscifeml}</FormErrorMessage>}
                </FormControl>
              </Flex>
              <Flex direction="row" gap={Spacing.containerPx}>

                <FormControl
                  id="pscifnme"
                  flex={1}
                  isInvalid={Boolean(formik.errors.pscifnme) && Boolean(formik.touched.pscifnme)}
                >
                  <CustomFormLabel labelText="Customer Name" />
                  <Input isDisabled={mode !== "ADD" || mode === "VIEW" || !formik?.values?.newCifInd ? true : false}
                    type="text" name="pscifnme" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pscifnme} />
                  {formik.errors.pscifnme && <FormErrorMessage>{formik.errors.pscifnme}</FormErrorMessage>}
                </FormControl>
                <Flex flex={1} />
                <Flex flex={2} />
              </Flex>
            </Flex>
          </Card>
          <Card display="flex" flexDir="column" p={4} >

            <SubHeader labelText="Sales Information" />

            <Flex direction="column" gap={Spacing.containerPx}>

              <Flex direction="row" gap={Spacing.containerPx}>
                <FormControl flex={2}
                  id="psprdcde"
                  isInvalid={Boolean(formik.errors.psprdcde) && Boolean(formik.touched.psprdcde)}
                >
                  <CustomFormLabel labelText="Product Code" />
                  <Select
                    placeholder="Please Select Product Code"
                    value={formik.values.psprdcde}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={(mode !== "ADD" && detailData && detailData?.psconsts !== "N")}
                  >
                    {Array.isArray(products) && products?.map((option: any) => (
                      <option key={option.psprdcde} value={option.psprdcde}>
                        {option.psprddsc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.psprdcde && <FormErrorMessage>{formik.errors.psprdcde}</FormErrorMessage>}
                </FormControl>
                <FormControl flex={1}
                  id="pscomstp"
                  isInvalid={Boolean(formik.errors.pscomstp) && Boolean(formik.touched.pscomstp)}
                >
                  <CustomFormLabel labelText="Sales Type" />
                  <Select isDisabled={(mode !== "ADD" && detailData && detailData?.psconsts !== "N")}
                    placeholder={"Please Select Sales Type"} name="pscomstp" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pscomstp}>
                    {ddlData?.SALETYPE?.map((option: DDL_TYPES) => (
                      <option key={option.prgecode} value={option.prgecode}>
                        {option.prgedesc}
                      </option>
                    ))}
                    {/* Add options */}
                  </Select>
                  {formik.errors.pscomstp && <FormErrorMessage>{formik.errors.pscomstp}</FormErrorMessage>}
                </FormControl>
                <Flex flex={2} gap={Spacing.containerPx}>

                  <FormControl flex={1}
                    id="psconsts"
                    isInvalid={Boolean(formik.errors.psconsts) && Boolean(formik.touched.psconsts)}
                  >
                    <CustomFormLabel labelText="Status" />
                    <Select
                      placeholder="Please Select Status"
                      value={formik.values.psconsts}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isDisabled={(Object.keys(detailData)?.length > 0 && !detailData?.editable) || detailData && (detailData?.psconsts === "R" || detailData?.psconsts === "C") || mode !== "EDIT" || detailData?.psconsts === "N"}
                    >
                      {(mode === "ADD" || (detailData && (detailData?.psconsts === "R" || detailData?.psconsts === "C" || detailData?.psconsts === "N"))) ? ddlData?.CTXSTS?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      )) : detailData?.editable ? ddlData?.CTXSTS?.filter((gencode: DDL_TYPES) => detailData?.actions?.find((d: any) => d === gencode?.prgecode)).map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      )) : ddlData?.CTXSTS?.map((option: DDL_TYPES) => (
                        <option key={option.prgecode} value={option.prgecode}>
                          {option.prgedesc}
                        </option>
                      ))}
                    </Select>
                    {formik.errors.psconsts && <FormErrorMessage>{formik.errors.psconsts}</FormErrorMessage>}
                  </FormControl>
                  {formik.values.psprdcde && products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr !== "MYR" && <FormControl flex={1}
                    id="psconfam"
                    isInvalid={Boolean(formik.errors.psconfam) && Boolean(formik.touched.psconfam)}
                  >
                    <CustomFormLabel labelText="Foreign Contract Amount" />
                    <NumberFormat

                      value={formik.values.psconfam}
                      displayType="input"
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      prefix={products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr + " "}
                      onValueChange={(values) => {
                        // Extract the value without formatting
                        const { floatValue } = values;
                        formik.setFieldValue("psconfam", floatValue);
                      }}
                      isDisabled={(mode === "EDIT" && detailData?.psconsts !== "R" && detailData?.psconsts !== "N") || (detailData && !detailData.editable && detailData?.psconsts === "R")}
                      name="psconfam"

                      onBlur={formik.handleBlur}
                      customInput={Input} // Use Chakra UI Input as the base input
                    />  {formik.errors.psconfam && <FormErrorMessage>{formik.errors.psconfam}</FormErrorMessage>}
                  </FormControl>}
                </Flex>
              </Flex>
              <Flex direction="row" gap={Spacing.containerPx}>
                <FormControl flex={1}
                  id="psconsbd"
                  isInvalid={Boolean(formik.errors.psconsbd) && Boolean(formik.touched.psconsbd)}
                >
                  <FormLabel>Submission Date</FormLabel>
                  <DatePicker disabled={(mode === "VIEW" || Object.keys(detailData)?.length > 0 && !detailData?.editable || mode !== "ADD") ? true : false} style={{ width: "100%" }} name="psconsbd" value={formik.values.psconsbd ? formik.values.psconsbd : null} onChange={(date) => formik.setFieldValue('psconsbd', date ? date : null)} />
                  {/* {formik.errors.psconsbd && <FormErrorMessage>{formik.errors.psconsbd}</FormErrorMessage>} */}
                </FormControl>

                <FormControl flex={1}
                  id="psconesd"
                  isInvalid={Boolean(formik.errors.psconesd) && Boolean(formik.touched.psconesd)}
                >
                  <FormLabel>Deal Date</FormLabel>

                  <DatePicker
                    disabled={(detailData && !detailData?.editable) || mode !== "EDIT"}
                    style={{ width: "100%" }} name="psconesd" value={formik.values.psconesd ? formik.values.psconesd : null} onChange={(date) => formik.setFieldValue('psconesd', date ? date : null)}
                  />
                  {/* {formik.errors.psconesd && <FormErrorMessage>{formik.errors.psconesd}</FormErrorMessage>} */}
                </FormControl>

                <Flex flex={2} gap={Spacing.containerPx}>
                  <FormControl
                    id="psconamt" flex={formik.values.psprdcde && products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr !== "MYR" ? 1 : 2}
                    isInvalid={Boolean(formik.errors.psconamt) && Boolean(formik.touched.psconamt)}
                  >
                    <CustomFormLabel labelText="Contract Amount" />
                    <NumberFormat

                      value={formik.values.psconamt}
                      displayType="input"
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      prefix="MYR "
                      onValueChange={(values) => {
                        // Extract the value without formatting
                        const { floatValue } = values;
                        formik.setFieldValue("psconamt", floatValue);
                      }}
                      isDisabled={(mode === "EDIT" && detailData?.psconsts !== "R" && detailData?.psconsts !== "N") || (detailData && !detailData.editable && detailData?.psconsts === "R") || (formik.values.psprdcde && products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr !== "MYR")}
                      name="psconamt"

                      onBlur={formik.handleBlur}
                      customInput={Input} // Use Chakra UI Input as the base input
                    />  {formik.errors.psconamt && <FormErrorMessage>{formik.errors.psconamt}</FormErrorMessage>}
                  </FormControl>

                  {formik.values.psprdcde && products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr !== "MYR" &&
                    <FormControl flex={1}
                      id="psconcex"
                      isInvalid={Boolean(formik.errors.psconcex) && Boolean(formik.touched.psconcex)}
                    >
                      <CustomFormLabel labelText="Currency Exchange Rate" />
                      <NumberFormat
                        disabled={true}
                        value={Array.isArray(currencies) && currencies.find((c: any) => c.pscurcde === products.find((p: any) => p.psprdcde === formik.values.psprdcde)?.psprdccr)?.pscurrat}
                        displayType="input"
                        thousandSeparator
                        decimalScale={5}
                        fixedDecimalScale
                        allowNegative={false}
                        prefix={" "}
                        onValueChange={(values) => {
                          // Extract the value without formatting
                          const { floatValue } = values;
                          formik.setFieldValue("psconcex", floatValue);
                        }}
                        name="psconcex"

                        onBlur={formik.handleBlur}
                        customInput={Input} // Use Chakra UI Input as the base input
                      />  {formik.errors.psconcex && <FormErrorMessage>{formik.errors.psconcex}</FormErrorMessage>}
                    </FormControl>}
                </Flex>
              </Flex>


              <Flex direction="row" gap={Spacing.containerPx}
              >

                <Flex direction="column" flex={1} gap={Spacing.containerPx}>

                  <Flex direction="row" gap={Spacing.containerPx}
                  >
                    <FormControl
                      id="psconexd" flex={1}
                      isInvalid={Boolean(formik.errors.psconexd) && Boolean(formik.touched.psconexd)}
                    >
                      <FormLabel>Maturity Date</FormLabel>
                      <DatePicker disabled={!(detailData && detailData?.psconsts === "R" && detailData?.editable)} style={{ width: "100%" }}
                        name="psconexd" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.psconexd} />
                      {formik.errors.psconexd && <FormErrorMessage>{formik.errors.psconexd}</FormErrorMessage>}
                    </FormControl>
                    <FormControl flex={1}
                      id="comissionDate"
                      isInvalid={Boolean(formik.errors.psconfcd) && Boolean(formik.touched.psconfcd)}
                    >
                      <FormLabel>Commission Date</FormLabel>

                      <DatePicker disabled={(Object.keys(detailData)?.length > 0 && !detailData?.editable) || mode !== "EDIT"} value={formik.values.psconfcd} style={{ width: "100%" }} name="comissionDate" onBlur={formik.handleBlur} onChange={(date) => formik.setFieldValue('psconfcd', date ? date : null)} />
                      {formik.errors.psconfcd && <FormErrorMessage>{formik.errors.psconfcd}</FormErrorMessage>}
                    </FormControl>

                  </Flex>
                  <Flex direction="row" gap={Spacing.containerPx}
                  >
                    <FormControl
                      id="commissionRecurringTerm"
                      isInvalid={Boolean(formik.errors.commissionRecurringTerm) && Boolean(formik.touched.commissionRecurringTerm)}
                    >
                      <FormLabel>Commission Recurring Term</FormLabel>

                      <Input isDisabled={true}
                        type="text" name="commissionRecurringTerm" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.commissionRecurringTerm} />
                      {formik.errors.commissionRecurringTerm && <FormErrorMessage>{formik.errors.commissionRecurringTerm}</FormErrorMessage>}
                    </FormControl>
                    <FormControl
                      id="psconncd"
                      isInvalid={Boolean(formik.errors.psconncd) && Boolean(formik.touched.psconncd)}
                    >
                      <FormLabel>Next Commission Date</FormLabel>

                      <DatePicker disabled={(Object.keys(detailData)?.length > 0 && !detailData?.editable) || mode !== "EDIT"} value={formik.values.psconncd} style={{ width: "100%" }} name="psconncd" onBlur={formik.handleBlur} onChange={(date) => formik.setFieldValue('psconncd', date ? date : null)} />
                      {formik.errors.psconncd && <FormErrorMessage>{formik.errors.psconncd}</FormErrorMessage>}
                    </FormControl>

                  </Flex>

                  <Flex direction="row" gap={Spacing.containerPx}>


                    <FormControl
                      id="pscomtna"
                      isInvalid={Boolean(formik.errors.pscomtna) && Boolean(formik.touched.pscomtna)}
                    >
                      <FormLabel>Trust Deed <br /> Agreement No.</FormLabel>

                      <Input isDisabled={mode !== "ADD" && detailData?.psconsts === "R" && !detailData?.editable}
                        type="text" name="pscomtna" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.pscomtna} />
                      {formik.errors.pscomtna && <FormErrorMessage>{formik.errors.pscomtna}</FormErrorMessage>}
                    </FormControl>
                    <FormControl
                      id="pscomtrc"
                      isInvalid={Boolean(formik.errors.pscomtrc) && Boolean(formik.touched.pscomtrc)}
                    >
                      <FormLabel>Trust Deed <br /> Receive Date</FormLabel>

                      <DatePicker disabled={(Object.keys(detailData)?.length > 0 && !detailData?.editable) || mode !== "EDIT"} style={{ width: "100%" }} name="pscomtrc" onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "pscomtrc" },
                        })
                      } onBlur={formik.handleBlur} value={formik.values.pscomtrc} />
                      {formik.errors.pscomtrc && <FormErrorMessage>{formik.errors.pscomtrc}</FormErrorMessage>}
                    </FormControl>
                    <FormControl
                      id="pscomtrn"
                      isInvalid={Boolean(formik.errors.pscomtrn) && Boolean(formik.touched.pscomtrn)}
                    >
                      <FormLabel>Trust Deed <br /> Return Date</FormLabel>
                      <DatePicker disabled={(Object.keys(detailData)?.length > 0 && !detailData?.editable) || mode !== "EDIT"} style={{ width: "100%" }} name="pscomtrn" onChange={(value) =>
                        formik.handleChange({
                          target: { value, name: "pscomtrn" },
                        })
                      } onBlur={formik.handleBlur} value={formik.values.pscomtrn} />
                      {formik.errors.pscomtrn && <FormErrorMessage>{formik.errors.pscomtrn}</FormErrorMessage>}
                    </FormControl>

                  </Flex>
                </Flex>

                <FormControl flex={0.96}
                  id="psconrmk"

                  isInvalid={Boolean(formik.errors.psconrmk) && Boolean(formik.touched.psconrmk)}
                >
                  <FormLabel h="7.5%">Remarks</FormLabel>
                  <Textarea isDisabled={mode === "VIEW" || (mode !== "ADD" && !detailData?.editable) ? true : false} h="89.5%" name="psconrmk" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.psconrmk} />
                  {formik.errors.psconrmk && <FormErrorMessage>{formik.errors.psconrmk}</FormErrorMessage>}
                </FormControl>
              </Flex>
            </Flex>
          </Card>
          <Card display="flex" flexDir="column" p={4} mt={`${Spacing.containerPx}`}>
            <SubHeader labelText="Agent Information" />
            <Flex flexDir="column" gap={6}>
              <Flex direction="row" gap={Spacing.containerPx}>
                <FormControl
                  id="psmbruid"
                  isInvalid={Boolean(formik.errors.psmbruid) && Boolean(formik.touched.psmbruid)}
                >
                  <CustomFormLabel labelText="Agent ID" />
                  {(homeData?.psusrtyp === "AGT") ? <Input type="text" isDisabled={true} name="psmbruid" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.psmbruid} />
                    :
                    <Select isDisabled={true}

                      placeholder="Please Select Agent"
                      value={formik.values.psmbruid}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {Array.isArray(agents) && agents?.map((option: any) => (
                        <option key={option.psmbruid} value={option.psmbruid}>
                          {option.psmbruid}
                        </option>
                      ))}
                    </Select>}
                  {formik.errors.psmbruid && <FormErrorMessage>{formik.errors.psmbruid}</FormErrorMessage>}
                </FormControl>

                <FormControl
                  id="agentName"
                  isInvalid={Boolean(formik.errors.agentName) && Boolean(formik.touched.agentName)}
                >
                  <CustomFormLabel labelText="Agent Name" />
                  <Input isDisabled={true}
                    type="text" name="agentName" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik?.values?.agentName}
                  />
                  {formik.errors.agentName && <FormErrorMessage>{formik.errors.agentName}</FormErrorMessage>}
                </FormControl>


                <FormControl

                  id="agentDesignation"
                  isInvalid={Boolean(formik.errors.agentDesignation) && Boolean(formik.touched.agentDesignation)}
                >
                  <CustomFormLabel labelText="Agent Designation" />
                  <Select
                    placeholder=" "
                    value={formik.values.agentDesignation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={true}
                  >
                    {Array.isArray(designations) && designations?.map((option: any) => (
                      <option key={option.psdsgcde} value={option.psdsgcde}>
                        {option.psdsgdsc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.agentDesignation && <FormErrorMessage>{formik.errors.agentDesignation}</FormErrorMessage>}
                </FormControl>
              </Flex>
              <Flex direction="row" gap={Spacing.containerPx}>

                <FormControl
                  id="recruiterpsmbruid"
                  isInvalid={Boolean(formik.errors.recruiterpsmbruid) && Boolean(formik.touched.recruiterpsmbruid)}
                >
                  <CustomFormLabel labelText="Agent's Upline ID" />
                  <Input isDisabled={true} type="text" name="recruiterpsmbruid" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.recruiterpsmbruid} />
                  {formik.errors.recruiterpsmbruid && <FormErrorMessage>{formik.errors.recruiterpsmbruid}</FormErrorMessage>}
                </FormControl>

        
                <FormControl
                  id="recruiterAgentName"
                  isInvalid={Boolean(formik.errors.recruiterAgentName) && Boolean(formik.touched.recruiterAgentName)}
                >
                  <CustomFormLabel labelText="Agent's Upline Name" />
                  <Input isDisabled={true}
                    type="text" name="recruiterAgentName" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.recruiterAgentName} />
                  {formik.errors.recruiterAgentName && <FormErrorMessage>{formik.errors.recruiterAgentName}</FormErrorMessage>}
                </FormControl>
                <FormControl
                  id="recruiterAgentDesignation"


                  isInvalid={Boolean(formik.errors.recruiterAgentDesignation) && Boolean(formik.touched.recruiterAgentDesignation)}
                >
                  <CustomFormLabel labelText="Agent's Upline Designation" />
                  <Select
                    placeholder=" "
                    value={formik.values.recruiterAgentDesignation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={true}
                  >
                    {Array.isArray(designations) && designations?.map((option: any) => (
                      <option key={option.psdsgcde} value={option.psdsgcde}>
                        {option.psdsgdsc}
                      </option>
                    ))}
                  </Select>
                  {formik.errors.recruiterAgentDesignation && <FormErrorMessage>{formik.errors.recruiterAgentDesignation}</FormErrorMessage>}
                </FormControl>

              </Flex>
              
              </Flex>
          </Card>

        </Box>
      </div>}
      {
        tabIndex === 1 &&
        <DocumentListing id={id} mode={(detailData?.editable || detailData?.psconsts === "N" || mode === "ADD") ? "EDIT" : "VIEW"} />
      }

      <Flex justifyContent="flex-end" pl={10} pr={10} pt={10}>
        <Box>
          <Space size="small">
            <Buttons buttonDefaultType={"BACK"} onclick={() => router.back()} />
            {(mode === "EDIT" && detailData && detailData?.editable && detailData?.psconsts !== "N") && (
              <Buttons buttonDefaultType={"SAVE"} type={"button"} onclick={formik.values.psconsts == "N" ? (e: any) => submissionAlert() : (e: any) => {
                formik.handleSubmit();

                setTimeout(() => {
                  showModal(dispatch, {
                    title: mode !== "ADD" ? "Update Record" : "Add Record",
                    message: mode !== "ADD" ? "Record Updated" : "Record Added",
                  });
                  // router.back();
                }, 200);

                router.back()
              }} buttonLoading={loading} />
            )}
            {(mode === "ADD" || detailData?.psconsts === "N") && (
              <Buttons onClick={async () => {
                submissionAlert2()
              }}
                buttonDefaultType={"CUSTOM"} type="button" buttonLoading={loading} buttonText="Submit" />
            )}
          </Space>
        </Box>
      </Flex>
    </form>

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
const PopulateDetail = (item: any) => {
  return (
    <Box w="100%" display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text p={3}>Customer already exists. Are you sure <br /> to select this customer?</Text>

      <Flex flexDir="column" alignItems="flex-start">
        <Box display="flex"   >
          <Text minW="90px" textAlign={"left"} fontWeight="bold">ID No.</Text>
          <Text>: {item.pscifidn}</Text>
        </Box>
        <Box display="flex">
          <Text minW="90px" textAlign={"left"} fontWeight="bold">Name</Text>
          <Text>: {item.pscifnme}</Text>
        </Box>
        <Box display="flex">
          <Text minW="90px" textAlign={"left"} fontWeight="bold">Phone No.</Text>
          <Text>: {item.pscifphn}</Text>
        </Box>
      </Flex>
    </Box>

  )
};




const ConfirmDetail = () => {
  return (
    <Box w={"100%"} display="flex" flexDirection="column" alignItems="center">
      {/* <Icon as={IoWarningOutline} w={150} h={150} color={Colors.DANGER}/> */}
      <Text >Confirm to Submit?</Text>
      {/* <Text>{item} - {itemDesc}</Text> */}
    </Box>
  )
};