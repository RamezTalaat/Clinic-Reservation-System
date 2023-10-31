package main

import (
	"os"

	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/gofiber/fiber/v2"
)

func init(){
	initializers.LoadEnvVariables()
	initializers.ConnectToDatabase()
}

func welcome(c *fiber.Ctx) error {
	return c.SendString("welcome to our API")
}
func main(){
	app := fiber.New()

    app.Get("/",welcome)

    app.Listen(":" + os.Getenv("PORT"))
}