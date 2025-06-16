import {
  RiHome5Line,
  RiSettings2Line,
  RiUser2Line,
  RiAppsLine,
  RiFilePaper2Line,
  RiListOrdered2,
  RiFileHistoryLine,
  RiFolderHistoryLine,
  RiBellFill,
} from "react-icons/ri";
import { accessType } from "../utils/access-matrix";
import { CgBrowser } from "react-icons/cg";
import { GoChecklist } from "react-icons/go";
import { FaCalculator, FaToolbox } from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@app/hooks/useRedux";
import {
  closeGlobalModal,
  openGlobalModal,
  refreshTable,
  selectHome,
} from "@app/redux/app/slice";

//label must be unique !!!
export const menus: Array<NavItem> = [
  {
    group: "Navigation",
    children: [
      {
        label: "Dashboard",
        href: "/dashboard",
        root: "Dashboard",  
        icon: RiHome5Line,
      },
           
      {
        label: "Applications",
        icon: RiAppsLine,
        root: "Applications",
        href:"/application",
        permissions: [accessType.APPLAPV_VIEW],
      },
      {
        label: "Applications",
        icon: RiAppsLine,
        root: "Applications",
        href: "/applicationAgent",
        permissions: [accessType.APPLAGT_VIEW],
      },
    
      {
        label: "Agent Profiles",
        icon: IoPersonOutline,
        root: "Agent Profiles",
        children: [
    
          {
            label: "My Profile",
            href: "/agentProfile",
            permissions: [accessType.AGTPRF_VIEW],
          },
          {
            label: "My Group",
            href: "/member",
            permissions: [accessType.AGTPRF_VIEW], 
          },
        ],
        permissions: [accessType.AGTPRF_VIEW],

      },
     
      {
        label: "Agent Profiles",
        icon: IoPersonOutline,
        root: "Agent Profiles",
        href:"/member",
        permissions: [accessType.AGTLST_VIEW], 


      },
      {
        label: "Commissions",
        icon: IoPersonOutline,
        root: "Commissions",
        href:"/commissions",
        permissions: [accessType.COM_VIEW], 


      },
 
      {
        label: "Promotion",
        icon: IoPersonOutline,
        root: "Promotion",
        href:"/promotions",
        permissions: [accessType.PROMOTION_VIEW], 


      },
      {
        label: "Sales Contract",
        icon: IoPersonOutline,
        root: "Sales Contract",
        href:"/contract",
        permissions: [accessType.CON_VIEW], 


      },
 
      {
        label: "Notifications",
        icon: RiBellFill,
        root: "Notifications",
        children: [
          {
            label: "Parameters",
            children: [
              {
                label: "Announcement",
                href: "/announcement",
                permissions: [accessType.ANNOUNCE_VIEW],
              },
              {
                label: "Notification Template",
                href: "/notificationTemplate",
                permissions: [accessType.NOT_VIEW],
              },
              // {
              //   label: "Notification Segment",
              //   href: "/segment",
              //   permissions: [accessType.SEG_VIEW],
              // },
              {
                label: "Notification Group",
                href: "/notificationGroup",
                permissions: [accessType.NOTGRP_VIEW],
              },
              {
                label: "Subscription",
                href: "/notificationSubscription",
                permissions: [accessType.NOTSUBS_VIEW],
              },
              {
                label: "Comm Channel",
                href: "/channelCode",
                permissions: [accessType.CHNLCOM_VIEW],
              },
              {
                label: "Test Recipients",
                href: "/testReceiver",
                permissions: [accessType.TRCV_VIEW],
              },
              {
                label: "Push Notification Control",
                href: "/pushNotificationParam",
                permissions: [accessType.PSHPRM_VIEW],
              },
           
            ],
            permissions: [
              accessType.ANNOUNCE_VIEW,
              accessType.NOT_VIEW,
              //accessType.SEG_VIEW,
              accessType.NOTGRP_VIEW,
              accessType.NOTSUBS_VIEW,
              accessType.CHNLCOM_VIEW,
              accessType.TRCV_VIEW,
              accessType.PSHPRM_VIEW,
            ],
          },
          {
            label: "Notification",
            children: [
              {
                label: "New Messages",
                href: "/notificationAdHoc",
                permissions: [accessType.NOTNEW_ADD],
              },
              {
                label: "Scheduled Messages",
                href: "/notificationSchedules",
                permissions: [accessType.NOTSCHED_VIEW],
              },
              {
                label: "Sent History",
                href: "/notificationSentHistory",
                permissions: [accessType.NOTSNDH_VIEW],
              },
              {
                label: "Metadata",
                href: "/metadata",
                permissions: [accessType.MTDA_VIEW],
              },
            ],
            permissions: [
              accessType.NOTNEW_ADD,
              accessType.NOTSCHED_VIEW,
              accessType.NOTSNDH_VIEW,
              accessType.MTDA_VIEW,
            ],
          },
          {
            label: "Omnisend Reports",
            href: "/omnisendReport",
            // permissions: [accessType.RREPORT_VIEW], //todo
          },
        ],
        permissions: [
          accessType.NOT_VIEW,
          //accessType.SEG_VIEW,
          accessType.NOTGRP_VIEW,
          accessType.NOTSUBS_VIEW,
          accessType.CHNLCOM_VIEW,
          accessType.TRCV_VIEW,
          accessType.PSHPRM_VIEW,
          accessType.NOTNEW_ADD,
          accessType.NOTSCHED_VIEW,
          accessType.NOTSNDH_VIEW,
          accessType.MTDA_VIEW,
        ],
      },

     
      
      {
        label: "Reporting",
        icon: RiFolderHistoryLine,
        root: "Reporting",
        href: "/report",
        // permissions: [
        // ],
      },
      {
        label: "Parameter",
        icon: CgBrowser,
        root: "Param",
        children: [
          {
            label: "Deal Date",
            href: "/dealDate",
            permissions: [accessType.DEAL_DATE_VIEW],
          },
          {
            label: "Checker Maker Control",
            href: "/checkerMaker",
            // root: "Checker Maker",
            // icon: RiCoupon2Fill,
            permissions: [accessType.CHKMKRPAR_VIEW],
          },
          
          {
            label: "Checker Approval",
            href: "/checkerMakerAppv",
            // root: "CM Approval",
            // icon: GoChecklist,
            permissions: [accessType.CHKMKRAPV_VIEW],
          },
          {
            label: "General Parameter",
            permissions: [accessType.GEN_VIEW],
            children: [
              {
                label: "General Type",
                href: "/generalParameter",
                permissions: [accessType.GEN_VIEW],
              },
              // {
              //   label: "Entity Group",
              //   href: "/entity",
              //   // permissions: [],
              // },
            ],
          },
          {
            label: "Administration",
            permissions: [
              accessType.GEN_VIEW,
              accessType.FUNC_VIEW,
              accessType.ACES_VIEW,
              accessType.ROLE_VIEW,
              accessType.ADMA_VIEW,
              accessType.WRKGRP_VIEW,
              accessType.PWPOLICY_VIEW,
              accessType.PWPOLICY_EDIT,
              accessType.FILEMANAGE_VIEW,
              accessType.DEAL_DATE_VIEW,
            ],
            children: [
              {
                label: "Functions",
                href: "/functions",
                permissions: [accessType.FUNC_VIEW],
              },
              {
                label: "Accessibility",
                href: "/accessibility",
                permissions: [accessType.ACES_VIEW],
              },
              {
                label: "Roles",
                href: "/roleCode",
                permissions: [accessType.ROLE_VIEW],
              },
              {
                label: "User Accounts",
                href: "/adminAccounts",
                permissions: [accessType.ADMA_VIEW],
              },
              {
                label: "Workgroup",
                href: "/workgroups",
                permissions: [accessType.WRKGRP_VIEW],
              },
              {
                label: "System Table",
                href: "/fileManagements",
                permissions: [accessType.FILEMANAGE_VIEW],
              },
             
              
              {
                label: "Password Policy",
                href: "/passwordPolicy",
                permissions: [
                  accessType.PWPOLICY_VIEW,
                  accessType.PWPOLICY_EDIT,
                ],
              },
            ],
          },
          {
            label: "Trust Fund Product",
            href: "/prod",
            permissions: [accessType.PROD_VIEW],
          },
          {
            label: "Company Parameter",
            href: "/company",
            permissions: [accessType.COMPAR_VIEW],
          },
          {
            label: "Currency Rate",
            href: "/currencyRate",
           
            permissions: [accessType.CURRAT_VIEW],
          },

          {
            label: "Agent Designation",
            href: "/dsagent",
            permissions: [accessType.DSAGENT_VIEW],
          },
          {
            label: "Transaction Code",
            href: "/tranCode",
            permissions: [accessType.TRANCODE_VIEW],
          },
          {
            label: "Products",
            permissions: [
              // accessType.PRODCODE_VIEW,
              // accessType.PAPPAR_VIEW,
              // accessType.TRANCODE_VIEW,
              // accessType.FEECODE_VIEW,
            ],
            children: [
              {
                label: "Product Code",
                href: "/productCodes",
                permissions: [accessType.PRODCODE_VIEW],
              },
             
              {
                label: "Payment Priority",
                href: "/pappar",
                permissions: [accessType.PAPPAR_VIEW], //add inside queue not separate menu
              },
              {
                label: "Transaction Code",
                href: "/tranCode",
                permissions: [accessType.TRANCODE_VIEW],
              },
              {
                label: "Fee Code",
                href: "/feeCodes",
                permissions: [accessType.FEECODE_VIEW],
              },
              {
                label: "Tax Code",
                href: "/taxCode",
                // permissions: [],
              },
              {
                label: "GL Chart Of Account ",
                href: "/gla",
                // permissions: [],
              },
            ],
          },
          {
            label: "Queue",
            permissions: [accessType.QUEUE_VIEW, accessType.CREDAPP_VIEW],
            children: [
              {
                label: "Queue",
                href: "/queues",
                root: "Queue",
                permissions: [accessType.QUEUE_VIEW],
              },
              {
                label: "Credit Approval Limit",
                href: "/credAppLim",
                permissions: [accessType.CREDAPP_VIEW],
              },
            ],
          },
          {
            label: "System",
            permissions: [accessType.FILEMANAGE_VIEW, accessType.BACKUP_VIEW],
            children: [
              {
                label: "System Table",
                href: "/fileManagements",
                permissions: [accessType.FILEMANAGE_VIEW],
              },
              {
                label: "System Calendar",
                href: "/calendar",
                // permissions: [accessType.FILEMANAGE_VIEW],
              },
              {
                label: "Database Backup",
                href: "/backup",
                permissions: [accessType.BACKUP_VIEW],
              },
            ],
          },
        ],
        permissions: [
          accessType.GEN_VIEW,
          // accessType.ACES_VIEW,
          accessType.FUNC_VIEW,
          // accessType.PWPOLICY_VIEW,
        ],
      },
      {
        label: "Setting",
        icon: RiSettings2Line,
        root: "Settings",
        children: [
          {
            label: "My Profile",
            href: "/profile/myProfile",
            permissions: [accessType.PROF_VIEW],
          },
          {
            label: "Change Password",
            href: "/profile/changePassword",
            permissions: [accessType.PROF_VIEW],
          },
        ],
        permissions: [
          accessType.FILEMANAGE_VIEW,
          accessType.ADMA_VIEW,
          accessType.PROF_VIEW,
          accessType.BACKUP_VIEW,
        ],
      },
    ],
  },
];

interface NavItem {
  label?: string;
  subLabel?: string;
  href?: string;
  icon?: any;
  group?: string;
  root?: string;
  children?: NavItem[];
  permissions?: {
    type: string;
    function: string;
    action: string;
  }[];
}
