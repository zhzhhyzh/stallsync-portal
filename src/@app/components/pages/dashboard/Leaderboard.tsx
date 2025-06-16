import React, { useState } from "react";
import { Card, CardBody, Box, Flex, Text, Avatar, VStack, CardHeader, Select } from "@chakra-ui/react";
import { useAppDispatch } from "@app/hooks/useRedux";
import { fetchTop10 } from "@app/redux/dashboard/slice";

// Leaderboard component
const Leaderboard = ({
    leaderboardData = [], // Default to empty array if undefined

}: any) => {

    const dispatch = useAppDispatch()
    const [ option, setOption] = useState("lastMonth")
    const onChange = async (event:any)=>{
        setOption(event.target.value)
        await dispatch(
          fetchTop10({option:event.target.value})
        ); //fire api (call action)
    
      }
    
    // Subcomponent for rendering top 3 positions
    const TopPosition = ({ isChampion, name, points, color, fontSize, ...props }: any) => (
        <Box {...props} left="2%" textAlign="center" position="relative">
            <Avatar name={name}  size="lg" mb={2} />
            <Text position={"relative"} bottom={isChampion ? "35px": '20px'}  fontSize="lg" fontWeight="bold" pt={fontSize ? 12 : 8}>{name}</Text>
            <Text position={"relative"} bottom={isChampion ? "35px": '20px'} color={color} fontSize={fontSize || "lg"} pb={fontSize ? 12 : 8} fontWeight="medium">
                {points?
                
               ( <>RM{points?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>)
        :"-"}    </Text>
        </Box>
    );

    return (
        <Card borderRadius={0} flex={1}>
            {/* <CardHeader py={4} mb={8} display="flex" justifyContent="space-between">
        <Text fontSize="14pt" fontWeight="500" textTransform="uppercase">Club Leaderboard</Text>
        <Select width="100%" onChange={handleSelectChange}>
          {choiceArr?.map((choice: any) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </Select>
      </CardHeader> */}

            <CardBody h="100%" display="flex" flexDirection={"column"} alignItems="start" justifyContent="start">
                <Flex w="full" flexDir="row" justifyContent={"space-between"} alignItems={"center"} >
                <Text
                    mt="1px"
                    whiteSpace="nowrap"
                    textTransform="uppercase"
                    fontSize="16px"
                    color="black"
                    pl="5px"
                    fontWeight="medium"
                    pb=".3rem"
                >
                    Top 20 Agents
                </Text>
                <Flex>
                <Select onChange={onChange} value={option}>
                    <option  value="monthToDate">Month To Date</option>
                    <option value="last12months">Last Month</option>
                    <option value="last3months">Last 3 Months</option>
                    <option  value="last6months">Last 6 Months</option>
                </Select>
                </Flex>
                </Flex>
             
                <Box w="100%" mx="auto" mt={5}>
                    {/* Top 3 */}
                    {/* <Flex
                        borderRadius="xl"
                        h="150px"
                        justify="space-around"
                        align="center"
                        mb={6}
                        bg="gray.100"
                    >
                        <TopPosition
                            name={leaderboardData[1]?.name || ""}
                            points={leaderboardData[1]?.psconamt || ""}
                            color="blue.500"
                            avatarPosition={{ right: '25%', bottom: 24 }}
                            flex={1}  // Each position gets equal space
                        />
                        <TopPosition
                            isChampion={true}
                            name={leaderboardData[0]?.name || ""}
                            points={leaderboardData[0]?.psconamt || ""}
                            color="yellow.500"
                            fontSize={"xl"}
                            avatarPosition={{ right: '10%', bottom: 32 }}
                            flex={1}  // Each position gets equal space
                        />
                        <TopPosition
                            name={leaderboardData[2]?.name || ""}
                            points={leaderboardData[2]?.psconamt || ""}
                            color="green.500"
                            avatarPosition={{ right: '25%', bottom: 24 }}
                            flex={1}  // Each position gets equal space
                        />
                    </Flex> */}


                    {/* Remaining leaderboard members */}
                    <VStack spacing={4} align="stretch">
                        {leaderboardData?.map((user: any, index: number) => (
                            <Flex
                                key={index}
                                justify="space-between"
                                align="center"
                                p={4}
                                py={2}
                                bg="gray.100"
                                borderRadius="md"
                                w="100%"
                            >
                                <Flex minW={80} align="center">
                                    <Text textAlign="right" minW={6} fontWeight="normal" color="gray">
                                        {index +1}.
                                    </Text>
                                    <Avatar name={user.name} size="sm" mx={4} />
                                    <Text fontSize="md">{user.name}</Text>
                                </Flex>
                                <Text fontWeight="normal" color="gray">RM{user?.psconamt?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                            </Flex>
                        ))}
                    </VStack>
                </Box>
            </CardBody>
        </Card>
    );
};

export default Leaderboard;
