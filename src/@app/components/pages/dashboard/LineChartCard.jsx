import { useAppDispatch } from "@app/hooks/useRedux";
import { fetchSales } from "@app/redux/dashboard/slice";
import { RadioGroup, Radio, Box, Card, CardBody, Flex, Select, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const LineChartCard = ({data}) => {
  const lineChartOptions = {
    chart: {
      zoom: {
        enabled: false, // Disable zoom
      },
      toolbar: {
        show: false, // Hide the toolbar (which includes zoom/pan and other interactive tools)
      },
      type: "line", // Set chart type to 'line'
    },
    xaxis: {
        categories: [...new Set(data.map(item => item.month))],

    },
    stroke: {
      curve: "smooth", // Smooth line curves
    },
    markers: {
      size: 5, // Size of the markers on the lines
    },
    legend: {
      show: false, // Hide the legend from ApexCharts
    },
    yaxis: {
      labels: {
        formatter: value=>new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value),
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%", // Adjust width for smaller screens
          },
        },
      },
    ],
  };

  const colors = ["#3050F3","#FF4500"]
  const lineChartSeries = transformData(data)

  function transformData(data) {
    // Extract unique product codes
    const productCodes = [...new Set(data.map(item => item.psprdcde))];
  
    // Extract unique months in order
    const months = [...new Set(data.map(item => item.month))];
  
    // Group sales data by product codes
    const result = productCodes.map((productCode, index) => {
      const productData = months.map(month => {
        const matchingItem = data.find(
          item => item.psprdcde === productCode && item.month === month
        );
        return matchingItem ? matchingItem.totalSales : 0;
      });
  
      return {
        name: productCode,
        data: productData,
        color: index === 0 ? "#3050F3" : "#FF4500", // Dynamic color assignment
      };
    });
  
    return result;
  }
  

  const onChange = async (value)=>{
    setGroupInd(value)

    await dispatch(
      fetchSales({groupInd:Boolean(value)})
    ); //fire api (call action)

  }



  const[ groupInd, setGroupInd ] = useState('false')
  const dispatch = useAppDispatch();

  return (
    <Card
      flex={1}
      pb={2}
      px={1}
      pt={0}
      mx={0}
      h="400px" // Adjust the height of the card
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
         <Flex w="100%" flexDir="row" alignItems={"center"} justifyContent="space-between">


<Text flex={3}
           mt="1px"
           whiteSpace="nowrap"
           textTransform="uppercase"
           fontSize="16px"
           color="black"
           pl="18px"
           fontWeight="medium"
           verticalAlign={"middle"}
       >
            Total Sales (Year To Date)
            </Text>        

<RadioGroup onChange={onChange} value={groupInd} gap="10px" display='flex'  flexDir='row' flex={1}> 
<Radio   value={'false'}>Personal
</Radio>
<Radio value={'true'}>Group
</Radio>

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
      
        {/* Custom legend implemented using Flexbox */}
        <Box
          w="full"
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          mt={4}
        >
          <Box
            display="flex"
            alignItems="center"
            mr={5}
            fontSize="14px"
            fontWeight="bold"
            color="#333"
          >
            {" "}
            {/* Line 1: Horizontal line */}
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
                {/* Line: Horizontal line with dynamic color */}
                <Box
                  as="hr"
                  width="30px"
                  borderTop={`4px solid ${series.color}`} // Dynamically use the line color
                  borderRadius="1px"
                  mr={2}
                />
                {series.name}
              </Box>
            ))}
          </Box>
        </Box>
        <Box width="100%" h="100%">
          <ReactApexChart
            width="100%" // Ensure the chart width fits the card width
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={300} // Set the height of the chart
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default LineChartCard;
