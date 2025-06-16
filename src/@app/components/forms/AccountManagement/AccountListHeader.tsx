// Chakra imports
import Colors from "@app/constants/Colors";
import {
  Flex,
  Text,
  Grid,
  GridItem,
  Tooltip,
  Tag,
  Image,
} from "@chakra-ui/react";
// assets
import React, { useEffect, useState } from "react";
import Card from "@app/components/common/Card/Card";
import { IoIosPhonePortrait } from "react-icons/io";
import { IoIosMail } from "react-icons/io";
import { GiHouse } from "react-icons/gi";
import { GiOfficeChair } from "react-icons/gi";
import { genDocumentUrl } from "@app/helpers/commonHelper";
import defaultImage from "@app/assets/img/default_profile.png";

export default function AccountListHeader({
  data,
  headerType,
}: AccountListHeaderProps) {
  return (
    <Card w={"full"} p={3} px={6}>
      {headerType == "manual_transaction" ? (
        <>
          <Flex
            flexDir={"column"}
            alignSelf={"center"}
            justifyContent={"center"}
            w={"100%"}
            p={5}
          >
            <Grid templateColumns="0.5fr" gap={0.2}>
              <GridItem>
                <Text
                  textTransform={"uppercase"}
                  fontSize={"xl"}
                  fontWeight={"extrabold"}
                >
                  {data?.pscifnme}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontSize={16} fontWeight={500}>
                  {data?.psidnval}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontSize={16} fontWeight={500}>
                  {data?.pscifuid}
                </Text>{" "}
              </GridItem>
              <GridItem>
                <Text fontSize={16} fontWeight={500}>
                  {data?.psconeml}
                </Text>{" "}
              </GridItem>
              <GridItem>
                <Text fontSize={16} fontWeight={500}>
                  {data?.psconphn}
                </Text>{" "}
              </GridItem>
            </Grid>
          </Flex>
        </>
      ) : (
        <Flex
          bgColor="#fff"
          position="relative"
          h="100%"
          flexDir={"row"}
          alignItems={"flex-start"}
        >
          {headerType && headerType == "detail" && (
            <Flex alignSelf={"center"} pr={5} w={"250px"}>
              <Image
                boxSize="150px"
                objectFit="cover"
                src={genDocumentUrl(data?.imageName, "10")}
                alt={data?.pscifnme}
                fallbackSrc={defaultImage.src}
              />
            </Flex>
          )}

          <Flex
            flexDir={"column"}
            alignSelf={"center"}
            justifyContent={"center"}
            w={"350px"}
          >
            <Grid templateColumns="0.5fr" gap={0.2}>
              <GridItem>
                <Text
                  textTransform={"uppercase"}
                  fontSize={"xl"}
                  fontWeight={"extrabold"}
                >
                  {data?.pscifnme}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontSize={16} fontWeight={500}>
                  {data?.psidnval}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontSize={16} fontWeight={500}>
                  {data?.pscifuid}
                </Text>{" "}
              </GridItem>
            </Grid>
          </Flex>

          <Flex direction={"column"} alignSelf={"center"} w={"350px"}>
            <Grid templateColumns="0.3fr 2fr" gap={2}>
              <Tooltip label="Phone No." fontSize="sm">
                <GridItem>
                  <IoIosPhonePortrait size={28} />
                </GridItem>
              </Tooltip>
              <GridItem alignSelf={"center"} whiteSpace={"break-spaces"}>
                <Text>{data?.psconphn}</Text>
              </GridItem>
              <Tooltip label="Email" fontSize="sm">
                <GridItem>
                  <IoIosMail size={28} />
                </GridItem>
              </Tooltip>
              <GridItem alignSelf={"center"}>
                <Text>{data?.psconeml}</Text>
              </GridItem>
            </Grid>
          </Flex>

          <Flex
            flexDir={"column"}
            alignSelf={"center"}
            justifyContent={"center"}
            w={"350px"}
          >
            <Grid templateRows="repeat(5, 1fr)" templateColumns="0.5fr 2fr">
              <GridItem rowSpan={5} colSpan={1} alignContent={"center"}>
                <GiHouse size={28} />
              </GridItem>
              <GridItem>{data?.psaddrl1}</GridItem>
              <GridItem>{data?.psaddrl2}</GridItem>
              <GridItem>{data?.psaddpos}</GridItem>
              <GridItem>{data?.psaddcty + ", " + data?.psaddsta}</GridItem>
              <GridItem>{data?.home_no}</GridItem>
            </Grid>
          </Flex>

          <Flex
            flexDir={"column"}
            alignSelf={"center"}
            justifyContent={"center"}
            w={"350px"}
          >
            <Grid templateRows="repeat(5, 1fr)" templateColumns="0.5fr 2fr">
              <GridItem rowSpan={5} colSpan={1} alignContent={"center"}>
                <GiOfficeChair size={28} />
              </GridItem>
              <GridItem>{data?.psempca1}</GridItem>
              <GridItem>{data?.psempca2}</GridItem>
              <GridItem>{data?.psempcap}</GridItem>
              <GridItem>{data?.psempcct + ", " + data?.psempcas}</GridItem>
              <GridItem>{data?.psempcph}</GridItem>
            </Grid>
          </Flex>

          {headerType && headerType == "detail" && (
            <Flex flexDir={"column"} justifyContent={"center"} gap={1}>
              {data?.psaccsts && data.psaccsts == "A" ? (
                <Tag variant="solid" colorScheme={"green"}>
                  Active
                </Tag>
              ) : (
                <Tag variant="solid" colorScheme={"red"}>
                  In Active
                </Tag>
              )}
              {data?.psaccdlc && data?.psaccdlc != "" && (
                <Tag
                  variant="solid"
                  colorScheme={"red"}
                  justifyContent={"center"}
                >
                  {data?.psaccdlc}
                </Tag>
              )}
            </Flex>
          )}
        </Flex>
      )}
    </Card>
  );
}

interface AccountListHeaderProps {
  data: any;
  headerType?: string;
}
