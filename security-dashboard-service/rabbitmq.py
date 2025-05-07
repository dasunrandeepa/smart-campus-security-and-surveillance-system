# rabbitmq.py
import pika
import json
from data_store import pending_vehicles

def consume_manual_approval_requests():
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="manual_approval_requests", durable=True)

    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f"[x] Received manual approval request: {message}")
        pending_vehicles.append(message)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue="manual_approval_requests", on_message_callback=callback)
    print(" [*] Waiting for manual approval requests. To exit press CTRL+C")
    channel.start_consuming()
