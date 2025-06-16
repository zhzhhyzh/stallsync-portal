import { BREADCRUMBS_TYPES } from "./breadcrumbs.types";

export interface MENU_TYPES {
  url?: string | undefined;
  label: string;
  query?: {};
  onclick?: any;
  breadcrumbRoute?: BREADCRUMBS_TYPES[];
}