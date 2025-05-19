import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Alert {
  id: string;
  type: string;
  label: string;
  confidence: number;
  location: string;
  timestamp: string;
  status: string;
  team_dispatched: boolean;
  team_dispatch_time?: string;
  resolution_time?: string;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8202/api/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatchTeam = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:8202/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_dispatched: true,
          status: 'investigating'
        }),
      });
      if (response.ok) {
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error dispatching team:', error);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:8202/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'resolved'
        }),
      });
      if (response.ok) {
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground">
          {alerts.filter(a => a.status === "new").length} new alerts requiring attention
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-8">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No alerts found</div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item cursor-pointer ${selectedAlert?.id === alert.id ? 'border-security-yellow' : ''}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className={`p-2 rounded-md ${getSeverityColor(alert.type)}`}>
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
                    <span className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</span>
                    <Button variant="ghost" size="sm">
                      View Camera
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button disabled={selectedAlert.team_dispatched}>
                          {selectedAlert.team_dispatched ? 'Team Dispatched' : 'Dispatch Team'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Dispatch Security Team?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will notify the security team to investigate the alert at {selectedAlert.location}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDispatchTeam(selectedAlert.id)}>
                            Confirm Dispatch
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" disabled={selectedAlert.status === 'resolved'}>
                          {selectedAlert.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mark Alert as Resolved?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark the alert as resolved. Make sure the situation has been properly handled.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleResolveAlert(selectedAlert.id)}>
                            Confirm Resolution
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className="capitalize">
                        {selectedAlert.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{formatTimestamp(selectedAlert.timestamp)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{selectedAlert.location}</span>
                    </div>
                    
                    {selectedAlert.team_dispatch_time && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Dispatched</span>
                        <span>{formatTimestamp(selectedAlert.team_dispatch_time)}</span>
                      </div>
                    )}
                    
                    {selectedAlert.resolution_time && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolved</span>
                        <span>{formatTimestamp(selectedAlert.resolution_time)}</span>
                      </div>
                    )}
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

function getSeverityColor(type: string) {
  switch (type) {
    case "suspicious_activity":
      return "bg-security-red";
    case "motion_after_hours":
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
    case "resolved":
      return "border-security-green text-security-green";
    default:
      return "border-security-blue text-security-blue";
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
