package initializers

import (
	"fmt"
	"os"

	"github.com/RamezTalaat/Clinic-Reservation-System/Models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDatabase() {
	var err error

	dsn := os.Getenv("DB_URL")
	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil{
		fmt.Println("Failed to connect to Database")
	}else {
		fmt.Println("Connected to Database successfully")
	}

	//Migration
	DB.AutoMigrate(&Models.Doctor{}, &Models.Slot{}, &Models.Appointment{})
}


	
