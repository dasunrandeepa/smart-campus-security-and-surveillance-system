import pika
import json
from supabase import create_client, Client
from supabase_utils import is_authorized

# Initialize Supabase client
url = "https://zaflkozecixjuxyuscve.supabase.co"  
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZmxrb3plY2l4anV4eXVzY3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDg4OTYsImV4cCI6MjA2MjA4NDg5Nn0.11lgk1syAG8ujRbY5x6oLlGrVELCr9XcnOU2E3FcQXE"  # Replace with your Supabase API key
supabase: Client = create_client(url, key)

def consume_vehicle_detected():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="vehicle_detected", durable=True)

    def callback(ch, method, properties, body):
        message = json.loads(body)
        plate_number = message.get("plate_number")
        timestamp = message.get("timestamp")

        print(f" [x] Received vehicle: {plate_number}")

        authorized = is_authorized(plate_number)

        result = {
            "plate_number": plate_number,
            "is_authorized": authorized,
            "timestamp": timestamp
        }

        publish_authorization_result(result)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue="vehicle_detected", on_message_callback=callback)
    print(" [*] Authorization service is listening for vehicle detections...")
    channel.start_consuming()

def publish_authorization_result(data: dict):
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="vehicle.authorization.result", durable=False)

    channel.basic_publish(
        exchange="",
        routing_key="vehicle.authorization.result",
        body=json.dumps(data),
        properties=pika.BasicProperties(delivery_mode=2)
    )
    print(f" [x] Sent authorization result: {data}")
    connection.close()