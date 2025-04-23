
import { type LucideIcon } from "lucide-react";

// Navigation item type definition
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
}

// Breadcrumb item type definition
export interface BreadcrumbItem {
  name: string;
  url: string;
}
