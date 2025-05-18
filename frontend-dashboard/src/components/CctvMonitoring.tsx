import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cctv } from "lucide-react";
import { detectVehicles } from "@/lib/vehicleDetection";

const camerasData = [
  { id: 1, name: "Main Entrance", location: "Admin Block", status: "active" },
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
              <CameraFeed key={camera.id} camera={camera} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="flex flex-col gap-4">
            <FeaturedCamera camera={camerasData[0]} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {camerasData.slice(1, 4).map((camera) => (
                <CameraFeed key={camera.id} camera={camera} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CameraFeed({ camera }: { camera: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedVehicles, setDetectedVehicles] = useState<any[]>([]);

  useEffect(() => {
    if (camera.id === 1) {
      startWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [camera.id]);

  useEffect(() => {
    let animationFrameId: number;
    
    const runDetection = async () => {
      if (videoRef.current && canvasRef.current && isStreaming) {
        const predictions = await detectVehicles(videoRef.current, canvasRef.current);
        setDetectedVehicles(predictions || []);
        animationFrameId = requestAnimationFrame(runDetection);
      }
    };

    if (isStreaming) {
      runDetection();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isStreaming]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-md">
      {camera.id === 1 ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Cctv className="h-12 w-12" />
        </div>
      )}

      <div className="absolute inset-0 p-2 flex flex-col justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${isStreaming ? 'bg-red-500' : 'bg-gray-500'} rounded-full animate-pulse`} />
            <span className="text-xs text-white font-medium">{isStreaming ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          <Button variant="outline" size="icon" className="h-6 w-6 text-white border-white/50">
            ⋯
          </Button>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{camera.name}</p>
          <p className="text-gray-300 text-xs">{camera.location}</p>
          {camera.id === 1 && detectedVehicles.length > 0 && (
            <p className="text-green-400 text-xs mt-1">
              Detected: {detectedVehicles.map(v => v.class).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCamera({ camera }: { camera: any }) {
  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <Cctv className="h-16 w-16" />
      </div>

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
