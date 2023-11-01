package Models

import "gorm.io/gorm"

type Doctor struct {
	gorm.Model

	ID       uint   	`json:"id" gorm:"primarykey"`
	Name     string 	`json:"name" gorm:"column:name"`
	Mail     string 	`json:"mail" gorm:"column:mail"`
	Password string 	`json:"password" gorm:"column:password"`
	Slots 	 []Slot 	`gorm:"foreignKey:doctor_id"`
}
