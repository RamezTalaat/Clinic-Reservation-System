package initializers

import (
	"fmt"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)
var err error
var DB *gorm.DB

func ConnectToDatabase() {
	
	dsn := os.Getenv("DB_URL")
	_, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil{
		fmt.Println("Failed to connect to Database")
	}else {
		fmt.Println("Connected to Database successfully")
	}
}