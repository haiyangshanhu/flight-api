package com.example.flightapi.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConfig {

  @Value("${jwt.header:Authorization}")
  private String headerName;

  @Value("${jwt.prefix:Bearer }")
  private String tokenPrefix;

  public String getHeaderName() {
    return headerName;
  }

  public String getTokenPrefix() {
    return tokenPrefix;
  }
}
