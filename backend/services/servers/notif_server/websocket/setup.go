package websocket

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"uniexplorers/broker"
	"uniexplorers/cmd"
)

func serveWs(pool *Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")

	query, err := url.ParseQuery(r.URL.RawQuery)
	email := query.Get("userEmail")
	log.Printf(email)

	conn, err := Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	consumer, err := broker.NewConsumer()
	notifServer := cmd.NewNotificationServer(nil, consumer)
	if err != nil {
		log.Fatalf("broker.NewConsumer.. %v", err)
	}

	client := &Client{
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
	pool := NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func Setup() {
	setupRoutes()

	port := os.Getenv("WS_PORT")
	go http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	fmt.Printf("Notification Server Websocket Listening on port %s\n", port)
}
