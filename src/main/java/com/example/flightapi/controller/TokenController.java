package com.example.flightapi.controller;

import com.example.flightapi.common.ApiResponse;
import com.example.flightapi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/token")
public class TokenController {

  private final JwtUtil jwtUtil;

  @Autowired
  public TokenController(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  /**
   * Validate a JWT token
   */
  @PostMapping("/validate")
  public ApiResponse<String> validateToken(@RequestBody TokenRequest tokenRequest) {
    try {
      String token = tokenRequest.getToken();
      String username = jwtUtil.extractUsername(token);
      if (jwtUtil.validateToken(token, username)) {
        return ApiResponse.success("Token is valid");
      } else {
        return ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Invalid or expired token");
      }
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Error validating token: " + e.getMessage());
    }
  }

  // Inner class to represent the token request
  public static class TokenRequest {
    private String token;

    // Getters and setters
    public String getToken() {
      return token;
    }

    public void setToken(String token) {
      this.token = token;
    }
  }
}
