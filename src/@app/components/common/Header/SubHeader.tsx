import { FormLabel, TextProps, Stack , Text, Divider, Flex} from '@chakra-ui/react';
import React from 'react';

export default function SubHeader(props: SubHeaderDefaultProps) {

  const { 
    labelText,
  } = props;
  
  const text = labelText || "";
  return (
    <Flex alignItems={"center"} flexDirection={"row"} mb={"20px"}>
    <Divider orientation='vertical' height={"15px"}
      borderWidth="2px" borderColor="#6392D6" mr={2} opacity={"100%"} />

    <Text fontSize="15pt" fontWeight={"500"} color={"#6392D6"}>
    {labelText}
    </Text>
  </Flex>
  );
};

type SubHeaderDefaultProps = TextProps & {
  labelText?: string | undefined;
};
