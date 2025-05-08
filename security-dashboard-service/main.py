# main.py
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
import threading
from manual_approvals import get_all_pending, remove_vehicle
from rabbitmq import consume_manual_approvals, send_manual_approval

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
def start_consumer():
    thread = threading.Thread(target=consume_manual_approvals)
    thread.daemon = True
    thread.start()

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    vehicles = get_all_pending()
    return templates.TemplateResponse("dashboard.html", {"request": request, "vehicles": vehicles})

@app.post("/approve/{plate_number}")
def approve_vehicle(plate_number: str):
    vehicles = get_all_pending()
    for vehicle in vehicles:
        if vehicle["plate_number"] == plate_number:
            send_manual_approval(vehicle)
            remove_vehicle(plate_number)
            break
    return RedirectResponse(url="/", status_code=303)
