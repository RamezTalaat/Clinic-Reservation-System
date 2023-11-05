package Models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model

	ID  	 json.Number `json:"id" gorm:"primaryKey"`
	Name     string 	 `json:"name" gorm:"column:name"`
	Mail     string 	 `json:"mail" gorm:"column:mail"`
	Password string 	 `json:"password" gorm:"column:password"`
}