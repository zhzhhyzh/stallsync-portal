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
import { selectApplications, fetchMain, selectMemberTiers, selectTopMerchants, selectorderChart, selectTotalSales } from "@app/redux/dashboard/slice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications)
  const totalSales = useAppSelector(selectTotalSales)
  const orderChart = useAppSelector(selectorderChart)
  const numberBoard = useAppSelector(selectMemberTiers)
  const topMerchants = useAppSelector(selectTopMerchants)

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

  const ratingLeaderboardData = [
  { psmrcuid: "M001", psmrcnme: "Masakan Malaysia", value: "4.9" },
  { psmrcuid: "M002", psmrcnme: "One Two Three", value: "4.8" },
  { psmrcuid: "M003", psmrcnme: "Mee Rebus King", value: "4.7" },
  { psmrcuid: "M004", psmrcnme: "Ayam Penyet World", value: "4.6" },
  { psmrcuid: "M005", psmrcnme: "Kopi Tradisi", value: "4.5" },
  { psmrcuid: "M006", psmrcnme: "Spicy Corner", value: "4.5" },
  { psmrcuid: "M007", psmrcnme: "Warung Kita", value: "4.4" },
  { psmrcuid: "M008", psmrcnme: "Roti Canai Boss", value: "4.3" },
  { psmrcuid: "M009", psmrcnme: "Sup Power", value: "4.3" },
  { psmrcuid: "M010", psmrcnme: "Sambal Legend", value: "4.2" },
];

const salesLeaderboardData = [
  { psmrcuid: "M001", psmrcnme: "Masakan Malaysia", value: "15230.75" },
  { psmrcuid: "M002", psmrcnme: "One Two Three", value: "13900.00" },
  { psmrcuid: "M003", psmrcnme: "Mee Rebus King", value: "12250.50" },
  { psmrcuid: "M004", psmrcnme: "Ayam Penyet World", value: "11200.10" },
  { psmrcuid: "M005", psmrcnme: "Kopi Tradisi", value: "10100.20" },
  { psmrcuid: "M006", psmrcnme: "Spicy Corner", value: "9500.00" },
  { psmrcuid: "M007", psmrcnme: "Warung Kita", value: "8875.25" },
  { psmrcuid: "M008", psmrcnme: "Roti Canai Boss", value: "7650.60" },
  { psmrcuid: "M009", psmrcnme: "Sup Power", value: "7400.40" },
  { psmrcuid: "M010", psmrcnme: "Sambal Legend", value: "6999.90" },
];

const orderCountLeaderboardData = [
  { psmrcuid: "M001", psmrcnme: "Masakan Malaysia", value: "320" },
  { psmrcuid: "M002", psmrcnme: "One Two Three", value: "310" },
  { psmrcuid: "M003", psmrcnme: "Mee Rebus King", value: "290" },
  { psmrcuid: "M004", psmrcnme: "Ayam Penyet World", value: "285" },
  { psmrcuid: "M005", psmrcnme: "Kopi Tradisi", value: "275" },
  { psmrcuid: "M006", psmrcnme: "Spicy Corner", value: "260" },
  { psmrcuid: "M007", psmrcnme: "Warung Kita", value: "250" },
  { psmrcuid: "M008", psmrcnme: "Roti Canai Boss", value: "240" },
  { psmrcuid: "M009", psmrcnme: "Sup Power", value: "230" },
  { psmrcuid: "M010", psmrcnme: "Sambal Legend", value: "225" },
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
        <Leaderboard leaderboardData={Array.isArray(topMerchants) ? topMerchants : []} />
        <AnnouncementCard />
      </Flex>
    </Flex>
  );
}
