import pika
import json
from supabase_utils import log_vehicle

def consume_authorization_result():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="vehicle.authorization.result")

    def callback(ch, method, properties, body):
        data = json.loads(body)
        print("Received authorization result:", data)

        log_vehicle(
            plate_number=data["plate_number"],
            status="entered",
            security_clear=True,
        )

    channel.basic_consume(queue="vehicle.authorization.result", on_message_callback=callback, auto_ack=True)
    print("Logger service is listening on vehicle.authorization.result queue...")
    channel.start_consuming()
