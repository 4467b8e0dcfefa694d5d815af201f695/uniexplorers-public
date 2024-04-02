package broker

import (
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/streadway/amqp"
)

type Publisher struct {
	amqpChan *amqp.Channel
}

// Rabbitmq publisher constructor
func NewPublisher() (*Publisher, error) {
	mqConn, err := NewRabbitMQConn()
	if err != nil {
		return nil, err
	}
	amqpChan, err := mqConn.Channel()
	if err != nil {
		log.Fatalf("mqConn.Channel")
	}

	return &Publisher{amqpChan: amqpChan}, nil
}

// SetupExchangeAndQueue create exchange and queue
func (p *Publisher) SetupExchangeAndQueue(exchange, queueName, bindingKey, consumerTag string) error {
	err := p.amqpChan.ExchangeDeclare(
		exchange, // threadId
		exchangeKind,
		exchangeDurable,
		exchangeAutoDelete,
		exchangeInternal,
		exchangeNoWait,
		nil,
	)
	if err != nil {
		log.Fatalf("Error ch.ExchangeDeclare")
	}
	log.Printf("Declared exchange: %s", exchange)

	_, err = p.amqpChan.QueueDeclare(
		"", // userEmail
		queueDurable,
		queueAutoDelete,
		queueExclusive,
		queueNoWait,
		nil,
	)
	if err != nil {
		log.Fatalf("Error ch.QueueDeclare")
	}

	// log.Printf("Declared queue, binding it to exchange: Queue: %v, messageCount: %v, "+
	// 	"consumerCount: %v, exchange: %v, bindingKey: %v",
	// 	queue.Name,
	// 	queue.Messages,
	// 	queue.Consumers,
	// 	exchange,
	// 	bindingKey,
	// )

	// err = p.amqpChan.QueueBind(
	// 	queue.Name,
	// 	bindingKey,
	// 	exchange,
	// 	queueNoWait,
	// 	nil,
	// )
	// if err != nil {
	// 	log.Fatalf("Error ch.QueueBind")
	// }

	// log.Printf("Queue bound to exchange, starting to consume from queue, consumerTag: %v", consumerTag)
	return nil
}

// Close channel
func (p *Publisher) CloseChannel() {
	if err := p.amqpChan.Close(); err != nil {
		log.Fatalf("Publisher CloseChannel: %v", err)
	}
}

// Publish message
func (p *Publisher) Publish(body []byte, contentType string, exchange, routingKey string) error {
	log.Printf("Publishing message Exchange: %s, RoutingKey: %s", exchange, routingKey)

	if err := p.amqpChan.Publish(
		exchange,
		routingKey,
		publishMandatory,
		publishImmediate,
		amqp.Publishing{
			ContentType:  contentType,
			DeliveryMode: amqp.Persistent,
			MessageId:    uuid.New().String(),
			Timestamp:    time.Now(),
			Body:         body,
		},
	); err != nil {
		log.Fatalf("ch.Publish")
	}

	return nil
}
