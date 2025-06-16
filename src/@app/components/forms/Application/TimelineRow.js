import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

function TimelineRow(props) {
  const { logo, title, date, color, index, arrLength, by, remarks } = props;
  const textColor = useColorModeValue("gray.700", "white.300");
  const bgIconColor = useColorModeValue("white.300", "gray.700");

  return (
    <Flex alignItems="stretch" h="100%" justifyContent="start"  mb="5px">
      <Flex direction="column" >
        <Icon
          as={logo}
          bg={bgIconColor}
          color={color}
          boxSize="32px"  // Sets both height and width

          pe="6px"
          zIndex="1"
          position="relative"
          right={""}
          left={"-12px"}
        />
        <Box
        
          w="2px"
          bg="gray.200"
          h={index === arrLength - 1 ? "15px" : "100%"}
        ></Box>
      </Flex>
      <Flex direction="column" >
        <Text fontSize="md" color={textColor} fontWeight="bold">
          {title}
        </Text>
        <Text fontSize="md" color="gray.400" fontWeight="normal">
          {date}
        </Text>
        <Text fontSize="md" color="gray.400" fontWeight="normal">
          By: {by}
        </Text>
        <Text fontSize="md" color="gray.400" fontWeight="normal">
          Remarks: {remarks?remarks:"-"}
        </Text>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;
