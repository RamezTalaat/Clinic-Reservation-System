FROM golang:latest

WORKDIR /app

COPY . .

RUN go get -u github.com/gofiber/fiber/v2
RUN go get -u gorm.io/gorm
RUN go get -u gorm.io/driver/postgres
RUN go build -o main .

ENV PORT 4000
ENV DB_HOST localhost
ENV DB_USER postgres
ENV DB_PASSWORD 2362
ENV DB_NAME clinicreservationsystem
ENV DB_PORT 5432

EXPOSE $PORT

CMD ["./main"] 