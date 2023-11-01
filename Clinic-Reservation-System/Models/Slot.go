package Models

import "gorm.io/gorm"

type Slot struct {
	gorm.Model


	ID        uint   	`json:"id" gorm:"primarykey"`
	Date      string 	`json:"date" gorm:"column:date"`
	Hour      string 	`json:"hour" gorm:"column:hour"`
	Doctor_id uint   	`json:"doctor_id" gorm:"column:doctor_id"`
	
}
