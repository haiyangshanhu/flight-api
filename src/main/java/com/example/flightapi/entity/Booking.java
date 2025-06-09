package com.example.flightapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "BOOKING")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "booking_id")
  private Long bookingId;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne
  @JoinColumn(name = "flight_id", nullable = false)
  private Flight flight;

  @Column(name = "reference", nullable = false, length = 20)
  private String reference;

  @Column(name = "status", nullable = false, length = 20)
  private String status;

  @Column(name = "booking_time", nullable = false)
  private LocalDateTime bookingTime;

  @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
  private BigDecimal totalPrice;

  @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Passenger> passengers;
}
