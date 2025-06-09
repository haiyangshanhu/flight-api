package com.example.flightapi.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
  private String token;
  private Long userId;
  private String email;
  private String firstName;
  private String lastName;
}
