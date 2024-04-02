FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean compile assembly:single
# docker run -p 8081:8081 --env EXTERNAL_SERVER_URL=[enter url here] [image]