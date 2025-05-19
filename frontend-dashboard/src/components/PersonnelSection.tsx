
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const personnelData = [
  {
    id: 1,
    name: "John Smith",
    role: "Security Officer",
    status: "on duty",
    location: "Main Gate",
    shift: "Morning (6AM - 2PM)",
    contact: "555-1234"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Security Supervisor",
    status: "on duty",
    location: "Control Room",
    shift: "Morning (6AM - 2PM)",
    contact: "555-2345"
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Security Officer",
    status: "on duty",
    location: "East Entrance",
    shift: "Morning (6AM - 2PM)",
    contact: "555-3456"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Security Officer",
    status: "off duty",
    location: "West Entrance",
    shift: "Evening (2PM - 10PM)",
    contact: "555-4567"
  },
  {
    id: 5,
    name: "Robert Wilson",
    role: "Security Officer",
    status: "off duty",
    location: "Parking Area",
    shift: "Night (10PM - 6AM)",
    contact: "555-5678"
  }
];

export function PersonnelSection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Personnel</h1>
        <p className="text-muted-foreground">
          {personnelData.filter(p => p.status === "on duty").length} personnel currently on duty
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>On Duty Personnel</span>
              <Badge variant="outline" className="border-security-green text-security-green">
                {personnelData.filter(p => p.status === "on duty").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {personnelData
                .filter(person => person.status === "on duty")
                .map(person => (
                  <li key={person.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/20">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.role} • {person.location}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Upcoming Shifts</span>
              <Badge variant="outline" className="border-security-blue text-security-blue">
                {personnelData.filter(p => p.status === "off duty").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {personnelData
                .filter(person => person.status === "off duty")
                .map(person => (
                  <li key={person.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/20">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.role} • {person.shift}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Deployment Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-card rounded-md flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Users className="h-8 w-8" />
                <span>Campus Map</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Shift</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {personnelData.map(person => (
                  <tr key={person.id} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 text-sm font-medium">{person.name}</td>
                    <td className="px-4 py-3 text-sm">{person.role}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={person.status === "on duty" 
                          ? "border-security-green text-security-green" 
                          : "border-security-blue text-security-blue"}
                      >
                        {person.status === "on duty" ? "ON DUTY" : "OFF DUTY"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{person.location}</td>
                    <td className="px-4 py-3 text-sm">{person.shift}</td>
                    <td className="px-4 py-3 text-sm">{person.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
