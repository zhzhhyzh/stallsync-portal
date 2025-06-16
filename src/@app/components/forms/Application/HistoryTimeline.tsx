// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "@app/components/common/Card/Card";
import CardBody from "@app/components/common/Card/CardBody.js";
import CardHeader from "@app/components/common/Card/CardHeader.js";
import TimelineRow from "@app/components/forms/Application/TimelineRow";
import React, {useEffect} from "react";
import useFetchApplicationDetail from "@app/hooks/selector/useFetchApplicationDetail";
import { useAppDispatch } from "@app/hooks/useRedux";
import { getApplicationDetail } from "@app/redux/application/slice";
import Spacing from "@app/constants/Spacing";
import { FaRegPlusSquare, FaRegClock, FaRegPaperPlane, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { MdPendingActions } from "react-icons/md";
import { RiFileSearchLine } from "react-icons/ri";
import { BsFillSendPlusFill } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import SubHeader from "@app/components/common/Header/SubHeader";

const HistoryTimeline = ({ ...props }:any) => {
  const textColor = useColorModeValue("gray.700", "white");
  const id = props.id;
  
  const [detailData, onInit, loading, reset] = useFetchApplicationDetail(
    id,
  );
  const dispatch = useAppDispatch();

  useEffect(()=>{
    dispatch(getApplicationDetail({id}))
  },[id])
  useEffect(() => {
    props.setLoading(loading);
  }, [loading]);

  return (
    <Card
    p={4}
    mt={`${Spacing.containerPx}`}
    className="grid grid-cols-1 "
  >

<SubHeader labelText="History"/>

      {/* <CardHeader p='22px 0px 35px 14px'>
        <Flex direction='column'>
          <Text fontSize='lg' color={textColor} fontWeight='bold' pb='.5rem'>
            TEST
          </Text>
          <Text fontSize='sm' color='gray.400' fontWeight='normal'>
            <Text fontWeight='bold' as='span' color='teal.300'>
              {`10%`}
            </Text>{" "}
            this month.
          </Text>
        </Flex>
      </CardHeader> */}

      <CardBody display='flex' flexDir='column' alignItems='start' ps='20px' pe='0px' mb='31px' position='relative'>
        <Flex  direction='column'>
          {detailData?.history?.map((row:any, index:number, arr:any[]) => {
            return (
              <TimelineRow
                key={row.id}
                logo={ getStatusIcon(row?.psaplstn) }
              
                title={row.psaplstndsc}
                date={row.psaplstd}
                by={row.crtuser}
                remarks={row.psaplrmk}
                // color={row.color}
                index={index}
                arrLength={arr.length}
              />
            );
          })}
        </Flex>
      </CardBody>
    </Card>
  );
};
const getStatusIcon = (status:string) => {
  switch (status) {
    case 'NEW':
      return BsFillSendPlusFill ;
    case 'PEN':
      return RiFileSearchLine ;
    case 'PAV':
      return MdPendingActions ;
    case 'REJ':
      return MdCancel ;
    case 'APV':
      return FaCheckCircle ;
    default:
      return null; // Return null if status doesn't match
  }
};



export default HistoryTimeline;
