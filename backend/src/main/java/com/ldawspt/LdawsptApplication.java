package com.ldawspt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application class for LDAWSPT Learning Platform.
 * 
 * Future Scalability Roadmap:
 * 
 * TODO: Microservices Architecture Migration
 * - Why: To support thousands of concurrent students and allow separate development/deployment cycles.
 * - Files to Change/Create: 
 *   - Create a Spring Cloud Eureka Discovery Server (new maven project).
 *   - Create a Spring Cloud Gateway service (new maven project).
 *   - Split this monolith into independent microservices:
 *     1. ldawspt-auth-service (com.ldawspt.auth)
 *     2. ldawspt-course-service (com.ldawspt.course)
 *     3. ldawspt-progress-service (com.ldawspt.progress)
 *     4. ldawspt-certificate-service (com.ldawspt.certificate)
 * - Required Database Tables:
 *   - Each microservice will have its own database schema (Shared database schema is anti-pattern).
 *   - Syncing user details will be handled asynchronously using Apache Kafka / RabbitMQ.
 * - APIs Required:
 *   - Core APIs remain standard, but routing goes through Gateway: http://gateway:8080/api/v1/...
 * - Implementation Approach:
 *   - Configure spring-cloud-starter-netflix-eureka-client in each module.
 *   - Secure endpoints at the API Gateway using Spring Cloud Gateway Filter for JWT validation.
 *   - Run independent Docker containers orchestrated by Kubernetes.
 */
@SpringBootApplication
public class LdawsptApplication {

    public static void main(String[] args) {
        SpringApplication.run(LdawsptApplication.class, args);
    }
}
