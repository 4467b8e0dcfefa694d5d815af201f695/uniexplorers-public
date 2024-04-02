# Go Server Setup

```go
protoc --go_out=. --go_opt=paths=source_relative \
--go-grpc_out=. --go-grpc_opt=paths=source_relative \
proto/*.proto

go mod tidy
go run server.go
go run ws_server.go
```

```go
// With grpc gateway
protoc --plugin=protoc-gen-grpc-gateway=$GO_PATH/bin/protoc-gen-grpc-gateway \
--go_out=. --go_opt=paths=source_relative \
--go-grpc_out=. --go-grpc_opt=paths=source_relative --grpc-gateway_out=proto/ \
proto/*.proto
```

> go.mod and go.sum needs to be in `services/` due to go mod issue
