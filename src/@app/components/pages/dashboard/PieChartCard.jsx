import SubHeader from "@app/components/common/Header/SubHeader";
import { Card, CardBody, Flex, Stat, StatLabel, Box, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PieChartCard = ({ data }) => {
  const [tooltip, setTooltip] = useState  ({ visible: false  , content: "", x: 0, y: 0 });
  const chartRef = useRef(null);

  // Optional: Hide tooltip on mouse leave of the chart container
  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };
  const pieChartOptions = {
    chart: {
      // width: "300",
      type: "donut",
    },
    events: {
      mouseMove: function (event, chartContext, config) {
        // If a data point is hovered, config will contain a valid seriesIndex
        if (config.dataPointIndex !== -1) {
          const seriesIndex = config.seriesIndex;
          const label = chartContext.w.config.labels[seriesIndex];
          const value = chartContext.w.config.series[seriesIndex];

          // Update tooltip state with new content and position
          setTooltip({
            visible: true,
            content: `${label}: ${value}`,
            x: event.clientX,
            y: event.clientY,
          });
        } else {
          // Hide tooltip when not hovering on a data point
          setTooltip((prev) => ({ ...prev, visible: false }));
        }
      },
    },


    labels: data?.map((data) => data.psaplstsdsc),
    series: data?.map((data) => data.count),
    // labels: ["New", "Pending Review", "Pending Approval", "Approved", "Rejected"],
    // series: [10, 13, 14, 30, 1],
    plotOptions: {
      pie: {
        startAngle: 0, // Start angle of the chart
        endAngle: 90, // Show only a quarter of the chart
        donut: {
          size: "50%",
        },
      },
    },
    dataLabels: {
      enabled: false,
      followCursor: true, // Tooltip will follow the cursor

    },
    legend: {
      show: false,
    },

    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 300,
    //       },
    //     },
    //   },
    // ],
  };

  const colors = ["#1E90FF", "#78e09d", "#FFA500", "#32CD32", "#FF6347"]; // Define colors for legends

  return (
    <Card
      overflow="hidden"
      flex={1}
      px={1}
      h="170px"
      bgColor="#fff"
      borderRadius={0}
    >
      <CardBody
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="start"
      >
        <Stat>
          <StatLabel
            position="absolute"
            whiteSpace="nowrap"
            textTransform="uppercase"
            fontSize="15px"
            color="black"
            pl="7%"
            fontWeight="medium"
          >
            Applications
          </StatLabel>
        </Stat>
        <Flex ml='auto' w="full"
        >
          {/* Custom Legend */}
          <Flex
            direction="column"
            mt="23px"
            // ml="5%"
            // mr="103px"
            align="space-between"
            w="full"
            minW={"90px"}
          >
            {pieChartOptions.labels.map((label, index) => (
              <Flex key={label} align="center" mb="5px">
                <Box
                  w="12px"
                  h="12px"
                  bgColor={colors[index]}
                  borderRadius="full"
                  mr="8px"
                />
                <Text fontSize="10px" color="black">
                  {label}
                </Text>
              </Flex>
            ))}
          </Flex>
          <Flex position={'relative'} w='100%' flexDir={"row"} justifyContent={"end"} onMouseLeave={handleMouseLeave}> 
            <ReactApexChart
            ref={chartRef}
              style={{ transform: "scaleX(-1)", position: 'relative', left: '50%' }}
              options={pieChartOptions}
              series={pieChartOptions.series}
              type="donut"
              height={300}
            />
             {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 10, // slight offset so it doesn't cover the cursor
            left: tooltip.x + 10,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "4px",
            pointerEvents: "none", // so it doesn't interfere with mouse events
            fontSize: "0.9rem",
            zIndex: 1000,
          }}
        >
          {tooltip.content}
        </div>
      )}
          </Flex>
        </Flex>

      </CardBody>
    </Card>
  );
};

export default PieChartCard;
