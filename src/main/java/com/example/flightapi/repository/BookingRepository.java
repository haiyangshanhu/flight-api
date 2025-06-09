package com.example.flightapi.repository;

import com.example.flightapi.entity.Booking;
import com.example.flightapi.entity.Flight;
import com.example.flightapi.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

  // Added pagination support
  Page<Booking> findByUser(User user, Pageable pageable);

  Page<Booking> findByUserAndStatus(User user, String status, Pageable pageable);

  List<Booking> findByUserUserId(Long userId);

  List<Booking> findByFlight(Flight flight);

  List<Booking> findByFlightFlightId(Long flightId);

  Optional<Booking> findByReference(String reference);

  List<Booking> findByStatus(String status);

  List<Booking> findByBookingTimeBetween(LocalDateTime start, LocalDateTime end);
}
