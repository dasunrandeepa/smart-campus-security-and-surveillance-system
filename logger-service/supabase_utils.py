from supabase import create_client, Client

url = "https://zaflkozecixjuxyuscve.supabase.co"  # Your Supabase URL
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZmxrb3plY2l4anV4eXVzY3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDg4OTYsImV4cCI6MjA2MjA4NDg5Nn0.11lgk1syAG8ujRbY5x6oLlGrVELCr9XcnOU2E3FcQXE"

supabase: Client = create_client(url, key)

def log_vehicle(plate_number: str, status: str, security_clear: bool):
    try:
        # Insert log entry into the Supabase database
        response = supabase.table("vehicle_logs").insert({
            "plate_number": plate_number,
            "status": status,
            "security_clear": security_clear
        }).execute()
        print("Log inserted:", response)
    except Exception as e:
        print("Error logging vehicle:", e)
