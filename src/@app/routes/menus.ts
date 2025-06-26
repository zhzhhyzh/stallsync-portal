import {
  RiHome5Line,
  RiBriefcase2Line,
  RiSettings2Line,
 
  RiFolderHistoryLine,
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
        permissions: [accessType.STAFF_VIEW]

      },

      {
        label: "Member",
        href: "/mbrProfile",
        root: "Member",
        icon: FaUserCircle,
        permissions: [accessType.MBR_VIEW]

      },

      {
        label: "Order",
        href: "/order",
        root: "Order",
        icon: FaRegClipboard,
        permissions:[accessType.ORD_VIEW]
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
          // {
          //   label: "Transaction",
          //   root: "Transaction",
          //   href: "/transaction",
          //   // permissions: [
          //   // ],
          // },



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
            // permissions: [accessType.FILEMANAGE_VIEW, accessType.BACKUP_VIEW],
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
        // permissions: [
        //   accessType.PROF_VIEW,
        // ],
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
