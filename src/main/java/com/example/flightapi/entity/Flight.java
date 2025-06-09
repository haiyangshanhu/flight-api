package com.example.flightapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "FLIGHT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "flight_id")
  private Long flightId;

  @Column(name = "flight_number", nullable = false, length = 10, unique = true)
  private String flightNumber;

  @ManyToOne
  @JoinColumn(name = "departure_airport_id", nullable = false)
  private Airport departureAirport;

  @ManyToOne
  @JoinColumn(name = "destination_airport_id", nullable = false)
  private Airport destinationAirport;

  @Column(name = "departure_date", nullable = false)
  private LocalDate departureDate;

  @Column(name = "departure_time", nullable = false)
  private LocalTime departureTime;

  @Column(name = "price", nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Booking> bookings;
}
