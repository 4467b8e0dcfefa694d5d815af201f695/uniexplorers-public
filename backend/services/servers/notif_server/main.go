package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	"uniexplorers/broker"
	"uniexplorers/cmd"
	pb "uniexplorers/proto"
	"uniexplorers/websocket"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/rs/cors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var ORIGINS = os.Getenv("ORIGINS")

func init() {
	// godotenv.Load(".env")
	go websocket.Setup()
}

func main() {
	grpcPort := os.Getenv("GRPC_PORT")
	grpcAddr := fmt.Sprintf(":%s", grpcPort)

	httpPort := os.Getenv("HTTP_PORT")
	httpAddr := fmt.Sprintf(":%s", httpPort)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%s", grpcPort))
	if err != nil {
		log.Fatalf("failed to listen on grpc port %s: %v", grpcPort, err)
	}

	// Separate connection used for Publisher
	publisher, err := broker.NewPublisher()
	if err != nil {
		log.Fatalf("RabbitMQ NewPublisher")
	}
	defer publisher.CloseChannel()
	log.Printf("Publisher Initialized")

	consumer, err := broker.NewConsumer()
	if err != nil {
		log.Fatalf("RabbitMQ NewConsumer")
	}
	defer consumer.CloseConnection()
	log.Printf("Consumer Initialized")

	grpcServer := grpc.NewServer()
	notifServer := cmd.NewNotificationServer(publisher, consumer)
	pb.RegisterNotificationServiceServer(grpcServer, notifServer)

	log.Printf("gRPC server listening at %v", lis.Addr())
	go func() {
		log.Fatalln(grpcServer.Serve(lis))
	}()

	// Create a client connection to the gRPC server we just started
	conn, err := grpc.Dial(grpcAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalln("Failed to dial grpc server:", err)
	}
	defer conn.Close()

	mux := runtime.NewServeMux()
	// Register gRPC
	err = pb.RegisterNotificationServiceHandler(context.Background(), mux, conn)
	if err != nil {
		log.Fatalln("Failed to register grpc service:", err)
	}

	c := enableCORS()
	gwServer := &http.Server{
		Addr:    httpAddr,
		Handler: c.Handler(mux),
	}

	log.Printf("Serving gRPC-Gateway on port %s", httpPort)
	log.Fatalln(gwServer.ListenAndServe())

	// WsEntry()
}

func enableCORS() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:   []string{ORIGINS},
		AllowedHeaders:   []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})
}
