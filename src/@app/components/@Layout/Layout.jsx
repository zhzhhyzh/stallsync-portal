import React, { useEffect, useState } from 'react';
// Chakra imports
import { ChakraProvider, Portal, useDisclosure } from '@chakra-ui/react';
// Layout components
import AdminNavbar from './Navbars/AdminNavbar.js';
import Sidebar from './Sidebar';
import Footer from './Footer/Footer.js';
import HeaderNavbar from './Header/HeaderNavbar.js';

// Custom Chakra theme
import { chakraTheme } from '@app/theme/theme.js';
// Custom components
import MainPanel from './MainPanel';
import PanelContainer from './PanelContainer';
import PanelContent from './PanelContent';
import ModalDialog from '@app/components/modal/ModalDialog';
import { menus } from '@app/routes/menus';
import { useRouter } from 'next/router';
import useFetchHome from "@app/hooks/selector/useFetchHome";

import { useAppSelector } from "@app/hooks/useRedux";
import { selectShowHide } from "@app/redux/app/slice";
import Spacing from '@app/constants/Spacing';

export default function Layout(props) {
	const { children, ...rest } = props;
	// states and functions
	const [sidebarVariant, setSidebarVariant] = useState('transparent');
	const [fixed, setFixed] = useState(false);
	const [homeData] = useFetchHome();
	const router = useRouter()

	const sideBarShowHide = useAppSelector(selectShowHide);

	// Get username
	const userName = homeData?.psusrnam;

	const getActiveRoute = (routes) => {
		const pathname = router?.pathname
		let activeRoute = 'StallSync';
		for (const route of routes) {
			if (route.children) {
				let collapseActiveRoute = getActiveRoute(route.children);
				if (collapseActiveRoute !== activeRoute) {
					return collapseActiveRoute;
				}
			} else {
				if (pathname.indexOf(route.href) !== -1) {
					return route.label;
				}
			}
		}
		return activeRoute;
	};

	// This changes navbar state(fixed or not)
	const getActiveNavbar = (routes) => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (routes[i].category) {
				let categoryActiveNavbar = getActiveNavbar(routes[i].views);
				if (categoryActiveNavbar !== activeNavbar) {
					return categoryActiveNavbar;
				}
			} else {
				if (router?.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
					if (routes[i].secondaryNavbar) {
						return routes[i].secondaryNavbar;
					}
				}
			}
		}
		return activeNavbar;
	};

	const getBreadCrumbs = (routes) => {
		const pathname = router?.pathname
		let breadcrumbs = [];
		for (const route of routes) {
			if (route.children) {
				let collapseActiveRoute = getActiveRoute(route.children);
				breadcrumbs.push(collapseActiveRoute)
				return collapseActiveRoute;
			} else {
				if (pathname.indexOf(route.href) !== -1) {
					breadcrumbs.push(route)
					return breadcrumbs
				}
			}
		}
		return breadcrumbs;
	};

	const { isOpen, onOpen, onClose } = useDisclosure();
	// Chakra Color Mode

	useEffect(() => {
		if (homeData && Object.keys(homeData).length > 0) {
			if (homeData.chgpwd) {
				router.replace({
					pathname: "profile/changePassword",
					query: {
						mode: "FORCE"
					}
				});
			}
		}
	}, [homeData])

	const isLogin = router?.pathname === '/'

	const widthWithSideBar = sideBarShowHide ? Spacing.sidebarHide + "px" : Spacing.sidebar + "px";
	//check is root page
	const isRoot = router?.pathname==="/applicationRaise"||router?.pathname === '/' || router?.pathname === "/forgot_password" || (homeData.chgpwd ? router?.pathname === "/profile/changePassword" : false)
	return (
		<ChakraProvider theme={chakraTheme} resetCss={false}>
			{!isRoot && <Sidebar
				logoText={'StallSync Portal'}
				display='none'
				sidebarVariant={sidebarVariant}
				sideBarShowHide={sideBarShowHide}
				{...rest}
			/>}
			<MainPanel
				w={{
					base: '100%',
					xl: !isRoot ? 'calc(100% - ' + widthWithSideBar + ')' : '100%'
				}}
				bgColor={"#F3F3F3"}
			>
				{!isRoot && <Portal>
					<AdminNavbar
						onOpen={onOpen}
						logoText={'StallSync Portal'}
						brandText={getActiveRoute(menus)}
						secondary={getActiveNavbar(menus)}
						fixed={fixed}	
						userName={userName}
						{...rest}
					/>
				</Portal>}
				<PanelContent>
					<PanelContainer style={{overflow:router?.pathname==="/applicationRaise"&&'hidden'}}>
						{children}
					</PanelContainer>
				</PanelContent>
				{!isLogin && <Footer />}
			</MainPanel>
			<ModalDialog />
		</ChakraProvider>
	);
}