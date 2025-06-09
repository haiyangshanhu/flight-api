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
public class FlightDetailDTO {
  private Long id;
  private String flightNumber;
  // Basic flight information
  private AirportDTO departureAirport;
  private AirportDTO destinationAirport;
  private LocalDate departureDate;
  private LocalTime departureTime;
  private BigDecimal price;

  // Additional details
  private String aircraft;
  private String airline;
  private Integer duration; // in minutes
  private Integer availableSeats;
}
