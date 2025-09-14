# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod file
COPY go.mod ./

# Download dependencies and create go.sum
RUN go mod download && go mod tidy

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 8081

# Command to run
CMD ["./main"]