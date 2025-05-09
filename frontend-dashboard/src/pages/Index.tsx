
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { CctvMonitoring } from "@/components/CctvMonitoring";
import { AlertsPanel } from "@/components/AlertsPanel";
import { VehicleAccess } from "@/components/VehicleAccess";
import { VisitorPreAuth } from "@/components/VisitorPreAuth";
import { SearchLogs } from "@/components/SearchLogs";
import { PersonnelSection } from "@/components/PersonnelSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("cctv");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "cctv":
        return <CctvMonitoring />;
      case "alerts":
        return <AlertsPanel />;
      case "vehicle":
        return <VehicleAccess />;
      case "preauth":
        return <VisitorPreAuth />;
      case "search":
        return <SearchLogs />;
      case "personnel":
        return <PersonnelSection />;
      default:
        return <CctvMonitoring />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 overflow-auto">
          <div className="flex h-16 items-center gap-4 border-b border-border bg-background px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                SO
              </div>
            </div>
          </div>
          <div className="container py-6">{renderActiveSection()}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
