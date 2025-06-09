package com.example.flightapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailDTO {
  private Long id;
  private String reference;
  private LocalDateTime bookingTime;
  private String status;
  private BigDecimal totalPrice;
  private FlightDTO flight;
  private List<PassengerDTO> passengers;
}
