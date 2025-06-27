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
import { selectApplications, fetchMain, selectMemberTiers, selecTop10Agents, selectorderChart, selectTotalSales } from "@app/redux/dashboard/slice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications)
  const totalSales = useAppSelector(selectTotalSales)
  const orderChart = useAppSelector(selectorderChart)
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
  }, [])

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
    { counts: 8, description: "Merchant" },
    { counts: 8, description: "Order" },
    { counts: 8, description: "Member" },
    { counts: 8, description: "Product" },
  ]

  const testData = [
    { month: "Jul", totalSales: 10 },
    { month: "Aug", totalSales: 15 },
    { month: "Sep", totalSales: 20 },
    { month: "Oct", totalSales: 5 },
    { month: "Nov", totalSales: 25 },
    { month: "Dec", totalSales: 30 },
    { month: "Jan", totalSales: 18 },
    { month: "Feb", totalSales: 22 },
    { month: "Mar", totalSales: 35 },
    { month: "Apr", totalSales: 40 },
    { month: "May", totalSales: 50 },
    { month: "Jun", totalSales: 41.8 },
  ];

  const testOrderChart = [
    { month: "Jul", totalOrders: 5 },
    { month: "Aug", totalOrders: 8 },
    { month: "Sep", totalOrders: 6 },
    { month: "Oct", totalOrders: 12 },
    { month: "Nov", totalOrders: 10 },
    { month: "Dec", totalOrders: 15 },
    { month: "Jan", totalOrders: 9 },
    { month: "Feb", totalOrders: 11 },
    { month: "Mar", totalOrders: 7 },
    { month: "Apr", totalOrders: 14 },
    { month: "May", totalOrders: 13 },
    { month: "Jun", totalOrders: 18 },
  ];


  return (
    <Flex flexDirection="column" gap={Spacing.containerPx} pt={`${Spacing.containerPx}`}>
      <Flex flexDirection="row" gap={Spacing.containerPx} >
        {/* <PieChart data={Array.isArray(applications)?applications:[]}/> */}
        <ThreeStatisticCards data={Array.isArray(numberBoard) ? numberBoard : []} />
        {/* <ThreeStatisticCards data={Array.isArray(test)?test:[]}/> */}
      </Flex>
      <Flex flexDirection="row" gap={Spacing.containerPx} >
        <LineChartCard data={Array.isArray(totalSales) ? totalSales : []} />
        <SingleLineChartCard data={orderChart} />
      </Flex>
      <Flex flexDirection="row" gap={Spacing.containerPx} >
        <Leaderboard leaderboardData={Array.isArray(top10Agents) ? top10Agents : []} />
        <AnnouncementCard />
      </Flex>
    </Flex>
  );
}
