package com.example.flightapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "AIRPORT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Airport {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "airport_id")
  private Long airportId;

  @Column(name = "code", nullable = false, length = 10, unique = true)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "city", nullable = false, length = 100)
  private String city;

  @OneToMany(mappedBy = "departureAirport", fetch = FetchType.LAZY)
  private List<Flight> departureFlights;

  @OneToMany(mappedBy = "destinationAirport", fetch = FetchType.LAZY)
  private List<Flight> arrivalFlights;
}
