import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface AuthorizedVehicle {
  plate_number: string;
  owner_name: string;
  contact_info: string;
}

const API_BASE_URL = 'http://localhost:8002';

export default function AuthorizedVehicles() {
  const [vehicles, setVehicles] = useState<AuthorizedVehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<AuthorizedVehicle>({
    plate_number: '',
    owner_name: '',
    contact_info: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/authorized-vehicles`);
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to fetch authorized vehicles');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/authorized-vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      });

      if (response.ok) {
        toast.success('Vehicle added successfully');
        setNewVehicle({
          plate_number: '',
          owner_name: '',
          contact_info: ''
        });
        fetchVehicles();
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to add vehicle');
      }
    } catch (error) {
      toast.error('Error adding vehicle');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Authorized Vehicle</CardTitle>
          <CardDescription>Enter the details of the authorized vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Plate Number"
                value={newVehicle.plate_number}
                onChange={(e) => setNewVehicle({ ...newVehicle, plate_number: e.target.value })}
                required
              />
              <Input
                placeholder="Owner Name"
                value={newVehicle.owner_name}
                onChange={(e) => setNewVehicle({ ...newVehicle, owner_name: e.target.value })}
                required
              />
              <Input
                placeholder="Contact Info"
                value={newVehicle.contact_info}
                onChange={(e) => setNewVehicle({ ...newVehicle, contact_info: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Add Vehicle</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authorized Vehicles</CardTitle>
          <CardDescription>List of all authorized vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Contact Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.plate_number}>
                  <TableCell>{vehicle.plate_number}</TableCell>
                  <TableCell>{vehicle.owner_name}</TableCell>
                  <TableCell>{vehicle.contact_info}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 