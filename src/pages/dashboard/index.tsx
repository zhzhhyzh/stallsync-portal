// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// assets
import peopleImage from "@app/assets/img/people-image.png";
import logoChakra from "@app/assets/svg/logo-white.svg";
import BarChart from "@app/components/Charts/BarChart";
import LineChart from "@app/components/Charts/LineChart";
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  WalletIcon,
} from "@app/components/Icons/Icons.js";
import React, { useEffect } from "react";
import { dashboardTableData, timelineData } from "@app/variables/general";

import Spacing from "@app/constants/Spacing";
import PieChart from "@app/components/pages/dashboard/PieChartCard";
import ThreeStatisticCards from "@app/components/pages/dashboard/StatisticCard";
import LineChartCard from "@app/components/pages/dashboard/LineChartCard";
import SingleLineChartCard from "@app/components/pages/dashboard/SingleLineChartCard";
import Leaderboard from "@app/components/pages/dashboard/Leaderboard";
import AnnouncementCard from "@app/components/pages/dashboard/AnnouncementCard";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import { selectApplications,fetchMain, selectMemberTiers, selecTop10Agents, selectTotalCommission, selectTotalSales } from "@app/redux/dashboard/slice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications)
  const totalSales = useAppSelector(selectTotalSales)
  const totalCommission = useAppSelector(selectTotalCommission)
  const numberBoard = useAppSelector(selectMemberTiers)
  const top10Agents = useAppSelector(selecTop10Agents)
 
  useEffect(() => {
    // Define an async function
    const fetchData = async () => {
      try {
       await dispatch(
          fetchMain({})
        ); //fire api (call action)

      } catch (err) {
        console.log(err);
      }
    };
    fetchData()
  },[])

  const leaderboardData = [
    { ranking: 1, name: "Alice", points: 1500 },
    { ranking: 2, name: "Bob", points: 1200 },
    { ranking: 3, name: "Charlie", points: 1000 },
    { ranking: 4, name: "David", points: 900 },
    { ranking: 5, name: "Eve", points: 850 },
    { ranking: 6, name: "Frank", points: 800 },
    { ranking: 7, name: "Grace", points: 750 },
    { ranking: 8, name: "Janice", points: 600 },
    { ranking: 9, name: "Quinton", points: 300 },
    { ranking: 10, name: "Anson", points: 150 },
  ];
  const iconBoxInside = useColorModeValue("white", "white");
const test = [
  {counts: 8,description: "Merchant"},
  {counts: 8,description: "Order"},
  {counts: 8,description: "Member"},
  {counts: 8,description: "Product"},
]
  return (
    <Flex flexDirection="column" gap={Spacing.containerPx} pt={`${Spacing.containerPx}`}>
      <Flex flexDirection="row" gap={Spacing.containerPx} >
        {/* <PieChart data={Array.isArray(applications)?applications:[]}/> */}
        <ThreeStatisticCards data={Array.isArray(numberBoard)?numberBoard:[]}/>
        {/* <ThreeStatisticCards data={Array.isArray(test)?test:[]}/> */}
      </Flex>
      <Flex flexDirection="row" gap={Spacing.containerPx} >
        <LineChartCard data={Array.isArray(totalSales)?totalSales:[]}/>
        <SingleLineChartCard data={totalCommission}/>
      </Flex>
      <Flex flexDirection="row" gap={Spacing.containerPx} >
        <Leaderboard leaderboardData={Array.isArray(top10Agents)?top10Agents:[]} />
        <AnnouncementCard />
      </Flex>
    </Flex>
  );
}
