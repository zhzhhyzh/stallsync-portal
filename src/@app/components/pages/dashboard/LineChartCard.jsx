import { useAppDispatch } from "@app/hooks/useRedux";
import { fetchSales } from "@app/redux/dashboard/slice";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Select,
  Text
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const LineChartCard = ({ data }) => {
  const dispatch = useAppDispatch();
  const [groupInd, setGroupInd] = useState("false");
  const [range, setRange] = useState("year");

 
  // Filter based on selected range
  const filteredData = useMemo(() => {
    if (range === "3month") {
      return data.slice(-3);
    } else if (range === "month") {
      return data.slice(-1);
    }
    return data; // full year
  }, [data, range]);

  const lineChartSeries = useMemo(() => transformData(filteredData), [filteredData]);

  function transformData(inputData) {
    return [
      {
        name: "Total Sales",
        data: inputData.map((item) => item.totalSales),
        color: "#3050F3",
      },
    ];
  }

  const lineChartOptions = {
    chart: {
      zoom: { enabled: false },
      toolbar: { show: false },
      type: "line",
    },
    xaxis: {
      categories: filteredData.map((item) => item.month),
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
    },
    legend: {
      show: false,
    },
    yaxis: {
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value),
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: "100%" },
        },
      },
    ],
  };

  return (
    <Card flex={1} pb={2} px={1} pt={0} mx={0} h="400px" bgColor="#fff" borderRadius={0}>
      <CardBody
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="start"
      >
        <Flex w="100%" alignItems="center" justifyContent="space-between">
          <Text
            flex={3}
            mt="1px"
            whiteSpace="nowrap"
            textTransform="uppercase"
            fontSize="16px"
            color="black"
            pl="18px"
            fontWeight="medium"
          >
            Total Sales (Year To Date)
          </Text>

          {/* <Select w="150px" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="year">A Year</option>
            <option value="3month">3 Month</option>
            <option value="month">Month</option>
          </Select> */}
        </Flex>

        <Box w="full" display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
          {lineChartSeries.map((series, index) => (
            <Box
              display="flex"
              alignItems="center"
              mr={5}
              fontSize="14px"
              fontWeight="bold"
              color="#333"
              key={index}
            >
              <Box
                as="hr"
                width="30px"
                borderTop={`4px solid ${series.color}`}
                borderRadius="1px"
                mr={2}
              />
              {series.name}
            </Box>
          ))}
        </Box>

        <Box width="100%" h="100%">
          <ReactApexChart
            width="100%"
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={300}
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default LineChartCard;
