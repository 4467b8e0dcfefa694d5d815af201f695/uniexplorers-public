FROM rust:1.76-slim-bookworm as builder

WORKDIR /usr/src/recommender

COPY . .

RUN apt-get update && apt-get install -y curl && apt-get install -y pkg-config libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y curl && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /usr/src/recommender/target/release/recommendation .

CMD ["./recommendation"]
