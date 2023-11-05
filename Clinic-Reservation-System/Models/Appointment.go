package Models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Appointment struct {
	gorm.Model

	ID 	json.Number 		`json:"id" gorm:"primaryKey"`
	DoctorID json.Number 	`json:"doctor_id" gorm:"not null"`
	Doctor	Doctor
	SlotID json.Number		`json:"slot_id" gorm:"not null"`
	Slot	Slot
	PatientID json.Number	`json:"patient_id" gorm:"not null"`
	Patient Patient

}