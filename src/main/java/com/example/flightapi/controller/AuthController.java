package com.example.flightapi.controller;

import com.example.flightapi.common.ApiResponse;
import com.example.flightapi.dto.AuthResponse;
import com.example.flightapi.dto.LoginRequest;
import com.example.flightapi.dto.RegisterRequest;
import com.example.flightapi.exception.ApiException;
import com.example.flightapi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  @Autowired
  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  /**
   * User registration endpoint
   *
   * @param request RegisterRequest DTO
   * @return Unified API response containing AuthResponse or error information
   */
  @PostMapping("/register")
  public ApiResponse<AuthResponse> register(@RequestBody RegisterRequest request) {
    try {
      AuthResponse response = authService.register(request);
      return ApiResponse.success(response);
    } catch (ApiException e) {
      // Use the status from ApiException
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      // Handle other unexpected exceptions
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Registration failed: " + e.getMessage());
    }
  }

  /**
   * User login endpoint
   *
   * @param request LoginRequest DTO
   * @return Unified API response containing AuthResponse or error information
   */
  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) {
    try {
      AuthResponse response = authService.login(request);
      return ApiResponse.success(response);
    } catch (ApiException e) {
      // Use the status from ApiException
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      // Handle other unexpected exceptions
      return ApiResponse.error(HttpStatus.UNAUTHORIZED.value(), "Login failed: Invalid credentials");
    }
  }
}
