import Spacing from "@app/constants/Spacing";
import { useAppDispatch } from "@app/hooks/useRedux";
import { fetchCommissions } from "@app/redux/dashboard/slice";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const SingleLineChartCard = ({ data }) => {
  const lineChartOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [...new Set(data?.map((item) => item.month))],
    },
    yaxis: {
      labels: {
        formatter: value=>new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value),
      },
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
    },
    legend: {
      show: false, // Hide the legend from ApexCharts
    },
  };

  const lineChartSeries = transformCommissionData(data);

  const onChange = async (value) => {
    setGroupInd(value);

    await dispatch(fetchCommissions({ groupInd: Boolean(value) })); //fire api (call action)
  };

  function transformCommissionData(data) {
    // Extract unique months in order
    // const months = [...new Set(data.map((item) => item.month))];

    // Map totalCommission values into an array
    const commissionData = data?.map((item) => item.totalCommission);

    // Create the result
    const result = [
      {
        name: "Total Commission",
        data: commissionData,
        color: "#00BFFF", // Example color for the commission line
      },
    ];

    return result;
  }
  const [groupInd, setGroupInd] = useState("false");
  const dispatch = useAppDispatch();

  return (
    <Card
      flex={1}
      pb={2}
      px={1}
      pt={0}
      h="400px"
      bgColor="#fff"
      borderRadius={0}
      //   ml={0}
    >
      <CardBody
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="space-between"
      >
        <Flex
          w="100%"
          flexDir="row"
          alignItems={"center"}
          justifyContent="space-between"
        >
          <Text
            flex={3}
            mt="1px"
            whiteSpace="nowrap"
            textTransform="uppercase"
            fontSize="16px"
            color="black"
            pl="18px"
            fontWeight="medium"
            verticalAlign={"middle"}
          >
            Total Commission Paid (Year To Date)
          </Text>

          <RadioGroup
            onChange={onChange}
            value={groupInd}
            gap="10px"
            display="flex"
            flexDir="row"
            flex={1}
          >
            <Radio value={"false"}>Personal</Radio>
            <Radio value={"true"}>Group</Radio>
          </RadioGroup>
          {/* <Select>
                  <option value="personal">
                      Personal
                  </option>
                  <option value="group">
                      Group
                  </option>
                </Select> */}
        </Flex>
        {/* Chart */}
        <Box width="100%" h="100%" mt={9}>
          <ReactApexChart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={300}
            width="100%"
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default SingleLineChartCard;
