package controllers

import (
	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/RamezTalaat/Clinic-Reservation-System/Models"
	"github.com/gofiber/fiber/v2"
)

type DoctorResponce struct{
	
	ID       uint   		`json:"id,omitempty"`
	Name     string 	`json:"name"`
	Mail     string 	`json:"mail"`
	Password string 	`json:"password"`
}

func ResponseMessage(user Models.Doctor) DoctorResponce{
	return DoctorResponce{
		ID: user.ID,
		Name: user.Name,
		Mail: user.Mail,
		Password: user.Password, 
	}
}
func CreateDoctor(c *fiber.Ctx) error{
	var doctor Models.Doctor
	if err := c.BodyParser(&doctor); err != nil{
		return c.Status(400).JSON(err.Error())
	}

	initializers.Database.Db.Create(&doctor)
	reaspose := ResponseMessage(doctor)

	return c.Status(200).JSON(reaspose)
}

