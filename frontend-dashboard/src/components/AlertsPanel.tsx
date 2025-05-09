
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const alertsData = [
  { 
    id: 1, 
    type: "Motion Detected", 
    location: "Restricted Area - Building C", 
    timestamp: "2 mins ago", 
    severity: "high", 
    status: "new",
    cameraId: 3
  },
  { 
    id: 2, 
    type: "Unidentified Person", 
    location: "Main Entrance", 
    timestamp: "15 mins ago", 
    severity: "medium", 
    status: "investigating",
    cameraId: 1
  },
  { 
    id: 3, 
    type: "Tailgating Detected", 
    location: "Parking A", 
    timestamp: "27 mins ago", 
    severity: "medium", 
    status: "investigating",
    cameraId: 2
  },
  { 
    id: 4, 
    type: "Door Left Open", 
    location: "Science Block", 
    timestamp: "42 mins ago", 
    severity: "low", 
    status: "resolved",
    cameraId: 8
  },
  { 
    id: 5, 
    type: "Camera Malfunction", 
    location: "Dormitory", 
    timestamp: "1 hour ago", 
    severity: "medium", 
    status: "acknowledged",
    cameraId: 7
  },
];

export function AlertsPanel() {
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground">
          {alertsData.filter(a => a.status === "new").length} new alerts requiring attention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {alertsData.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item cursor-pointer ${selectedAlert === alert.id ? 'border-security-yellow' : ''}`}
              onClick={() => setSelectedAlert(alert.id)}
            >
              <div className={`p-2 rounded-md ${getSeverityColor(alert.severity)}`}>
                <AlertTriangle className="h-5 w-5 text-background" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{alert.type}</h3>
                    <p className="text-sm text-muted-foreground">{alert.location}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusClass(alert.status)}
                  >
                    {formatStatus(alert.status)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  <Button variant="ghost" size="sm">
                    View Camera
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {selectedAlert ? (
                <>
                  <div className="aspect-video bg-card rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="h-8 w-8" />
                      <span>Alert Footage</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button>Dispatch Team</Button>
                    <Button variant="outline">Mark Resolved</Button>
                  </div>
                  
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedAlert === 1 ? "New" : "Investigating"}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{selectedAlert === 1 ? "2 mins ago" : "15 mins ago"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{selectedAlert === 1 ? "Restricted Area" : "Main Entrance"}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera ID</span>
                      <span>#{selectedAlert === 1 ? "3" : "1"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <AlertTriangle className="h-16 w-16 opacity-20" />
                  <p>Select an alert to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "high":
      return "bg-security-red";
    case "medium":
      return "bg-security-yellow";
    default:
      return "bg-security-blue";
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "new":
      return "border-security-red text-security-red";
    case "investigating":
      return "border-security-yellow text-security-yellow";
    case "acknowledged":
      return "border-security-blue text-security-blue";
    default:
      return "border-security-green text-security-green";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
