package main

import (
	"os"

	controllers "github.com/RamezTalaat/Clinic-Reservation-System/Controllers"
	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
	"github.com/gofiber/fiber/v2"
)

func init(){
	initializers.LoadEnvVariables()
	initializers.ConnectToDatabase()
}
func Routers (app *fiber.App){
	app.Get("/API", welcome)
	app.Post("/doctorSignUp",controllers.CreateDoctor)
	app.Post("/doctorSignIn",controllers.SignInDoctor)
	app.Get("/getDoctors",controllers.GetDoctors)
	app.Get("/getDoctor/:id",controllers.GetDoctor)
	app.Post("/patientSignUp",controllers.CreatePatient)
	app.Post("/patientSignIn",controllers.SignInPatient)
	app.Get("/getPatients",controllers.GetPatient)
	app.Get("/activeDB",controllers.GetActiveDB)   // to test the ative DB entries
	
}

func welcome(c *fiber.Ctx) error {
	return c.SendString("welcome to our API")
}
func main(){
	app := fiber.New()

    //app.Get("/",welcome)
	Routers(app)

    app.Listen(":" + os.Getenv("PORT"))
}