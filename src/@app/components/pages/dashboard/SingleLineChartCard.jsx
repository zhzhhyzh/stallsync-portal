import Spacing from "@app/constants/Spacing";
import { useAppDispatch } from "@app/hooks/useRedux";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Text
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const SingleLineChartCard = ({ data }) => {
  const dispatch = useAppDispatch();
  const [groupInd, setGroupInd] = useState("false");

  // Transform data into ApexChart format
  function transformOrderData(data) {
    return [
      {
        name: "Total Orders",
        data: data.map(item => item.totalOrders),
        color: "#00BFFF",
      },
    ];
  }

  const lineChartSeries = transformOrderData(data);

  const lineChartOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    xaxis: {
      categories: data.map(item => item.month),
    },
    yaxis: {
      labels: {
        formatter: value =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
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
      show: false,
    },
  };

  return (
    <Card
      flex={1}
      pb={2}
      px={1}
      pt={0}
      h="400px"
      bgColor="#fff"
      borderRadius={0}
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
          alignItems="center"
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
          >
            Total Order Counts
          </Text>
        </Flex>

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
