package com.example.flightapi.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    // Define the security scheme
    SecurityScheme securityScheme = new SecurityScheme()
      .name("Authorization")
      .type(SecurityScheme.Type.HTTP)
      .scheme("bearer")
      .bearerFormat("JWT");

    // Add the security scheme to components
    Components components = new Components()
      .addSecuritySchemes("BearerAuth", securityScheme);

    // Add security requirement
    SecurityRequirement securityRequirement = new SecurityRequirement()
      .addList("BearerAuth");

    return new OpenAPI()
      .components(components)
      .info(new Info().title("Flight API").version("1.0").description("API documentation for Flight API"))
      .addSecurityItem(securityRequirement);
  }
}
