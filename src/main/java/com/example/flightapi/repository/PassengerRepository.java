package com.example.flightapi.repository;

import com.example.flightapi.entity.Booking;
import com.example.flightapi.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {

  List<Passenger> findByBooking(Booking booking);

  List<Passenger> findByBookingBookingId(Long bookingId);

  List<Passenger> findByEmail(String email);
}
