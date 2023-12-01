FROM golang:latest
WORKDIR /app
COPY . .
RUN go build -o main .
EXPOSE 4000
CMD ["./main"] 
