import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cctv } from "lucide-react";

const camerasData = [
  { id: 1, name: "Main Entrance", location: "Admin Block", status: "active", hasPlateDetection: true },
  { id: 2, name: "Parking A", location: "North Campus", status: "active" },
  { id: 3, name: "Library Exit", location: "East Wing", status: "active" },
  { id: 4, name: "Cafeteria", location: "Student Center", status: "active" },
  { id: 5, name: "Lecture Hall", location: "Building B", status: "active" },
  { id: 6, name: "Parking B", location: "South Campus", status: "active" },
  { id: 7, name: "Dormitory", location: "Residence Block", status: "active" },
  { id: 8, name: "Labs Access", location: "Science Block", status: "active" },
];

export function CctvMonitoring() {
  const [view, setView] = useState("grid");
  const [currentPlate, setCurrentPlate] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    // Poll for new plate numbers every second
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:8204/current_plate');
        const data = await response.json();
        if (data.plate) {
          setCurrentPlate(data.plate);
          if (data.snapshot) {
            // Extract filename from the full path
            const filename = data.snapshot.split('/').pop();
            setSnapshot(`http://localhost:8204/snapshot/${filename}`);
          }
        }
      } catch (error) {
        console.error('Error fetching plate:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CCTV Monitoring</h1>
          <p className="text-muted-foreground">
            Live feed from {camerasData.length} cameras across campus
          </p>
        </div>
        <Tabs defaultValue="grid" value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={view}>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {camerasData.map((camera) => (
              <CameraFeed 
                key={camera.id} 
                camera={camera} 
                currentPlate={camera.hasPlateDetection ? currentPlate : null}
                snapshot={camera.hasPlateDetection ? snapshot : null}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="flex flex-col gap-4">
            <FeaturedCamera 
              camera={camerasData[0]} 
              currentPlate={currentPlate}
              snapshot={snapshot}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {camerasData.slice(1, 4).map((camera) => (
                <CameraFeed 
                  key={camera.id} 
                  camera={camera} 
                  currentPlate={camera.hasPlateDetection ? currentPlate : null}
                  snapshot={camera.hasPlateDetection ? snapshot : null}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CameraFeed({ camera, currentPlate, snapshot }: { camera: any; currentPlate?: string | null; snapshot?: string | null }) {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-md">
      {camera.hasPlateDetection ? (
        <img 
          src="http://localhost:8204/video_feed" 
          alt={`${camera.name} feed`} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Cctv className="h-12 w-12" />
        </div>
      )}

      <div className="absolute inset-0 p-2 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
          <Button variant="outline" size="icon" className="h-6 w-6 text-white border-white/50">
            ⋯
          </Button>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{camera.name}</p>
          <p className="text-gray-300 text-xs">{camera.location}</p>
          {camera.hasPlateDetection && currentPlate && (
            <div className="mt-2 bg-black/50 p-2 rounded">
              <p className="text-white text-xs">License Plate: {currentPlate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCamera({ camera, currentPlate, snapshot }: { camera: any; currentPlate?: string | null; snapshot?: string | null }) {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
      {camera.hasPlateDetection ? (
        <img 
          src="http://localhost:8204/video_feed" 
          alt={`${camera.name} feed`} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Cctv className="h-16 w-16" />
        </div>
      )}

      <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
          <Button variant="outline" size="icon" className="h-6 w-6 text-white border-white/50">
            ⋯
          </Button>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-white font-semibold">{camera.name}</p>
            <p className="text-gray-300 text-xs">{camera.location}</p>
            {camera.hasPlateDetection && currentPlate && (
              <div className="mt-2 bg-black/50 p-2 rounded">
                <p className="text-white text-sm">License Plate: {currentPlate}</p>
                {snapshot && (
                  <img 
                    src={snapshot} 
                    alt="Vehicle snapshot" 
                    className="mt-2 w-32 h-auto rounded"
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Zoom</Button>
            <Button variant="default" size="sm">Full Screen</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
