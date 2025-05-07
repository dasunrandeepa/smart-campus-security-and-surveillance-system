# 🚗 Vehicle Access Control System

This project is a microservices-based, event-driven vehicle detection and authorization system. It consists of three main services:

- **Detection Service**: Detects vehicles and publishes plate numbers.
- **Authorization Service**: Checks if a vehicle is authorized based on Supabase records.
- **Logger Service**: Logs all access attempts and results to Supabase.

---

## ⚙️ Technologies Used

- Python
- FastAPI
- RabbitMQ (for messaging)
- Supabase (as the database backend)
- pika (RabbitMQ client)
- supabase-py (Python client for Supabase)

---
