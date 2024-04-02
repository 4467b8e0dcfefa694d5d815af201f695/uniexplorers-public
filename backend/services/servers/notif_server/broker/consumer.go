package broker

import (
	"fmt"
	"log"
	"sync"

	"github.com/streadway/amqp"
)

type Consumer struct {
	amqpConn *amqp.Connection
}

func NewConsumer() (*Consumer, error) {
	mqConn, err := NewRabbitMQConn()
	if err != nil {
		return nil, err
	}
	return &Consumer{amqpConn: mqConn}, nil
}

func (c *Consumer) CreateChannel(exchangeName string) (*amqp.Channel, error) {
	ch, err := c.amqpConn.Channel()
	if err != nil {
		log.Fatalf("Error amqpConn.Channel...")
	}

	// Declare Exchange
	err = ch.ExchangeDeclare(
		exchangeName,
		exchangeKind,
		exchangeDurable,
		exchangeAutoDelete,
		exchangeInternal,
		exchangeNoWait,
		nil,
	)
	if err != nil {
		log.Fatalf("Error ch.ExchangeDeclare... %s", err)
	}

	return ch, nil
}

// Close channel
func (c *Consumer) CloseConnection() {
	if err := c.amqpConn.Close(); err != nil {
		log.Fatalf("Consumer CloseConnection: %v", err)
	}
}

// StartConsumer Start new rabbitmq consumer
func (c *Consumer) StartConsumer(exchange, queueName, bindingKey, consumerTag string, handleMessage func(amqp.Delivery)) error {
	// func (c *Consumer) StartConsumer(workerPoolSize int, exchange, queueName, bindingKey, consumerTag string) error {
	// ctx, cancel := context.WithCancel(context.Background())
	// defer cancel()
	// TODO: Handle context canceled [Error sending message to stream: rpc error: code = Canceled desc = context canceled]

	ch, err := c.CreateChannel(exchange)
	if err != nil {
		log.Fatalf("CreateChannel")
	}
	defer ch.Close()

	msgs, err := ch.Consume(
		queueName,
		consumerTag,
		consumeAutoAck,
		consumeExclusive,
		consumeNoLocal,
		consumeNoWait,
		nil,
	)
	if err != nil {
		log.Fatalf("Consume")
	}

	// TODO: Create WorkerPool for concurrency
	// for i := 0; i < workerPoolSize; i++ {
	// 	go c.worker(ctx, deliveries)
	// }

	go func() {
		for d := range msgs {
			handleMessage(d) // Invoke the callback function for each message
		}
	}()

	chanErr := <-ch.NotifyClose(make(chan *amqp.Error))
	log.Fatalf("ch.NotifyClose: %v", chanErr)
	return chanErr
}

// StartConsumer Start new rabbitmq consumer
func (c *Consumer) StartConsumerWS(exchange, email string, topics []string, handleMessage func(amqp.Delivery)) error {
	wg := &sync.WaitGroup{}
	wg.Add(1)
	defer wg.Done()

	ch, err := c.CreateChannel(exchange)
	if err != nil {
		return err
	}
	defer ch.Close()

	for _, topic := range topics {
		q, err := ch.QueueDeclare("", queueDurable, queueAutoDelete, queueExclusive, queueNoWait, nil)
		if err != nil {
			log.Printf("queue.declare: %v", err)
			return err
		}

		err = ch.QueueBind(q.Name, topic, exchange, queueNoWait, nil)
		if err != nil {
			log.Printf("queue.bind: %v", err)
			return err
		}

		messages, err := ch.Consume(q.Name, fmt.Sprintf("%s-%s", email, topic), false, false, false, false, nil)
		if err != nil {
			log.Printf("Error ch.Consume")
			return err
		}

		go func() {
			for {
				select {
				case msg, ok := <-messages:
					if !ok {
						return // when the chan msgs is closed then it can stop consuming messages
					}
					wg.Add(1)
					handleMessage(msg)
					wg.Done()
				}
			}
		}()
	}
	wg.Wait()

	return nil
}
