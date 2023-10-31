package main

import (
	"fmt"

	initializers "github.com/RamezTalaat/Clinic-Reservation-System/Initializers"
)

func init(){
	initializers.LoadEnvVariables()
	initializers.ConnectToDatabase()
}

func main(){
	fmt.Println("Hello")
}