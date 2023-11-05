package Models

type Patient struct {
	ID       uint 	`json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"column:name"`
	Mail     string `json:"mail" gorm:"column:mail"`
	Password string `json:"password" gorm:"column:password"`
}