package com.example.flightapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
  private String reference;
  private String route; // e.g., "LHR → JFK"
  private LocalDate date;
  private String status;
}
