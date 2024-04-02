package cmd

import "time"

// Users subscribed to Thread
type Subscriber struct {
	ThreadId  int32  `json:"thread_id"`
	UserEmail string `json:"user_email"`
}

type WatchThread struct {
	ThreadId  int32     `json:"thread_id" gorm:"primaryKey;autoIncrement:false"`
	UserEmail string    `json:"user_email" gorm:"primaryKey;autoIncrement:false"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime:true"`
}

// Notification Message
type Notification struct {
	Id        int32     `json:"id" gorm:"primaryKey;autoIncrement:true"`
	ThreadId  int32     `json:"thread_id"`
	UniName   string    `json:"uni_name"`
	CommentBy string    `json:"comment_by"` // comment made by user
	UserEmail string    `json:"user_email"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime:true"`
}

type AddSubscriberRequest struct {
	ThreadId  int32  `json:"thread_id"`
	UserEmail string `json:"user_email"`
}

type AddNotificationsRequest struct {
	ThreadId  int32  `json:"thread_id"`
	CommentBy string `json:"comment_by"`
	UniName   string `json:"uni_name"`
	UserEmail string `json:"user_email"`
	Message   string `json:"message"`
}
