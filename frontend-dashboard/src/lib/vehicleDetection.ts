import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

let model: cocoSsd.ObjectDetection | null = null;

export async function loadModel() {
  if (!model) {
    model = await cocoSsd.load();
  }
  return model;
}

export async function detectVehicles(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  if (!model) {
    model = await loadModel();
  }

  const predictions = await model.detect(video);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Filter for vehicle predictions (car, truck, bus, motorcycle)
  const vehicleClasses = ['car', 'truck', 'bus', 'motorcycle'];
  const vehiclePredictions = predictions.filter(pred => 
    vehicleClasses.includes(pred.class.toLowerCase())
  );

  // Draw bounding boxes for vehicles
  vehiclePredictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;
    
    // Draw bounding box
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw label
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Arial';
    ctx.fillText(
      `${prediction.class} ${Math.round(prediction.score * 100)}%`,
      x, y > 20 ? y - 5 : y + 20
    );
  });

  return vehiclePredictions;
} 