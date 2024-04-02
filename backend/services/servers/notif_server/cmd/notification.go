package cmd

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"uniexplorers/broker"
	pb "uniexplorers/proto"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

type NotificationServer struct {
	pb.NotificationServiceServer
	// DB        *gorm.DB
	Api       *APIClient
	publisher *broker.Publisher
	consumer  *broker.Consumer
}

var ApiClientInstance *APIClient

func init() {
	godotenv.Load(".env")
	log.Print("Init API Client")
	apiUrl := os.Getenv("FORUM_API_URL")

	if apiUrl == "" {
		log.Printf("NO FORUM_API_URL set")
	}

	ApiClientInstance = InitAPIClient(apiUrl)
}

func NewNotificationServer(publisher *broker.Publisher, consumer *broker.Consumer) *NotificationServer {
	return &NotificationServer{
		Api:       ApiClientInstance,
		publisher: publisher,
		consumer:  consumer,
	}
}

// Publish message
func (s *NotificationServer) PublishNotification(ctx context.Context, in *pb.PublishNotificationRequest) (*pb.PublishNotificationResponse, error) {
	log.Printf("Received PublishNotification request: %s", in)

	// exchange := in.GetThreadId()
	exchange := "uniexplorers"
	bindingKey := fmt.Sprintf("%s.#", in.GetThreadId())
	queueName := fmt.Sprintf("%s.%s", in.GetThreadId(), in.GetCommentBy())
	if err := s.publisher.SetupExchangeAndQueue(exchange, queueName, bindingKey, queueName); err != nil {
		log.Printf("publisher.SetupExchangeAndQueue")
	}

	notification := &Notification{
		ThreadId:  in.GetThreadId(),
		CommentBy: in.GetCommentBy(),
		UniName:   in.GetUniName(),
		Message:   in.GetMessage(),
		CreatedAt: time.Now(),
	}
	bytes, err := json.Marshal(notification)
	if err != nil {
		log.Printf("json.Marshal")
	}

	routingKey := fmt.Sprintf("%s.%s", in.GetThreadId(), in.GetCommentBy())
	if err := s.publisher.Publish(bytes, "application/json", exchange, routingKey); err != nil {
		log.Printf("publisher.Publish")
	}
	req := &pb.AddNotificationsRequest{
		ThreadId:  in.GetThreadId(),
		CommentBy: in.GetCommentBy(),
		Message:   in.GetMessage(),
		UniName:   in.GetUniName(),
	}

	_, err = s.AddNotifications(context.Background(), req)
	if err != nil {
		log.Printf("Error add notification to DB")
	}

	return &pb.PublishNotificationResponse{Status: "success"}, nil
}

func (s *NotificationServer) AddNotifications(ctx context.Context, in *pb.AddNotificationsRequest) (*pb.AddNotificationsResponse, error) {
	log.Printf("Add Notifications")

	subscribersResp, err := s.GetSubscribers(context.Background(), &pb.GetSubscribersRequest{ThreadId: in.GetThreadId()})
	if err != nil {
		log.Printf("failed to get subscribers")
	}

	notifications := []*AddNotificationsRequest{}
	for _, subscriber := range subscribersResp.GetSubscribers() {
		if subscriber.UserEmail == in.GetCommentBy() {
			continue
		}
		newNotification := &AddNotificationsRequest{
			ThreadId:  in.GetThreadId(),
			CommentBy: in.GetCommentBy(),
			UniName:   in.GetUniName(),
			UserEmail: subscriber.GetUserEmail(),
			Message:   in.GetMessage(),
		}
		notifications = append(notifications, newNotification)
	}

	// PROBLEMATIC
	// res := s.DB.Create(&notifications)
	rowsAffected, err := s.Api.ApiAddNotification(notifications)
	if err != nil {
		log.Printf("failed to add notification via API")
	}

	if rowsAffected == 0 {
		return nil, errors.New("add subscriber unsuccessful")
	}

	return &pb.AddNotificationsResponse{Status: "success"}, nil
}

func (s *NotificationServer) GetNotifications(ctx context.Context, in *pb.GetNotificationsRequest) (*pb.GetNotificationsResponse, error) {
	log.Printf("Get Notifications")

	userEmail := in.GetUserEmail()
	apiNotifications, err := s.Api.ApiGetRecentNotifications(userEmail)

	if err != nil {
		log.Printf("Failed to get notifications: %v", err)
	}

	return &pb.GetNotificationsResponse{Notifications: apiNotifications}, nil
}

// Consume message
func (s *NotificationServer) StreamNotification(in *pb.StreamNotificationRequest, srv pb.NotificationService_StreamNotificationServer) error {
	log.Printf("Received StreamNotification request: %s", in.GetThreadId())

	subscribersResp, err := s.GetSubscribers(context.Background(), &pb.GetSubscribersRequest{ThreadId: in.GetThreadId()})
	if err != nil {
		log.Printf("failed to get subscribers")
	}

	// TODO: Create ConnectionPool to get connection

	handleMessage := func(d amqp.Delivery) {
		resp := &pb.StreamNotificationResponse{}
		if err := json.Unmarshal(d.Body, resp); err != nil {
			log.Printf("Error unmarshalling message: %s", err)
			return
		}
		if err := srv.Send(resp); err != nil {
			log.Printf("Error sending message to stream: %s", err)
			return
		}
		if err := d.Ack(false); err != nil {
			log.Printf("Error acknowledging message : %s", err)
		} else {
			log.Printf("Acknowledged message")
		}
	}

	for _, subscriber := range subscribersResp.GetSubscribers() {
		bindingKey := fmt.Sprintf("%s.#", in.GetThreadId())
		queueName := fmt.Sprintf("%s.%s", in.GetThreadId(), subscriber.GetUserEmail())
		err := s.consumer.StartConsumer("uniexplorers", queueName, bindingKey, queueName, handleMessage)
		if err != nil {
			log.Printf("publisher.StartConsumer")
		}
	}

	log.Printf("Return nil. No error")
	return nil
}

func (s *NotificationServer) GetSubscribers(ctx context.Context, req *pb.GetSubscribersRequest) (*pb.GetSubscribersResponse, error) {
	log.Printf("Get Subscribers")

	subscribers, err := s.Api.ApiGetSubscribers(req.GetThreadId())

	if err != nil {
		log.Printf("Failed to get subscribers: %v", err)
		return nil, err
	}

	return &pb.GetSubscribersResponse{
		Subscribers: subscribers,
	}, nil
}

func (s *NotificationServer) AddSubscriber(ctx context.Context, req *pb.AddSubscriberRequest) (*pb.AddSubscriberResponse, error) {
	log.Printf("Add Subscriber")
	// User already subscribed handled on Express, will return success here
	resp, err := s.Api.ApiAddSubscriber(req.GetThreadId(), req.GetUserEmail())

	if err != nil {
		log.Printf("Error adding subscriber: %v", err)
		return nil, err
	}

	log.Printf("New subscriber %s added for thread %s", req.GetThreadId(), req.GetUserEmail())
	return resp, nil
}
