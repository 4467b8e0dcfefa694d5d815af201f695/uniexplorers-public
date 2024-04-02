FROM golang:latest as builder

RUN apt-get update
RUN apt install -y protobuf-compiler
RUN apt install -y curl

# Install grpc
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest && \
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest

RUN GO111MODULE=on

ENV GO_PATH=$HOME/go
ENV PATH="$PATH:$GO_PATH/bin"

WORKDIR /app

# COPY go.mod go.sum ./
# RUN go mod download

COPY . .

RUN protoc --plugin=protoc-gen-grpc-gateway=$GO_PATH/bin/protoc-gen-grpc-gateway \
    --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative --grpc-gateway_out=proto/ \
    proto/*.proto

RUN rm -rf ~/.netrc

RUN go mod tidy
CMD ["go", "run", "main.go"]


# RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# FROM alpine:latest  

# WORKDIR /root/

# # Copy the binary from the first stage
# COPY --from=builder /app/main .

# CMD ["./main"]