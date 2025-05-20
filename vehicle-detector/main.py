from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from rabbitmq import publish_vehicle_detected

app = FastAPI()

class VehicleEntry(BaseModel):
    plate_number: str
    timestamp: datetime = datetime.now()
    filename: str

@app.post("/detect")
def detect_vehicle(entry: VehicleEntry):
    data = {
        "plate_number": entry.plate_number,
        "timestamp": entry.timestamp.isoformat(),
        "filename": entry.filename
    }
    publish_vehicle_detected(data)
    return {"message": "Vehicle detected", "data": data}
