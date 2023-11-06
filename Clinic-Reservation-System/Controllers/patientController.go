package controllers

import (
	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/RamezTalaat/Clinic-Reservation-System/Models"
	"github.com/gofiber/fiber/v2"
)

type PatientResponce struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

func PatientResponse(patient Models.Patient) PatientResponce{ 
	return PatientResponce{
		ID: patient.ID,
		Name: patient.Name,
		Mail: patient.Mail,
		Password: patient.Password,
	}
}

func GetPatient(c *fiber.Ctx) error{
	patients := []Models.Patient{}

	initializers.Database.Db.Find(&patients)
	response := []PatientResponce{}

	for _,patient := range patients{
		responseDB := PatientResponce(patient)
		response = append(response, responseDB)
	}

	return c.Status(200).JSON(response)
}