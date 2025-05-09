
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Car } from "lucide-react";

const logData = [
  {
    id: 1,
    plate: "ABC 123",
    make: "Toyota",
    model: "Corolla",
    status: "entry",
    location: "Main Gate",
    timestamp: "2025-05-09 08:30:45",
  },
  {
    id: 2,
    plate: "DEF 456",
    make: "Honda",
    model: "Civic",
    status: "entry",
    location: "East Entrance",
    timestamp: "2025-05-09 09:15:22",
  },
  {
    id: 3,
    plate: "GHI 789",
    make: "Ford",
    model: "Focus",
    status: "denied",
    location: "West Entrance",
    timestamp: "2025-05-09 09:45:10",
  },
  {
    id: 4,
    plate: "DEF 456",
    make: "Honda",
    model: "Civic",
    status: "exit",
    location: "East Entrance",
    timestamp: "2025-05-09 14:22:05",
  },
  {
    id: 5,
    plate: "JKL 012",
    make: "Nissan",
    model: "Altima",
    status: "entry",
    location: "North Gate",
    timestamp: "2025-05-09 10:10:33",
  },
  {
    id: 6,
    plate: "JKL 012",
    make: "Nissan",
    model: "Altima",
    status: "exit",
    location: "South Gate",
    timestamp: "2025-05-09 16:05:17",
  },
  {
    id: 7,
    plate: "ABC 123",
    make: "Toyota",
    model: "Corolla",
    status: "exit",
    location: "Main Gate",
    timestamp: "2025-05-09 17:45:11",
  },
];

export function SearchLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLogs, setFilteredLogs] = useState(logData);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLogs(logData);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const results = logData.filter(
      (log) =>
        log.plate.toLowerCase().includes(query) ||
        log.make.toLowerCase().includes(query) ||
        log.model.toLowerCase().includes(query) ||
        log.location.toLowerCase().includes(query)
    );
    
    setFilteredLogs(results);
  };

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
              placeholder="Search by plate number, make, model, or location"
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

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Vehicle</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Plate</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
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
                        <span>
                          {log.make} {log.model}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{log.plate}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`${
                          log.status === "entry"
                            ? "border-security-green text-security-green"
                            : log.status === "exit"
                            ? "border-security-blue text-security-blue"
                            : "border-security-red text-security-red"
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{log.location}</td>
                    <td className="px-4 py-3 text-sm">{formatDateTime(log.timestamp)}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
