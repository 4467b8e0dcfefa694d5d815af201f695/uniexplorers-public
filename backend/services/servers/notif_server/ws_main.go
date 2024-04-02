package main

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"uniexplorers/broker"
	"uniexplorers/cmd"
	"uniexplorers/websocket"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	query, _ := url.ParseQuery(r.URL.RawQuery)
	email := query.Get("userEmail")
	log.Printf("WebSocket Endpoint Hit by %s", email)

	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	consumer, err := broker.NewConsumer()
	notifServer := cmd.NewNotificationServer(nil, consumer)
	if err != nil {
		log.Fatalf("broker.NewConsumer.. %v", err)
	}

	client := &websocket.Client{
		Conn:        conn,
		Pool:        pool,
		ID:          email,
		Consumer:    consumer,
		NotifServer: notifServer,
	}

	pool.Register <- client
	go client.Read()
	go client.Write()
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	setupRoutes()

	port := os.Getenv("WS_PORT")
	log.Printf("Notification Server Websocket serving on port %s", port)
	http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
}
