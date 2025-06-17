// Chakra imports
import { Flex, Stat, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "@app/components/common/Card/Card";
import CardBody from "@app/components/common/Card/CardBody";
import IconBox from "@app/components/Icons/IconBox";
import React from "react";
import { BsStars } from "react-icons/bs";
import Spacing from "@app/constants/Spacing";

// TypeScript types for props
interface StatisticCardProps {
  icon?: React.ReactNode;
  bgColor: string;
  title: string;
  amount: string | number;
}

// StatisticCard Component
const StatisticCard: React.FC<StatisticCardProps> = ({ icon, bgColor, title, amount }) => {
  const textColor = useColorModeValue("white", "white");

  return (
    <Card
      // pb={2}
      px={1}
      // pt={0}
      h="170px"
      flex={1}
      bgColor={bgColor}
      backgroundSize={"100% 100%"}
      borderRadius={0}
      backgroundRepeat={"no-repeat"}
     zIndex={0}
    >
      <CardBody
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="start"
        justifyContent="start"
        // pt="20px"
        >
          <Stat  w="100%"                 
     
          >
          <StatLabel 
          mt={1}
              // mt="-60px"
              textTransform="uppercase"
              fontSize="15px"
              color="white"
              pl="7%"
              fontWeight="medium"
              // pb=".1rem"
            >
              {title}
            </StatLabel>
            <Flex style={{ position: "relative", }} justifyContent={"center"} dir="row">
              <StatNumber 
                fontWeight="normal"
                fontSize="8xl"
                mt="-4"
                color={textColor}
              >
                {amount}
              </StatNumber>
            </Flex>
       
          </Stat>

          {icon && (
            <IconBox
              style={{ position: "absolute", top: 5, right: 0 }}
              as="box"
              h="100px"
              w="100px"
              bg={bgColor}
              zIndex="-1"
            >
              {icon}
            </IconBox>
          )}
      </CardBody>
    </Card>
  );
};

// Data list for the StatisticCard components
const dummyStatisticData = [
  {
    bgColor: "teal.500",
    title: "Merchants",
    amount: "20",
    icon: <BsStars size={72} opacity={0.1}/>, // Replace with your actual icon component
  },
  {
    bgColor: "blue.500",
    title: "Members",
    amount: "60",
    icon: <BsStars size={72} opacity={0.1}/>, // Replace with your actual icon component
  },
  {
    bgColor: "red.500",
    title: "Products",
    amount: "80",
    icon: <BsStars size={72} opacity={0.1}/> // Replace with your actual icon component
  },
  {
    bgColor: "purple.500",
    title: "Orders",
    amount: "80",
    icon: <BsStars size={72} opacity={0.1}/> // Replace with your actual icon component
  },
  // Add more items as needed
];

type ThreeStatisticCardsProps = {
  data: any[]; // Adjust the type from `any[]` to the expected data type
};
// Parent Component to render the list of cards
const ThreeStatisticCards: React.FC<ThreeStatisticCardsProps>  = ({data:statisticData}:any) => {
  return (
    <Flex justify="space-between" flex={4} align="center" w="100%" gap={Spacing.containerPx}>
      {statisticData?.map((data:any, index:number) => (
        <StatisticCard
          key={index}
          bgColor={dummyStatisticData[index]?.bgColor}
          title={data.description}
          amount={data.counts}
          icon={dummyStatisticData[index]?.icon}
        />
      ))}
    </Flex>
  );
};

export default ThreeStatisticCards;
