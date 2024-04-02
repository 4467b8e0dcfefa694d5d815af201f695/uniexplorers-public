package broker

import (
	"fmt"
	"os"

	"github.com/streadway/amqp"
)

const (
	exchangeKind       = "topic"
	exchangeDurable    = true
	exchangeAutoDelete = false
	exchangeInternal   = false
	exchangeNoWait     = false

	queueDurable    = true
	queueAutoDelete = false
	queueExclusive  = false
	queueNoWait     = false

	publishMandatory = false
	publishImmediate = false

	prefetchCount  = 1
	prefetchSize   = 0
	prefetchGlobal = false

	consumeAutoAck   = false
	consumeExclusive = false
	consumeNoLocal   = false
	consumeNoWait    = false
)

func NewRabbitMQConn() (*amqp.Connection, error) {
	host := os.Getenv("BROKER_HOST")
	user := os.Getenv("BROKER_USER")
	password := os.Getenv("BROKER_PASSWORD")
	port := os.Getenv("BROKER_PORT")

	return amqp.Dial(fmt.Sprintf("amqp://%s:%s@%s:%s/", user, password, host, port))
}
