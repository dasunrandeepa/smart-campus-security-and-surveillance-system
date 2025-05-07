# rabbitmq.py
import pika
import json
from supabase_utils import log_vehicle

def consume_vehicle_authorized():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    channel.queue_declare(queue="vehicle.authorization.result", durable=True)

    def callback(ch, method, properties, body):
        data = json.loads(body)
        print(f" [x] Received vehicle authorization data: {data}")

        # Log the vehicle data (both automatic and manual approvals)
        log_vehicle(data["plate_number"], "entered", True) #Hard coded

        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue="vehicle.authorization.result", on_message_callback=callback)
    print(' [*] Waiting for vehicle authorization results. To exit press CTRL+C')
    channel.start_consuming()
