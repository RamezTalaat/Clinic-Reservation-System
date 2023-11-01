package Models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Doctor struct {
	gorm.Model

	ID       json.Number  	`json:"id,omitempty" gorm:"primarykey"`
	Name     string 	`json:"name" gorm:"column:name"`
	Mail     string 	`json:"mail" gorm:"column:mail"`
	Password string 	`json:"password" gorm:"column:password"`
	Slots 	 []Slot 	`gorm:"foreignKey:doctor_id"`
}
