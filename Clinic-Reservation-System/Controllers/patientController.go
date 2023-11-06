package controllers

import (
	"fmt"
	"strconv"

	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/RamezTalaat/Clinic-Reservation-System/Models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PatientResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Mail     string `json:"mail"`
	Password string `json:"password"`
	Appointments []Models.Appointment `json:"appointments"`
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

	var searchPatient Models.Patient
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

	initializers.Database.Db.Where("mail = ?" ,  patient.Mail).First(&searchPatient)

	activeDb :=  getActiveDBInstance()
	
	uid := activeDb.AddPatient(searchPatient.ID)
	return c.Status(200).JSON(uid)
}

func GetPatientByUID (c *fiber.Ctx) error {
	var patient Models.Patient

	uuid := c.Params("uuid")

	db := getActiveDBInstance()

	patientID := db.GetPatient(uuid)

	if patientID == 0{
		return c.Status(400).JSON("UUID Is incorrect")
	}

	
    if err := initializers.Database.Db.Table("patients").Select("id ,name, mail, password").Where("id = ?", db.ActivePatients[uuid]).Preload("Appointments").First(&patient).Error; err != nil {
        if gorm.ErrRecordNotFound == err {
            return c.Status(404).JSON(fiber.Map{
                "message": "Patient not found",
            })
        }
        return c.Status(500).JSON(fiber.Map{
            "message": "Database error",
        })
    }

    return c.JSON(patient)
}

func AddAppointment(c *fiber.Ctx) error{
	appointment:= Models.Appointment{}
	uuid := c.Params("uuid")
	//checking uuid
	db := getActiveDBInstance()
	patientID := db.GetPatient(uuid)
	if patientID == 0{
		return c.Status(400).JSON("UUID Is incorrect")
	}

	// add patient to appointment
	var patient Models.Patient
	initializers.Database.Db.Find("id = ?", patientID).First(&patient)
	appointment.PatientRefer = int(patientID)
	fmt.Println("patinet added to appointment")
	

	doctor_id :=  c.Params("doctor_id")
	newdoctor_id, err :=  strconv.Atoi(doctor_id)
	if err != nil {
		// Handle error
		fmt.Println("Failed to convert doctor id to int:", err)
		
	}
	fmt.Println("Doctor id", newdoctor_id)
	//checking doctor id
	var doctor Models.Doctor
	result := initializers.Database.Db.Where("id = ?" ,  newdoctor_id).First(&doctor)

	if result.Error != nil{
		return c.Status(400).JSON("wront doctor ID , this doctor does not exist")
	}
	
	appointment.DoctorRefer = newdoctor_id

	fmt.Println("doctor added to appointment")

	slot_id := c.Params("slot_id")
	newslot_id, err :=  strconv.Atoi(slot_id)
	if err != nil {
		// Handle error
		fmt.Println("Failed to convert slot id to int:", err)
		
	}
	//checking doctor id
	var slot Models.Slot
	result = initializers.Database.Db.Where("id = ?" ,  newslot_id).First(&slot)

	if result.Error != nil{
		return c.Status(400).JSON("wront slot ID , this slot does not exist")
	}

	if slot.Occuppied {
		return c.Status(400).JSON("slot is occupied")
	}
	appointment.SlotRefer = newslot_id
	fmt.Println("slot added to appointment")

	initializers.Database.Db.Create(&appointment)
	fmt.Println("appointment created")
	slot.Occuppied = true
	initializers.Database.Db.Save(&slot)

	/// make slot occuppied
	
	return c.Status(200).JSON("appointment added successfully")
}

