import Colors from "@app/constants/Colors";
import { Flex, Text } from "@chakra-ui/react";
import { ImFileEmpty } from "react-icons/im";

export default function EmptyData() {

    return (
        <Flex alignItems={'center'} justifyContent={'center'} flexDirection={'column'} py={10}>
            <ImFileEmpty size={30} color={Colors.GRAY} />
            <Text color={Colors.GRAY} fontSize='sm' mt={2}>No data available</Text>
        </Flex>
    )
}