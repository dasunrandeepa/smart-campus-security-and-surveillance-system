from fastapi import FastAPI
import threading
from rabbitmq_listener import consume_vehicle_authorized

app = FastAPI()

@app.on_event("startup")
def startup_event():
    thread = threading.Thread(target=consume_vehicle_authorized)
    thread.daemon = True
    thread.start()

@app.get("/")
def read_root():
    return {"message": "Logger service is running"}
