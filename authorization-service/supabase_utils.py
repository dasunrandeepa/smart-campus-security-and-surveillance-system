# supabase_client.py (renamed from supabase.py to avoid conflicts)

from supabase import create_client, Client

url = "https://zaflkozecixjuxyuscve.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZmxrb3plY2l4anV4eXVzY3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDg4OTYsImV4cCI6MjA2MjA4NDg5Nn0.11lgk1syAG8ujRbY5x6oLlGrVELCr9XcnOU2E3FcQXE"  # Replace with your Supabase API key

supabase: Client = create_client(url, key)

def is_authorized(plate_number: str) -> bool:
    try:
        result = supabase.table("authorized_vehicles").select("plate_number").eq("plate_number", plate_number).execute()
        return bool(result.data)
    except Exception as e:
        print(f"Error checking authorization: {e}")
        return False
