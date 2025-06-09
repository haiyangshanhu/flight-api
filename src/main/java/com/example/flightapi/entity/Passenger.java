package com.example.flightapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PASSENGER")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "passenger_id")
  private Long passengerId;

  @ManyToOne
  @JoinColumn(name = "booking_id", nullable = false)
  private Booking booking;

  @Column(name = "first_name", nullable = false, length = 50)
  private String firstName;

  @Column(name = "last_name", nullable = false, length = 50)
  private String lastName;

  @Column(name = "email", nullable = false, length = 100)
  private String email;
}
