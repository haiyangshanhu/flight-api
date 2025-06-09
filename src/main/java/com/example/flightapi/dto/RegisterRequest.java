package com.example.flightapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 注册请求DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
  private String email;
  private String password;
  private String firstName;
  private String lastName;
  private String country;
  private String phone;
}
