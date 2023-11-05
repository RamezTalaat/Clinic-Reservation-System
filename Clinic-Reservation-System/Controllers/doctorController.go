package controllers

import (
	"errors"

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
func GetDoctors(c *fiber.Ctx) error{
	doctors := []Models.Doctor{}

	initializers.Database.Db.Find(&doctors)
	response := []DoctorResponce{}

	for _,doctor := range doctors{
		responseDoctor :=ResponseMessage(doctor)
		response = append(response, responseDoctor)
	}

	return c.Status(200).JSON(response)
}
func findUser(id int, doctor *Models.Doctor) error{
	initializers.Database.Db.Find(doctor,"id = ?", id)

	if doctor.ID == 0{
		return errors.New("user doesn't exist")
	}
	return nil
}
func GetDoctor(c *fiber.Ctx) error{
	id, err := c.ParamsInt("id")

	var doctor Models.Doctor

	if err != nil {
		return c.Status(400).JSON("Please enter an integer")
	}

	if err := findUser(id, &doctor); err !=nil{
		return c.Status(400).JSON(err.Error())
	}

	response := ResponseMessage(doctor)
	return c.Status(200).JSON(response)
}
