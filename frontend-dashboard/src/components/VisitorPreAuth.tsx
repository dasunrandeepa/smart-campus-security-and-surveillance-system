import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CarFront, Plus, X, CalendarIcon, Clock, ListCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "active" | "expired";
  created_at: string;
  updated_at: string;
}

interface EventVehicle {
  id: string;
  event_id: string;
  plate_number: string;
  name: string;
  reason: string | null;
  added_by: string;
  created_at: string;
}

export function VisitorPreAuth() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<EventVehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plate_number: "",
    name: "",
    reason: "",
    added_by: "Security Officer", // Default value
  });
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    event_date: "",
    start_time: "",
    end_time: "",
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch vehicles when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      fetchEventVehicles(selectedEvent);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8203/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
      if (data.length > 0 && !selectedEvent) {
        setSelectedEvent(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    }
  };

  const fetchEventVehicles = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:8203/api/events/${eventId}/vehicles`);
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles");
    }
  };

  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("event_name", newEvent.event_name);
      formData.append("event_date", newEvent.event_date);
      formData.append("start_time", newEvent.start_time);
      formData.append("end_time", newEvent.end_time);

      const response = await fetch("http://localhost:8203/api/events", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create event");
      
      await fetchEvents();
      setShowEventForm(false);
      setNewEvent({
        event_name: "",
        event_date: "",
        start_time: "",
        end_time: "",
      });
      toast.success("Event created successfully");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleAddVehicle = async () => {
    if (!selectedEvent) return;

    try {
      const formData = new FormData();
      formData.append("plate_number", newVehicle.plate_number);
      formData.append("name", newVehicle.name);
      formData.append("reason", newVehicle.reason);
      formData.append("added_by", newVehicle.added_by);

      const response = await fetch(`http://localhost:8203/api/events/${selectedEvent}/vehicles`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add vehicle");
      
      await fetchEventVehicles(selectedEvent);
      setShowAddForm(false);
      setNewVehicle({
        plate_number: "",
        name: "",
        reason: "",
        added_by: "Security Officer",
      });
      toast.success("Vehicle added successfully");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle");
    }
  };

  const handleRemoveVehicle = async (plateNumber: string) => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `http://localhost:8203/api/events/${selectedEvent}/vehicles/${plateNumber}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove vehicle");
      
      await fetchEventVehicles(selectedEvent);
      toast.success("Vehicle removed successfully");
    } catch (error) {
      console.error("Error removing vehicle:", error);
      toast.error("Failed to remove vehicle");
    }
  };

  const handleUpdateEventStatus = async (eventId: string, newStatus: Event["status"]) => {
    try {
      const formData = new FormData();
      formData.append("status", newStatus);

      const response = await fetch(`http://localhost:8203/api/events/${eventId}/status`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update event status");
      
      await fetchEvents();
      toast.success("Event status updated successfully");
    } catch (error) {
      console.error("Error updating event status:", error);
      toast.error("Failed to update event status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visitor Pre-Authorization</h1>
        <p className="text-muted-foreground">
          Manage pre-authorized vehicles for campus events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Events</CardTitle>
                <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" /> New Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="event_name">Event Name</Label>
                        <Input
                          id="event_name"
                          value={newEvent.event_name}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, event_name: e.target.value })
                          }
                          placeholder="Annual Science Conference"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event_date">Event Date</Label>
                        <Input
                          id="event_date"
                          type="date"
                          value={newEvent.event_date}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, event_date: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_time">Start Time</Label>
                          <Input
                            id="start_time"
                            type="time"
                            value={newEvent.start_time}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, start_time: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_time">End Time</Label>
                          <Input
                            id="end_time"
                            type="time"
                            value={newEvent.end_time}
                            onChange={(e) =>
                              setNewEvent({ ...newEvent, end_time: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleCreateEvent}>Create Event</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedEvent === event.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedEvent(event.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.event_name}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {event.start_time} - {event.end_time}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            event.status === "active"
                              ? "border-security-green text-security-green"
                              : event.status === "scheduled"
                              ? "border-security-yellow text-security-yellow"
                              : "border-security-red text-security-red"
                          }`}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CarFront className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {vehicles.filter((v) => v.event_id === event.id).length} vehicles
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {selectedEvent && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {events.find((e) => e.id === selectedEvent)?.event_name || "Event Details"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateEventStatus(
                            selectedEvent,
                            events.find((e) => e.id === selectedEvent)?.status === "active"
                              ? "expired"
                              : "active"
                          )
                        }
                      >
                        {events.find((e) => e.id === selectedEvent)?.status === "active"
                          ? "End Event"
                          : "Start Event"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium mb-1">Date</p>
                      <p className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {new Date(events.find((e) => e.id === selectedEvent)?.event_date || "").toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Time Window</p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {events.find((e) => e.id === selectedEvent)?.start_time} -{" "}
                        {events.find((e) => e.id === selectedEvent)?.end_time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>Pre-authorized Vehicles</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {vehicles.length} vehicles
                      </Badge>
                    </div>
                    <Button size="sm" onClick={() => setShowAddForm(true)}>
                      <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showAddForm && (
                    <div className="mb-6 p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Add New Vehicle</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setShowAddForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plate">License Plate</Label>
                          <Input
                            id="plate"
                            value={newVehicle.plate_number}
                            onChange={(e) =>
                              setNewVehicle({ ...newVehicle, plate_number: e.target.value })
                            }
                            placeholder="ABC 123"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Owner Name</Label>
                          <Input
                            id="name"
                            value={newVehicle.name}
                            onChange={(e) =>
                              setNewVehicle({ ...newVehicle, name: e.target.value })
                            }
                            placeholder="Dr. John Smith"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="reason">Reason for Visit</Label>
                          <Input
                            id="reason"
                            value={newVehicle.reason}
                            onChange={(e) =>
                              setNewVehicle({ ...newVehicle, reason: e.target.value })
                            }
                            placeholder="Guest Speaker"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button onClick={handleAddVehicle}>Add Vehicle</Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plate</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">
                              {vehicle.plate_number}
                            </TableCell>
                            <TableCell>{vehicle.name}</TableCell>
                            <TableCell>{vehicle.reason}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveVehicle(vehicle.plate_number)}
                                className="h-8 w-8 p-0 text-security-red"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}