import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Cctv, Car, AlertTriangle, Search, Users, ListCheck, CarFront } from "lucide-react";


type SidebarItem = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
};

export function DashboardSidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const menuItems: SidebarItem[] = [
    {
      icon: Cctv,
      label: "CCTV Monitoring",
      active: activeSection === "cctv",
      onClick: () => onSectionChange("cctv"),
    },
    {
      icon: AlertTriangle,
      label: "Alerts",
      active: activeSection === "alerts",
      onClick: () => onSectionChange("alerts"),
    },
    {
      icon: Car,
      label: "Vehicle Access",
      active: activeSection === "vehicle",
      onClick: () => onSectionChange("vehicle"),
    },
    {
      icon: CarFront,
      label: "Authorized Vehicles",
      active: activeSection === "authorized-vehicles",
      onClick: () => onSectionChange("authorized-vehicles"),
    },
    {
      icon: ListCheck,
      label: "Visitor Pre-Auth",
      active: activeSection === "preauth",
      onClick: () => onSectionChange("preauth"),
    },
    {
      icon: Search,
      label: "Search Logs",
      active: activeSection === "search",
      onClick: () => onSectionChange("search"),
    },
    {
      icon: Users,
      label: "Personnel",
      active: activeSection === "personnel",
      onClick: () => onSectionChange("personnel"),
    },
  ];

  return (
    <Sidebar className="border-r border-border">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-primary">
          Campus<span className="text-foreground">Secure</span>
        </h1>
        <SidebarTrigger className="ml-auto md:hidden" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2",
                      item.active && "bg-sidebar-accent text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-6 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
            SO
          </div>
          <div>
            <p className="text-sm font-medium">Security Officer</p>
            <p className="text-xs text-muted-foreground">On Duty</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
