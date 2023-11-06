package controllers

import (
	"errors"

	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/RamezTalaat/Clinic-Reservation-System/Models"
	"github.com/gofiber/fiber/v2"
)

type DoctorResponse struct{
	
	ID       uint   	`json:"id,omitempty"`
	Name     string 	`json:"name"`
	Mail     string 	`json:"mail"`
	Password string 	`json:"password"`
	Slots	Models.Slot	`json:"slots"`
}

func ResponseMessage(user Models.Doctor) DoctorResponse{
	var slots Models.Slot
	return DoctorResponse{
		ID: user.ID,
		Name: user.Name,
		Mail: user.Mail,
		Password: user.Password,
		Slots: Models.Slot{
			ID:	slots.ID,
			Date: slots.Date,
			Hour: slots.Hour, 
		},
	}
}
func SignInDoctor(c *fiber.Ctx) error{
	var doctor Models.Doctor
	if err := c.BodyParser(&doctor); err != nil{
		return c.Status(400).JSON(err.Error())
	}

	var searchDoc Models.Doctor
	result := initializers.Database.Db.Where("mail = ? AND password = ?" ,  doctor.Mail , doctor.Password).First(&searchDoc)

	
	if result.Error != nil{
		return c.Status(400).JSON("Can not sign in ,Wrong mail or password")
	}

	activeDb :=  getActiveDBInstance()
	
	uid := activeDb.AddDoctor(searchDoc.ID)
	return c.Status(200).JSON(uid)

}

func CreateDoctor(c *fiber.Ctx) error{
	var doctor Models.Doctor
	if err := c.BodyParser(&doctor); err != nil{
		return c.Status(400).JSON(err.Error())
	}

	// checking if the credentials are taken
	var searchDoc Models.Doctor
	result := initializers.Database.Db.Where("name = ?" , doctor.Name).First(&searchDoc)

	if result.Error == nil{
		return c.Status(400).JSON("This user name is already taken , try another one")
	}
	result = initializers.Database.Db.Where("mail = ?" , doctor.Mail).First(&searchDoc)

	if result.Error == nil{
		return c.Status(400).JSON("A user with this mail Already exists")
	}

	result = initializers.Database.Db.Where("password = ?" , doctor.Password).First(&searchDoc)

	if result.Error == nil{
		return c.Status(400).JSON("Password Already Taken , Try again with another password")
	}

	initializers.Database.Db.Create(&doctor)

	activeDb :=  getActiveDBInstance()
	
	uid := activeDb.AddDoctor(doctor.ID)
	return c.Status(200).JSON(uid)
}
func GetDoctors(c *fiber.Ctx) error{
	doctors := []Models.Doctor{}

	initializers.Database.Db.Find(&doctors)
	response := []DoctorResponse{}

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
