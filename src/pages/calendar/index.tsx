// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  FormControl, Stack,
  InputGroup,
  FormLabel,
  FormErrorMessage, RadioGroup, Radio,
  Heading,
  Button,
  Select,
  Link,
  Icon, Tabs, TabList, Tab,
  Tooltip,
} from "@chakra-ui/react";
// assets
import React, { ChangeEventHandler, useEffect, useState, useRef } from "react";
import { api } from "@app/utils/AxiosUtils";
import SubHeader from "@app/components/common/Header/SubHeader";
import CustomTabs from "@app/components/common/Tabs/CustomTabs";

import { DatePicker, Space, Tag } from "antd";
import Spacing from "@app/constants/Spacing";
import useApi from "@app/hooks/useApi";
import { useFormik } from "formik";
import { fetchworkday, getmanageWorkDay, getworkDayDetail } from "@app/redux/workday/slice";
import useFetchWorkDayDetail from "@app/hooks/selector/useFetchWorkDayDetail";
import Card from "@app/components/common/Card/Card";

import { formatDate } from "@app/utils/DateUtils";
import Table from "@app/components/common/Table/Table";
import { IoAdd, IoTrash, IoWarningOutline } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { closeGlobalModal, openGlobalModal, refreshTable, selectHome } from "@app/redux/app/slice";
import { CSSProperties } from 'react';
import { showModal } from "@app/helpers/modalHelper";
import { useRouter } from "next/router";
import CustomFormLabel from "@app/components/common/FormLabel/CustomFormLabel";

// import useFetchHolidays from "@app/hooks/selector/useFetchHolidays";
import {
  fetchholiday,
  getremoveHoliday,
} from "@app/redux/holiday/slice";
import useFetchDDL from "@app/hooks/selector/useFetchDDL";
import { DDL_TYPES } from "@app/interfaces/ddl.types";
import TableMenu from "@app/components/common/TableMenu/TableMenu";
import { BsPencil } from "react-icons/bs";
import { accessType, checkAccessMatrix } from "@app/utils/access-matrix";
import Buttons from "@app/components/common/Buttons/Buttons";
import Breadcrumbs from "@app/components/common/Breadcrumbs/Breadcrumbs";
import { MdLockReset } from "react-icons/md";
import useFetchHolidays from '@app/hooks/selector/useFetchHolidays';
import useFetchWorkDays from '@app/hooks/selector/useFetchWorkDays';
import useFetchHolidayDetail from '@app/hooks/selector/useFetchHolidayDetail';
import dayjs from 'dayjs'
import { format, parse } from 'date-fns';
interface Holiday {
  psholcde: string;
  psholdsc: string;
  psholdat: string;
  // psholday: string;
  psholtyp: string;
}

interface Workday {
  pswdycde: string;
  pswdyind: string;
}

interface Day {
  id: string,
  pswdycde: string;
  pswdydsc: string;
  pswdyind: string;
}

interface DayInfo {
  date: Date | null;
  isHoliday: boolean;
  holidayDescription: string | null;
  isBusinessDay: boolean;
}
export default function calendarPage(props: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sendRequest, loading } = useApi({ title: "System Calendar Configuration" });
  const homeData = useAppSelector(selectHome);
  const [tabIndex, setTabIndexx] = useState(0);
  const [tabb, setTabb] = useState("");
  const type = String(router.query?.type);
  // const renderTab = (label: any, index: number) => (
  //   <Tab
  //     key={`promo-tab-${index}`}
  //     py={3}
  //     whiteSpace="nowrap"
  //     ml={{
  //       base: 0,
  //       md: Spacing.containerPx,
  //     }}
  //     fontWeight={tabIndex === index ? "medium" : "normal"}
  //     color={tabIndex === index ? "blue.600" : "gray.500"} 
  //     paddingBottom="3px"
  //     borderBottomWidth={2}
  //   >
  //     {label}
  //   </Tab>
  // );


  useEffect(() => {
    if (type && type != "") {
      if (type == "V") {
        setTabIndexx(1)
      } else if (type == "F") {
        setTabIndexx(2)
      }
    } else setTabIndexx(0)
  }, [type])

  useEffect(() => {
    if (tabIndex == 1) {
      setTabb("V")
    } else if (tabIndex == 2) {
      setTabb("F")
    } else setTabb("")
  }, [tabIndex])

  //sample code how to use this hook
  const [tableData, refreshFn, totalRecords, extra] = useFetchHolidays({});

  //Calendar**
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [calendarData, setCalendarData] = useState<DayInfo[][]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    async function fetchData() {
      try {
        // Call the API function with the appropriate requestURL
        const data = await api(
          'psholpar/list/', // Your endpoint
          'GET',                          // HTTP method
          {},                             // No additional data
          {},                             // No headers if not needed
          false,                                                    // extraType parameters if needed
        );


        setHolidays(data.message.data);

      } catch (err: any) {
        setError(err.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading when the fetch is complete
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setHolidays(holidays);
      setWorkdays(workdays);
    };
    getData();
  }, []);



  const isHoliday = (date: Date): Holiday | null => {
    if (!Array.isArray(holidays)) {
      console.error('holidays is not an array:', holidays);  // Log to check if holidays is correctly initialized
      return null;  // Return null if holidays is not an array
    }

    for (const holiday of holidays) {
      // Parse the start date based on whether it's a recurring holiday (type "F") or not
      let startDate: Date;

      if (holiday.psholtyp === "F") {
        // For recurring holidays (type "F"), parse the day/month only and set the current year
        const parts = holiday.psholdat.split('/');  // Split the date string (dd/MM)
        startDate = new Date(date.getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[0]));  // Set the current year

      } else {
        // For non-recurring holidays, parse the full date with the year
        startDate = parse(holiday.psholdat, 'dd/MM/yyyy', new Date());
      }

      // Calculate the end date for the holiday
      const endDate = new Date(startDate);
      // endDate.setDate(startDate.getDate() + parseInt(holiday.psholday) - 1);

      // Check if the date falls within the holiday range
      if (date >= startDate && date <= endDate) {
        return holiday; // Return the holiday if the date matches
      }
    }
    return null;
  };

  const isWorkday = (day: string): boolean => {
    if (!Array.isArray(workdays)) {
      console.error('workdays is not an array or is undefined:', workdays);  // Log to check the value of workdays
      return false;  // Return false if workdays is not defined or is not an array
    }

    const workday = workdays.find((w) => w.pswdycde.toUpperCase() === day.toUpperCase());
    return workday ? workday.pswdyind === 'Y' : false;
  };

  const generateCalendarData = () => {
    const months = Array.from({ length: 12 }, (_, month: number) => {
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(selectedYear, month, 1).getDay(); // 0 (Sunday) - 6 (Saturday)

      const daysArray: DayInfo[] = [];

      // Fill placeholders until the first day of the month aligns with the correct weekday
      for (let i = 0; i < firstDayOfMonth; i++) {
        daysArray.push({ date: null, isHoliday: false, holidayDescription: null, isBusinessDay: false });
      }

      // Populate actual days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, month, day);
        const holiday = isHoliday(date);
        const isBusinessDay = isWorkday(date.toLocaleString('en-us', { weekday: 'long' }));
        daysArray.push({
          date,
          isHoliday: !!holiday,
          holidayDescription: holiday ? holiday.psholdsc : null,
          isBusinessDay,
        });
      }

      return daysArray;
    });
    setCalendarData(months);
  };

  useEffect(() => {
    generateCalendarData();
  }, [holidays, workdays, selectedYear]);

  const handleDateClick = (date: Date | null) => {
    if (date) setSelectedDate(date);
  };

  const formatDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Inline styles
  const styles: { [key: string]: React.CSSProperties } = {
    calendarContainer: { display: 'flex' },
    calendar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',  // 3 months per row
      gap: '10px'
    },
    month: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    weekdays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)', // 7 columns for days of the week
      gap: '5px',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: "13px"


    },
    days: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',  // 7 columns for days in the month
      gap: '5px',
      textAlign: 'center',

    },
    holiday: {
      paddingTop: '1px',
      color: 'red',
      cursor: 'pointer',
      fontSize: "13px"
    },
    selectedDay: {
      backgroundColor: 'lightblue',
      cursor: 'pointer',
      borderRadius: '50%',
    },
    workday: {
      paddingTop: '1px',
      color: 'black',
      cursor: 'pointer',
      fontSize: "13px"

    },
    normalDay: {
      color: 'grey',
      paddingTop: '1px',
      cursor: 'pointer',
      fontSize: "13px"

    },
    placeholder: {
      color: 'transparent',
      padding: '5px'
    },
    details: {
      marginLeft: '20px'
    },
    detailLabel: {
      fontWeight: 'bold'
    }
  };




  let startTouch = 0;

  // Function to handle the touch start event
  const handleTouchStart = (e: React.TouchEvent) => {
    startTouch = e.touches[0].clientX;  // Capture the initial X position of the touch
  };

  // Function to handle the touch end event
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endTouch = e.changedTouches[0].clientX;  // Capture the final X position after the touch
    if (startTouch > endTouch) {
      // Swipe left (next year)
      setSelectedYear(prevYear => prevYear + 1);
    } else if (startTouch < endTouch) {
      // Swipe right (previous year)
      setSelectedYear(prevYear => prevYear - 1);
    }
  };

  // Handle year selection by clicking on the previous, current, or next year
  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };




  //Variable Annual PH**
  const columns: any[] = [
    {
      title: "Year",
      dataIndex: "psholdat",
      key: "psholdat",
      render: (text: any) => {
        // Convert text to a Date object
        const date = new Date(text);

        // Check if the date is valid before calling getFullYear()
        if (isNaN(date.getTime())) {
          // Try splitting the string if it's in a format like "YYYY-MM-DD" or "YYYY/MM/DD"
          const parts = text.split(/[-/]/); // Split by dash or slash
          if (parts.length > 0) {
            return parts[2]; // Return the first part as the year (assumes "YYYY" is the first part)
          }
          return "";
        }

        // Return the year if the date is valid
        return date.getFullYear();
      }
    },
    {
      title: "Date",
      dataIndex: "psholdat",
      key: "psholdat",
    },
    {
      title: "Annual Public Holiday",
      dataIndex: "psholcde",
      key: "psholcde",
      render: (_: any, record: any) => (
        <Text>{`${record.psholdsc}`}</Text>
      )
    },

    {
      title: "Action",
      key: "action",
      align: "right",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small">
            {/* <IconButton
              // colorScheme={"blue"}
              icon={<AiFillEye />}
              aria-label={"view"}
              onClick={() => showInfo(record)}
            /> */}
            {
              // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.calendar_EDIT)) &&
              (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id, tabb)}
                  />
                </Tooltip>

              )
            }
            {
              // todo
              // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.calendar_DEL)) &&
              (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psdsgdsc)}
                  />
                </Tooltip>
              )
            }

            <TableMenu menus={[
              {
                url: `calendar/maintLogs`,
                query: {
                  id: record?.id + "-" + record?.psholdat,
                  date: record?.psholdat,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Calendar",
                    href: `/calendar`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Maintenance Log",
                  },
                ]
              }
            ]} />

          </Space>
        </Flex>
      ),
    },
  ];


  function alertRemove(id: string, desc: string) {

    dispatch(
      openGlobalModal({
        title: "",
        message: RemoveDetail(id, desc),
        status: "warning",
        actions: [
          {
            title: "Confirm",
            onClick: () => {
              onRemove(id);
            },

          },
          {
            title: "Cancel",
            isClose: true,
          },
        ],
      })
    );
  }

  async function onRemove(id: string) {
    const { success } = await sendRequest({
      fn: getremoveHoliday({ id }),
    });
    if (success) {

      setTimeout(() => {
        dispatch(refreshTable())
        showModal(dispatch, {
          title: "Remove item",
          message: "Removed",
        });
        router.push("/calendar");
      }, 200);
    }
  }

  function goAdd(type: string) {
    router.push({
      pathname: "/calendar/Detail",
      query: {
        id: "",
        mode: "ADD",
        type: type
      },
    });
  }

  function goEdit(id: string, type: string) {
    router.push({
      pathname: "/calendar/Detail",
      query: {
        id: id,
        mode: "EDIT",
        type
      },
    });
  }

  function goView(id: string) {
    router.push({
      pathname: "/calendar/Detail",
      query: {
        id: id,
        mode: "VIEW"
      },
    });
  }

  //Fixed Annual PH**
  const columns2: any[] = [

    {
      title: "Date",
      dataIndex: "psholdat",
      key: "psholdat",
      render: (text: string) => {
        const [day, month, year] = text.split('/');

        const date = new Date(`${year}-${month}-${day}`);

        const formattedDay = String(date.getDate()).padStart(2, '0');

        const formattedMonth = date.toLocaleString('en-us', { month: 'short' });

        return `${formattedDay} ${formattedMonth}`;  // Return in DD Mon format
      },
    }
    ,
    {
      title: "Annual Public Holiday",
      dataIndex: "psholcde",
      key: "psholcde",
      render: (_: any, record: any) => (
        <Text>{`${record.psholdsc}`}</Text>
      )
    },

    {
      title: "Action",
      key: "action",
      align: "right",
      render: (_: any, record: any) => (
        <Flex justifyContent="flex-end">
          <Space size="small"  >
            {/* <IconButton
              // colorScheme={"blue"}
              icon={<AiFillEye />}
              aria-label={"view"}
              onClick={() => showInfo(record)}
            /> */}
            {
              // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.calendar_EDIT)) &&
              (
                <Tooltip label='Edit' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="blue"
                    sx={{ _hover: { backgroundColor: Colors.PRIMARY, color: Colors.BACKGROUND } }}
                    icon={<BsPencil />}
                    aria-label={"edit"}
                    onClick={() => goEdit(record?.id, tabb)}
                  />
                </Tooltip>

              )
            }
            {
              // todo
              // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.calendar_DEL)) &&
              (
                <Tooltip label='Delete' fontSize='sm'>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    borderRadius={2}
                    colorScheme="red"
                    sx={{ _hover: { backgroundColor: Colors.DANGER, color: Colors.BACKGROUND } }}
                    icon={<IoTrash />}
                    aria-label={"delete"}
                    onClick={() => alertRemove(record?.id, record?.psdsgdsc)}
                  />
                </Tooltip>
              )
            }

            <TableMenu menus={[
              {
                url: `/maintLogs`,
                query: {
                  id: record?.id,
                  file: extra.file
                },
                label: "Maint Log",
                breadcrumbRoute: [
                  {
                    title: "Calendar",
                    href: `/Calendar`,// Add parameter if needed eg. /generalParameter/?id=123
                  },
                  {
                    title: "Maintenance Log",
                  },
                ]
              }
            ]} />

          </Space>
        </Flex>
      ),
    },
  ];

  //Working day**
  const [fetchedData, setFetchedData] = useState<Day[]>([]);
  const [load, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        // Call the API function with the appropriate requestURL
        const data = await api(
          'pswdypar/list/', // Your endpoint
          'GET',                          // HTTP method
          {},                             // No additional data
          {},                             // No headers if not needed
          false,                                                    // extraType parameters if needed
        );


        setFetchedData(data.message.data);
        setWorkdays(data.message.data)
        // console.log(data.message.data, "data.message.data")
      } catch (err: any) {
        setError(err.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading when the fetch is complete
      }
    }

    fetchData();
  }, []);// Empty dependency array to run only on component mount

  // Define initialValues with the correct type
  const initialValues = {
    days: [] as Day[], // Set it as an empty array initially
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => {
      onSubmit(values.days); // Pass the array of days for submission
    },
  });

  useEffect(() => {
    if (fetchedData.length > 0 && !isDataInitialized) {
      formik.setValues({
        days: fetchedData.map((day) => ({
          id: day.pswdycde,         // Using pswdycde as the unique identifier
          pswdycde: day.pswdycde,   // The day code
          pswdydsc: day.pswdydsc,   // The description
          pswdyind: day.pswdyind,   // Use the provided value for pswdyind
        })),
      });

      setIsDataInitialized(true); // Mark data as initialized to prevent further updates
    }
  }, [fetchedData, isDataInitialized, formik]); // Only run when fetchedData or formik changes


  async function onSubmit(data: Day[]) {
    for (const day of data) {
      const payload = {
        id: day.id,               // e.g., "MONDAY"
        pswdycde: day.pswdycde,   // e.g., "MONDAY"
        pswdydsc: day.pswdydsc,   // e.g., "Monday"
        pswdyind: day.pswdyind,   // e.g., "Y" or "N"
      };

      // Send the request for each day
      const { success } = await sendRequest({
        fn: getmanageWorkDay(payload),
        formik,
      });

      if (success) {
        setTimeout(() => {
          showModal(dispatch, {
            title: "Update item",
            message: "Record Updated",
          });
          router.back();
        }, 200);
      } else {
        // Handle failure (optional)
        console.error(`Failed to update day ${day.pswdycde}`);
      }
    }
  }


  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Flex justifyContent={"space-between"} pl={4} pr={4} pt={4}>
            <Flex direction={"column"} alignSelf={"center"}>
              <Text fontSize={"3xl"} fontWeight="500" mb={1}>
                System Calendar Configuration
              </Text>
              <Breadcrumbs breadcrumbItems={[
                {
                  title: "Parameter"
                },
                {
                  title: "Calendar Parameter"
                },
              ]} />
            </Flex>

            <Space size="small">
              {tabIndex == 0 && (
                ""
              )
              }
              {tabIndex == 1 && (
                <Box
                  display={"flex"}
                  alignSelf={"center"}
                  pr={{
                    base: 0,
                    md: Spacing.containerPx,
                  }}
                >
                  {
                    // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                    (
                      <Buttons
                        buttonDefaultType={"ADD"} onclick={() => goAdd(tabb)}
                      />
                    )
                  }
                </Box>
              )
              }
              {tabIndex == 2 && (
                <Box
                  display={"flex"}
                  alignSelf={"center"}
                  pr={{
                    base: 0,
                    md: Spacing.containerPx,
                  }}
                >
                  {
                    // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                    (
                      <Buttons
                        buttonDefaultType={"ADD"} onclick={() => goAdd(tabb)}
                      />
                    )
                  }
                </Box>
              )
              }
              {tabIndex == 3 && (
                <>
                  {/* <Buttons
                    buttonDefaultType={"BACK"} onclick={() => router.back()}
                  /> */}
                  {/* {
                  mode && mode !== "VIEW" && ( */}
                  <Buttons
                    buttonDefaultType={"SAVE"} buttonLoading={loading}
                  />
                  {/* )} */}
                </>)}

            </Space>
          </Flex>
          <Flex mt={4} bgColor="#fff" py={2}>
            <Tabs index={tabIndex} onChange={(index) => setTabIndexx(index)}>
              <Flex
                bgColor="#fff"
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                gap={5}
              >
                {/* <TabList
                  border={0}
                >
                  <Tab
                    key={`promo-tab-1`}
                    py={3}
                    whiteSpace={"nowrap"}
                    ml={{
                      base: 0,
                      md: Spacing.containerPx,
                    }}
                    fontWeight={tabIndex == 0 ? "medium": "normal"}
                    color={tabIndex == 0? "blue.600": "grey"}
                    paddingBottom={"3px"}
                    borderBottomWidth={2}

                  >
                    Calendar
                  </Tab>
                  {
                    // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                    <>
                      <Tab
                        key={`promo-tab-2`}
                        py={3}
                        whiteSpace={"nowrap"}
                        ml={{
                          base: 0,
                          md: Spacing.containerPx,
                        }}
                        fontWeight={tabIndex == 1 ? "medium": "normal"}
                        color={tabIndex == 1? "blue.600": "grey"}
                        paddingBottom={"3px"}
                        borderBottomWidth={2}

                      >
                        Annual Variable PH
                      </Tab>


                    </>

                  }
                  {
                    // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                    <>
                      <Tab
                        key={`promo-tab-3`}
                        py={3}
                        whiteSpace={"nowrap"}
                        ml={{
                          base: 0,
                          md: Spacing.containerPx,
                        }}
                        fontWeight={tabIndex == 2 ? "medium": "normal"}
                        color={tabIndex == 2? "blue.600": "grey"}
                        paddingBottom={"3px"}
                        borderBottomWidth={2}

                      >
                        Annual Fixed PH
                      </Tab>


                    </>

                  }
                  {
                    // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                    <>
                      <Tab
                        key={`promo-tab-4`}
                        py={3}
                        whiteSpace={"nowrap"}
                        ml={{
                          base: 0,
                          md: Spacing.containerPx,
                        }}
                        fontWeight={tabIndex == 3 ? "medium": "normal"}
                        color={tabIndex == index? "blue.600": "grey"}
                        paddingBottom={"3px"}
                        borderBottomWidth={2}

                      >
                        Working Day
                      </Tab>


                    </>

                  }
                </TabList> */}
                <TabList border={0}>
                  <CustomTabs label="Calendar" index={0} selectedTabIndex={tabIndex}/>
                  <CustomTabs label="Annual Variable PH" index={1} selectedTabIndex={tabIndex}/>
                  <CustomTabs label="Annual Fixed PH" index={2} selectedTabIndex={tabIndex}/>
                  <CustomTabs label="Working Day" index={3} selectedTabIndex={tabIndex}/>
                </TabList>

              </Flex>
            </Tabs>
          </Flex>
          {tabIndex === 0 && (
            <Box display="flex" flexDir="row" gap={3} width="100%">

              <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
                style={{ flex: 0.8 }}
              >
                <div style={{ ...styles.calendarContainer }}>
                  <Box display="flex" flexDir="column" gap={6} width="100%">

                    {/* Year Selector */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",

                        cursor: "pointer",

                        gap: "30px",  // Adds space between the years
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Previous Year (greyed out and clickable) */}
                      <div
                        style={{
                          fontSize: "20px",
                          color: "grey",  // Grey color for previous year
                          opacity: 0.6,   // Slightly faded
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => handleYearClick(selectedYear - 1)}  // Change to previous year
                      >
                        {selectedYear - 1}
                      </div>

                      {/* Current Year (highlighted and clickable) */}
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                          color: "black",  // Highlight the current year
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => handleYearClick(selectedYear)}  // Select the current year
                      >
                        {selectedYear}
                      </div>

                      {/* Next Year (greyed out and clickable) */}
                      <div
                        style={{
                          fontSize: "20px",
                          color: "grey",  // Grey color for next year
                          opacity: 0.6,   // Slightly faded
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => handleYearClick(selectedYear + 1)}  // Change to next year
                      >
                        {selectedYear + 1}
                      </div>
                    </div>

                    <div style={{ ...styles.calendar }} >
                      {calendarData.map((month, monthIndex) => (
                        <div key={monthIndex} style={styles.month}>
                          <h3>{new Date(0, monthIndex).toLocaleString('en-us', { month: 'long' })}</h3>

                          {/* Days of the week header */}
                          <div style={styles.weekdays}>
                            <h4>S</h4>
                            <h4>M</h4>
                            <h4>T</h4>
                            <h4>W</h4>
                            <h4>T</h4>
                            <h4>F</h4>
                            <h4>S</h4>
                          </div>

                          {/* Days grid */}
                          <div style={styles.days}>
                            {month.map((day, dayIndex) => {
                              // Check if the day matches the selected date
                              const isSelected = day.date && day.date.toDateString() === selectedDate.toDateString();

                              return (
                                <span
                                  key={dayIndex}
                                  onClick={() => handleDateClick(day.date)}
                                  style={{
                                    ...(
                                      day.date === null
                                        ? styles.placeholder
                                        : day.isHoliday
                                          ? styles.holiday
                                          : day.isBusinessDay
                                            ? styles.workday
                                            : styles.normalDay
                                    ),
                                    ...(isSelected ? styles.selectedDay : {}), // Apply selected day style if it's the selected date
                                  }}
                                >
                                  {day.date ? day.date.getDate() : ''}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                  </Box>
                </div>
              </Card>
              <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
                style={{ flex: 0.2 }}
              >
                <div style={{ ...styles.details }}>
                  {/* <h4>{formatDate(selectedDate)}</h4> */}
                  <Box display="flex" flexDir="column" gap={6} width="100%" >
                    <Text fontSize="19pt" fontWeight={"500"} >
                      {formatDate(selectedDate)}
                    </Text>
                    <Box display="flex" flexDir="column" width="100%">
                      <FormLabel style={styles.detailLabel}>Business Date:</FormLabel>
                      <RadioGroup
                        value={isWorkday(selectedDate.toLocaleString('en-us', { weekday: 'long' })) ? "Y" : "N"}
                      >
                        <Stack direction="row">
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>

                    {/* Public Holiday Section */}
                    <Box display="flex" flexDir="column" width="100%">
                      <FormLabel style={styles.detailLabel}>Public Holiday:</FormLabel>
                      <RadioGroup
                        value={isHoliday(selectedDate) ? "Y" : "N"}
                      >
                        <Stack direction="row">
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>

                    {/* Optional Remark for Public Holiday */}
                    {isHoliday(selectedDate) ? (
                      <div>
                        <label style={styles.detailLabel}>Remark:</label>
                        <p>{isHoliday(selectedDate)?.psholdsc}</p>
                      </div>
                    ) : <div> <label style={styles.detailLabel}>Remark:</label>
                      <p>-</p></div>}

                  </Box>

                </div>
              </Card>
            </Box>

          )}
          {tabIndex === 1 && <Card p={1} mt={4}>
            <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex"
              >
                {/* <Text fontSize="19pt" fontWeight={"500"} >
                  Annual Variable Public Holiday
                </Text> */}
                <SubHeader labelText="Annual Variable Public Holiday" />

                {/* <Space size="middle">
                <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                />
                <Select
                  name="DebitOrCredit"
                  onChange={categoryOnchange}
                  placeholder="Please Select Debit/Credit"
                  value={category}
                >
                  {ddlData?.TRNSDORC?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>

                <Select
                  name="aff"
                  onChange={affOnchange}
                  placeholder="Please Select Affect Code"
                  value={aff}
                >
                  {ddlData?.TRNSAFFCD?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
              </Space> */}
              </Box>
            </Flex>
            <Table
              columns={columns}
              data={tableData}
              refreshFn={fetchholiday}
              totalRecords={totalRecords}
              extraParams={{
                psholtyp: "V",

              }}
            //onDoubleClick={showInfo}
            //length={pageSize}
            />
          </Card>}

          {tabIndex === 2 && <Card p={1} mt={4}>
            <Flex bgColor="#fff" justifyContent={"space-between"} p={3}>
              <Box
                pr={{
                  base: 0,
                  md: Spacing.containerPx,
                }}
                display="flex"
              >
                {/* <Space size="middle">
                <Input
                  type="text"
                  name="search"
                  onChange={searchOnChange}
                  placeholder="Search"
                  value={search}
                />
                <Select
                  name="DebitOrCredit"
                  onChange={categoryOnchange}
                  placeholder="Please Select Debit/Credit"
                  value={category}
                >
                  {ddlData?.TRNSDORC?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>

                <Select
                  name="aff"
                  onChange={affOnchange}
                  placeholder="Please Select Affect Code"
                  value={aff}
                >
                  {ddlData?.TRNSAFFCD?.map((option: DDL_TYPES) => (
                    <option key={option.prgecode} value={option.prgecode}>
                      {option.prgedesc}
                    </option>
                  ))}
                </Select>
              </Space> */}
                {/* <Text fontSize="19pt" fontWeight={"500"} >
                  Annual Fixed Public Holiday
                </Text> */}
                <SubHeader labelText="Annual Fixed Public Holiday" />

              </Box>
            </Flex>
            <Table
              columns={columns2}
              data={tableData}
              refreshFn={fetchholiday}
              totalRecords={totalRecords}
              extraParams={{
                psholtyp: "F",

              }}
            //onDoubleClick={showInfo}
            //length={pageSize}
            />
          </Card>}
          {tabIndex === 3 &&

            (
              <Card
                p={4}
                mt={`${Spacing.containerPx}`}
                className="grid grid-cols-1 gap-6"
              >
                {/* <Text fontSize="19pt" fontWeight={"500"} >
                  Working Day Configuration
                </Text> */}
                <SubHeader labelText="Working Day Configuration" />

                {formik.values.days.map((item, index) => (

                  <div key={item.id}>
                    <Box display="flex" flexDir="row" gap={6} width="100%"  >

                      <FormLabel style={{ flex: 0.1 }}>{item.pswdydsc}</FormLabel>
                      < RadioGroup
                        value={item.pswdyind}
                        onChange={(value) => formik.setFieldValue(`days[${index}].pswdyind`, value)}
                        style={{ flex: 0.5 }}
                      >
                        <Stack direction="row" gap={8}>
                          <Radio value="Y">Yes</Radio>
                          <Radio value="N">No</Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </div>

                ))}




              </Card>
            )
          }


        </Box>
        <Flex justifyContent="flex-end" pl={10} pr={10} pt={10} >
          <Box>
            <Space size="small">
              {tabIndex == 0 && (
                ""
              )
              }
              {tabIndex == 1 && (
                // <Box
                //   display={"flex"}
                //   alignSelf={"center"}
                //   pr={{
                //     base: 0,
                //     md: Spacing.containerPx,
                //   }}
                // >
                //   {
                //     // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                //     (
                //       <Buttons
                //         buttonDefaultType={"ADD"} onclick={() => goAdd(tabb)}
                //       />
                //     )
                //   }
                // </Box>
                ""
              )
              }
              {tabIndex == 2 && (
                // <Box
                //   display={"flex"}
                //   alignSelf={"center"}
                //   pr={{
                //     base: 0,
                //     md: Spacing.containerPx,
                //   }}
                // >
                //   {
                //     // (homeData?.access && checkAccessMatrix(homeData?.access, accessType.PROD_ADD)) &&
                //     (
                //       <Buttons
                //         buttonDefaultType={"ADD"} onclick={() => goAdd(tabb)}
                //       />
                //     )
                //   }
                // </Box>
                ""
              )
              }
              {tabIndex == 3 && (
                <>
                  {/* <Buttons
                    buttonDefaultType={"BACK"} onclick={() => router.back()}
                  /> */}
                  {/* {
                  mode && mode !== "VIEW" && ( */}
                  <Buttons
                    buttonDefaultType={"SAVE"} buttonLoading={loading}
                  />
                  {/* )} */}
                </>)}

            </Space>
          </Box>
        </Flex>
      </form>

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
