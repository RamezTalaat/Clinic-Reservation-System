FROM golang:latest

WORKDIR /go/src/app

COPY go.mod .
COPY go.sum .
COPY . .

RUN go get -d -v github.com/gofiber/fiber/v2@latest
RUN go get -d -v gorm.io/gorm@latest
RUN go get -d -v gorm.io/driver/postgres@latest
RUN go build -o main .

EXPOSE 4000

CMD ["./main"] 
