import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Car } from "lucide-react";

interface VehicleLog {
  id: string;
  plate_number: string;
  status: 'entered' | 'exited' | 'unauthorized_checked';
  timestamp: string;
  security_clear: boolean;
}

export function SearchLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<VehicleLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<VehicleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8003/api/vehicles/logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data);
      setFilteredLogs(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch vehicle logs");
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLogs(logs);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const results = logs.filter(
      (log) => log.plate_number.toLowerCase().includes(query)
    );
    
    setFilteredLogs(results);
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading vehicle logs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search Vehicle Logs</h1>
        <p className="text-muted-foreground">
          Search through vehicle entry and exit records
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by plate number"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </Button>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Plate</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Security Clear</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="bg-secondary rounded-md p-1">
                        <Car className="h-4 w-4" />
                      </div>
                      <span>Vehicle</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{log.plate_number}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`${
                        log.status === "entered"
                          ? "border-security-green text-security-green"
                          : log.status === "exited"
                          ? "border-security-blue text-security-blue"
                          : "border-security-red text-security-red"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={log.security_clear ? "border-security-green text-security-green" : "border-security-red text-security-red"}
                    >
                      {log.security_clear ? "CLEAR" : "NOT CLEAR"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDateTime(log.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDateTime(timestamp: string) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
