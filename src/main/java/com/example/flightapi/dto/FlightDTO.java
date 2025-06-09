package com.example.flightapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightDTO {
  private Long id;
  private String flightNumber;
  private String departure; // Airport code
  private String destination; // Airport code
  private LocalDate date;
  private LocalTime time;
  private BigDecimal price;
}
