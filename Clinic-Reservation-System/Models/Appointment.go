package Models

import "gorm.io/gorm"

type Appointment struct {
	gorm.Model
	ID         uint `json:"id" gorm:"primarykey"`
	Doctor_id  uint  `json:"doctor_id"`
	Doctor 	   Doctor `gorm:"foreignKey:Doctor_id"`
	Slot_id    uint  `json:"slot_id"`
	Slot	   Slot	  `gorm:"foreignKey:Slot_id"`	
	//Patient_id int  `json:"Patient_id"`

}