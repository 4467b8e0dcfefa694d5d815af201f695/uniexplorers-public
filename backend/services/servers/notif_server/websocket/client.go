package websocket

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"uniexplorers/broker"
	"uniexplorers/cmd"

	"github.com/gorilla/websocket"
	"github.com/streadway/amqp"
)

type Client struct {
	ID          string // email
	Conn        *websocket.Conn
	Pool        *Pool
	send        chan []byte
	mu          sync.Mutex
	Consumer    *broker.Consumer
	NotifServer *cmd.NotificationServer
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, message, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		fmt.Printf("MessageType %v", messageType)

		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		data := map[string][]byte{
			"message": message,
			"id":      []byte(c.ID),
		}
		userMessage, _ := json.Marshal(data)
		c.Pool.Broadcast <- userMessage

		// req := &pb.GetNotificationsRequest{}
		// json.Unmarshal(p, &req)
		// // req.GetThreadId()
		// res, err := notifServer.GetNotifications(context.Background(), &pb.GetNotificationsRequest{UserEmail: req.GetUserEmail()})
		// notifications := res.GetNotifications()

		// for _, notif := range notifications {
		// 	message := Message{Type: messageType, Body: string(p)}
		// 	// message := notif
		// 	c.Pool.Broadcast <- message
		// 	fmt.Printf("Message Received: %+v\n", message)
		// }

	}
}

func (c *Client) Write() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	email := c.ID

	// PROBLEMATIC
	// res := c.NotifServer.DB.Where("user_email = ?", email).Find(&threads)
	threads, err := c.NotifServer.Api.ApiGetUserSubscribed(email)
	if err != nil {
		log.Printf("Error returning user subscriptions from API")
	}

	handleMessage := func(d amqp.Delivery) {
		resp := &cmd.Notification{}
		if err := json.Unmarshal(d.Body, resp); err != nil {
			log.Printf("Error unmarshalling message: %s", err)
			return
		}
		if err := c.Conn.WriteJSON(resp); err != nil {
			log.Printf("Error sending message to stream: %s", err)
			return
		}
		if err := d.Ack(false); err != nil {
			log.Printf("Error acknowledging message : %s", err)
		} else {
			log.Printf("Acknowledged message")
		}
	}

	exchange := "uniexplorers"
	topics := []string{}
	for _, thread := range threads {
		topic := fmt.Sprintf("%s.#", thread.ThreadId)
		topics = append(topics, topic)
	}
	c.Consumer.StartConsumerWS(exchange, email, topics, handleMessage)
}
