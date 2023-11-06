package controllers

import (
	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/RamezTalaat/Clinic-Reservation-System/Models"
	"github.com/gofiber/fiber/v2"
)

type PatientResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

func PatientResponseMessage(patient Models.Patient) PatientResponse{ 
	return PatientResponse{
		ID: patient.ID,
		Name: patient.Name,
		Mail: patient.Mail,
		Password: patient.Password,
	}
}

func SignInPatient(c *fiber.Ctx) error{
	var patient Models.Patient
	if err := c.BodyParser(&patient); err != nil{
		return c.Status(400).JSON(err.Error())
	}

	var searchPatient Models.Doctor
	result := initializers.Database.Db.Where("mail = ? AND password = ?" ,  patient.Mail , patient.Password).First(&searchPatient)

	
	if result.Error != nil{
		return c.Status(400).JSON("Can not sign in ,Wrong mail or password")
	}

	activeDb :=  getActiveDBInstance()
	
	uid := activeDb.AddPatient(searchPatient.ID)
	return c.Status(200).JSON(uid)
}

func GetPatient(c *fiber.Ctx) error{
	patients := []Models.Patient{}

	initializers.Database.Db.Find(&patients)
	response := []PatientResponse{}

	for _,patient := range patients{
		responseDB := PatientResponse(patient)
		response = append(response, responseDB)
	}

	return c.Status(200).JSON(response)
}

func CreatePatient(c *fiber.Ctx) error{
	var patient Models.Patient
	if err := c.BodyParser(&patient); err != nil{
		return c.Status(400).JSON(err.Error())
	}

	// checking if the credentials are taken
	var searchPatient Models.Patient
	result := initializers.Database.Db.Where("name = ?" , patient.Name).First(&searchPatient)

	if result.Error == nil{
		return c.Status(400).JSON("This user name is already taken , try another one")
	}
	result = initializers.Database.Db.Where("mail = ?" , patient.Mail).First(&searchPatient)

	if result.Error == nil{
		return c.Status(400).JSON("A user with this mail Already exists")
	}

	result = initializers.Database.Db.Where("password = ?" , patient.Password).First(&searchPatient)

	if result.Error == nil{
		return c.Status(400).JSON("Password Already Taken , Try again with another password")
	}

	initializers.Database.Db.Create(&patient)

	activeDb :=  getActiveDBInstance()
	
	uid := activeDb.AddPatient(patient.ID)
	return c.Status(200).JSON(uid)
}