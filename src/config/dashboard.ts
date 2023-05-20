import type { DashboardConfig } from "~/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "One",
      href: "#",
    },
    {
      title: "Two",
      href: "#",
    },
  ],
  sidebarNav: [
    {
      title: "Posts",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
