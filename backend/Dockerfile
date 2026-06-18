# Build stage
FROM maven:3.9.4-eclipse-temurin-22 AS builder
WORKDIR /workspace
COPY pom.xml ./
COPY src ./src
RUN mvn -e -B -DskipTests package

# Run stage
FROM eclipse-temurin:22-jre-jammy
WORKDIR /app
COPY --from=builder /workspace/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
