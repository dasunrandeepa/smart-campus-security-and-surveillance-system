# 🚗 Smart Campus Security and Surveillance System

This project is a **microservices-based**, **event-driven** vehicle detection and authorization system that helps manage and monitor vehicle access in a campus environment.

It consists of the following services:

- **Detection Service**: Detects incoming vehicles and publishes their plate numbers to RabbitMQ.
- **Authorization Service**: Listens for plate numbers and checks authorization by querying Supabase tables.
- **Logger Service**: Logs all access attempts and outcomes to Supabase.
- **Dashboard UI** : A simple FastAPI web interface for security officers to manually approve vehicles and pre-authorize visitor vehicles for events.

---

## ⚙️ Technologies Used

- Python 3.10+
- FastAPI
- RabbitMQ (message broker)
- Supabase (PostgreSQL + authentication + API)
- `pika` (RabbitMQ client)
- `supabase` (Supabase Python client)
- HTML + Jinja2 (for dashboard templates)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dasunrandeepa/smart-campus-security-and-surveillance-system.git
cd smart-campus-security-and-surveillance
```

### 2. Set Up Supabase

- Go to https://supabase.io and create a project.
- Create the required tables:

```bash
CREATE TABLE authorized_vehicles (
  plate_number TEXT PRIMARY KEY,
  owner_name TEXT,
  contact_info TEXT
);


CREATE TABLE vehicle_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('entered', 'exited', 'unauthorized_checked')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  security_clear BOOLEAN
);

CREATE TABLE guest_vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number TEXT NOT NULL,
    name TEXT NOT NULL,
    reason TEXT,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    added_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Set up RabbitMQ

- You can run RabbitMQ locally using Docker:

```bash
cd rabbitmq
docker-compose up -d
```
- Then visit: http://localhost:15672
- Login: guest / guest

### 4. Set up a Virtual Environment for each subfolder

```bash
cd subfolder-name
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
Add a .env file for each subfolder in the format .env.example
uvicorn main:app --reload --port PORTNUMBER
```


