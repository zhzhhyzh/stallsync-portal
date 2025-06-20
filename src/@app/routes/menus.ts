import {
  RiHome5Line,
  RiBriefcase2Line,
  RiSettings2Line,
  RiUser2Line,
  RiAppsLine,
  RiFilePaper2Line,
  RiListOrdered2,
  RiFileHistoryLine,
  RiFolderHistoryLine,
  RiBellFill,
  RiExchangeBoxLine,
} from "react-icons/ri";

import {
  FaUserCircle,
  FaRegClipboard,
  FaScribd, FaGlobe,
  FaList,
  FaBullhorn
} from "react-icons/fa";
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
        label: "Staff",
        href: "/staff",
        root: "Staff",
        icon: RiBriefcase2Line,

      },

      {
        label: "Customer",
        href: "/customer",
        root: "Customer",
        icon: FaUserCircle,
      },

      {
        label: "Order",
        href: "/order",
        root: "Order",
        icon: FaRegClipboard,
      },
      {
        label: "Announcement",
        href: "/announcement",
        icon: FaBullhorn,
        permissions: [accessType.ANNOUNCE_VIEW],
      },
      {
        label: "Parameter",
        icon: FaGlobe,
        root: "Param",
        children: [

          // {
          //   label: "Company Parameter",
          //   href: "/company",
          //   permissions: [accessType.COMPAR_VIEW],
          // },


          // {
          //   label: "Agent Designation",
          //   href: "/dsagent",
          //   permissions: [accessType.DSAGENT_VIEW],
          // },
          // {
          //   label: "Transaction Code",
          //   href: "/tranCode",
          //   permissions: [accessType.TRANCODE_VIEW],
          // },
          {
            label: "Merchant",
            href: "/merchant",
            permissions: [accessType.MCH_VIEW],
          },
          {
            label: "Product",
            href: "/product",
            permissions: [accessType.PROD_VIEW],
          },
          {
            label: "Reward",
            href: "/reward",
            permissions: [accessType.RWD_VIEW],
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
            label: "Transaction",
            root: "Transaction",
            href: "/transaction",
            // permissions: [
            // ],
          },



        ],

      },
      {
        label: "Configuration",
        icon: RiExchangeBoxLine,
        root: "Configuration",
        children: [
          {
            label: "Accessibility",
            href: "/accessibility",
            permissions: [accessType.ACES_VIEW],
          },
          {
            label: "Functions",
            href: "/functions",
            permissions: [accessType.FUNC_VIEW],
          },
          {
            label: "General Type",
            href: "/generalParameter",
            permissions: [accessType.GEN_VIEW],
          },
          {
            label: "Password Policy",
            href: "/passwordPolicy",
            permissions: [
              accessType.PWPOLICY_VIEW,
              accessType.PWPOLICY_EDIT,
            ],
          },
          {
            label: "Roles",
            href: "/roleCode",
            permissions: [accessType.ROLE_VIEW],
          },
          {
            label: "System Table",
            href: "/fileManagements",
            permissions: [accessType.FILEMANAGE_VIEW],
          },
          {
            label: "User Accounts",
            href: "/adminAccounts",
            permissions: [accessType.ADMA_VIEW],
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
              },
              {
                label: "Database Backup",
                href: "/backup",
                permissions: [accessType.BACKUP_VIEW],
              },
            ],
          },
        ]
      }
      ,

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
          accessType.PROF_VIEW,
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
