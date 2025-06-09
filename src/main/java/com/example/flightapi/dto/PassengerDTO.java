package com.example.flightapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerDTO {
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
}
