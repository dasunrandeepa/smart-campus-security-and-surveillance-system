# main.py
from fastapi import FastAPI
from data_store import pending_vehicles
import threading
from rabbitmq import consume_manual_approval_requests
import pika, json

app = FastAPI()

def start_consumer():
    consume_manual_approval_requests()

@app.on_event("startup")
def startup_event():
    thread = threading.Thread(target=start_consumer)
    thread.daemon = True
    thread.start()

@app.get("/")
def root():
    return {"message": "Security dashboard running"}

@app.get("/pending-vehicles")
def get_pending():
    return pending_vehicles

@app.post("/approve/{plate_number}")
def approve_vehicle(plate_number: str):
    for vehicle in pending_vehicles:
        if vehicle["plate_number"] == plate_number:
            pending_vehicles.remove(vehicle)

            result = {
                "plate_number": plate_number,
                "is_authorized": False,
                "security_clear": True,
                "timestamp": vehicle["timestamp"]
            }

            publish_manual_approval(result)
            return {"message": f"{plate_number} approved and logged."}
    return {"error": "Plate number not found."}

def publish_manual_approval(data: dict):
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="vehicle.authorization.result", durable=True)

    # Include manual approval fields
    enriched = {
        "plate_number": data["plate_number"],
        "status": "unauthorized",
        "security_clear": True,
        "timestamp": data["timestamp"]
    }

    channel.basic_publish(
        exchange="",
        routing_key="vehicle.authorization.result",
        body=json.dumps(enriched),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f"[x] Sent manually approved vehicle to vehicle_authorized queue: {enriched}")
    connection.close()
