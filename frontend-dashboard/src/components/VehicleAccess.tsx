import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Check, X, Edit2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Vehicle {
  plate_number: string;
  is_authorized: boolean;
  timestamp: string;
  filename: string;
}

export function VehicleAccess() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPlate, setEditingPlate] = useState<string | null>(null);
  const [newPlateNumber, setNewPlateNumber] = useState("");

  useEffect(() => {
    fetch("http://localhost:8004/api/vehicles/pending")
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setSelectedVehicle(data[0]?.plate_number || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch vehicle data.");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (plateNumber: string) => {
    try {
      const response = await fetch(`http://localhost:8004/approve/${plateNumber}`, {
        method: 'POST',
        redirect: 'follow'
      });
      
      setVehicles((prev) => prev.filter((v) => v.plate_number !== plateNumber));
      if (selectedVehicle === plateNumber) {
        setSelectedVehicle(null);
      }
    } catch (err) {
      console.error('Error approving vehicle:', err);
      setError('Error approving vehicle. Please try again.');
    }
  };

  const handleDecline = async (plateNumber: string) => {
    try {
      const response = await fetch(`http://localhost:8004/decline/${plateNumber}`, {
        method: 'POST',
        redirect: 'follow'
      });
      
      setVehicles((prev) => prev.filter((v) => v.plate_number !== plateNumber));
      if (selectedVehicle === plateNumber) {
        setSelectedVehicle(null);
      }
    } catch (err) {
      console.error('Error declining vehicle:', err);
      setError('Error declining vehicle. Please try again.');
    }
  };

  const handleEditPlate = (plateNumber: string) => {
    setEditingPlate(plateNumber);
    setNewPlateNumber(plateNumber);
  };

  const handleSavePlate = async (oldPlate: string) => {
    try {
      const formData = new FormData();
      formData.append('new_plate', newPlateNumber);

      const response = await fetch(`http://localhost:8004/update-plate/${oldPlate}`, {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      });

      // Update local state
      setVehicles(prev => prev.map(v => 
        v.plate_number === oldPlate ? { ...v, plate_number: newPlateNumber } : v
      ));
      
      if (selectedVehicle === oldPlate) {
        setSelectedVehicle(newPlateNumber);
      }
      
      setEditingPlate(null);
    } catch (err) {
      console.error('Error updating plate number:', err);
      setError('Error updating plate number. Please try again.');
    }
  };

  const renderDetails = (vehicle: Vehicle | undefined) => {
    if (!vehicle) return null;
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">License Plate</span>
          {editingPlate === vehicle.plate_number ? (
            <div className="flex gap-2 items-center">
              <Input
                value={newPlateNumber}
                onChange={(e) => setNewPlateNumber(e.target.value)}
                className="w-32"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSavePlate(vehicle.plate_number)}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{vehicle.plate_number}</span>
              {!vehicle.is_authorized && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPlate(vehicle.plate_number)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <Badge variant="outline" className={getStatusClass(vehicle.is_authorized)}>
            {vehicle.is_authorized ? "Authorized" : "Pending"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time</span>
          <span>{new Date(vehicle.timestamp).toLocaleString()}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading vehicles...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vehicle Access Control</h1>
        <p className="text-muted-foreground">
          {vehicles.filter((v) => !v.is_authorized).length} vehicles waiting for approval
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.plate_number}
              className={`vehicle-item cursor-pointer p-4 border rounded-lg ${
                selectedVehicle === vehicle.plate_number ? "border-primary" : ""
              }`}
              onClick={() => setSelectedVehicle(vehicle.plate_number)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-md ${getStatusBackground(vehicle.is_authorized)}`}>
                  <Car className="h-5 w-5 text-background" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{vehicle.plate_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(vehicle.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!vehicle.is_authorized && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 border-security-green text-security-green hover:bg-security-green/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(vehicle.plate_number);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 border-security-red text-security-red hover:bg-security-red/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecline(vehicle.plate_number);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVehicle ? (
                <>
                  <div className="aspect-video bg-card rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      {vehicles.find((v) => v.plate_number === selectedVehicle)?.filename ? (
                        console.log(vehicles.find((v) => v.plate_number === selectedVehicle)?.filename),
                        <img
                          src={`http://localhost:8015/snapshot/${vehicles.find((v) => v.plate_number === selectedVehicle)?.filename.split('/').pop()}`}
                          alt={`Vehicle ${selectedVehicle}`}
                          className="w-full h-full object-contain rounded-md"
                        />
                      ) : (
                        <>
                          <Car className="h-16 w-16 opacity-20" />
                          <p>No image available</p>
                        </>
                      )}
                    </div>
                  </div>

                  {!vehicles.find((v) => v.plate_number === selectedVehicle)?.is_authorized && (
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        className="bg-security-green hover:bg-security-green/90"
                        onClick={() => handleApprove(selectedVehicle)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Approve Access
                      </Button>
                      <Button
                        variant="outline"
                        className="border-security-red text-security-red hover:bg-security-red/10"
                        onClick={() => handleDecline(selectedVehicle)}
                      >
                        <X className="h-4 w-4 mr-2" /> Decline Access
                      </Button>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 space-y-3">
                    {renderDetails(vehicles.find((v) => v.plate_number === selectedVehicle))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Car className="h-16 w-16 opacity-20" />
                  <p>Select a vehicle to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusBackground(isAuthorized: boolean) {
  return isAuthorized ? "bg-security-green" : "bg-security-yellow";
}

function getStatusClass(isAuthorized: boolean) {
  return isAuthorized ? "border-security-green text-security-green" : "border-security-yellow text-security-yellow";
}
