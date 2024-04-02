package cmd

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDatabase() *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		os.Getenv("FORUM_DB_HOST"),
		os.Getenv("FORUM_DB_USER"),
		os.Getenv("FORUM_DB_PASSWORD"),
		os.Getenv("FORUM_DB_NAME"),
		os.Getenv("FORUM_DB_PORT"),
	)
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln("gorm.Open")
	}
	database.AutoMigrate(WatchThread{})
	database.AutoMigrate(Notification{})

	log.Printf("PostgresDB Connected")
	return database
}
