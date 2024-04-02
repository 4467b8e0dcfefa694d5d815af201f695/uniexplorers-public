package websocket

import (
	"encoding/json"
	"fmt"
	"log"
)

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan []byte
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan []byte),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client, _ := range pool.Clients {
				log.Printf("New User Joined... " + client.ID)
			}
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			log.Printf("User left... " + client.ID)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
		case message := <-pool.Broadcast:
			var data map[string][]byte
			json.Unmarshal(message, &data)
			for client, _ := range pool.Clients {
				// prevent self receive message
				if client.ID == string(data["id"]) {
					log.Printf(client.ID, data)
					continue
				}
				if err := client.Conn.WriteJSON(message); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
}
