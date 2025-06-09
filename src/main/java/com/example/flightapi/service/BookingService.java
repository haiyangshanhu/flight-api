package com.example.flightapi.service;

import com.example.flightapi.dto.*;
import com.example.flightapi.entity.Booking;
import com.example.flightapi.entity.Flight;
import com.example.flightapi.entity.Passenger;
import com.example.flightapi.entity.User;
import com.example.flightapi.exception.ApiException;
import com.example.flightapi.repository.BookingRepository;
import com.example.flightapi.repository.FlightRepository;
import com.example.flightapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

  private final BookingRepository bookingRepository;
  private final FlightRepository flightRepository;
  private final UserRepository userRepository;

  @Autowired
  public BookingService(BookingRepository bookingRepository,
                        FlightRepository flightRepository,
                        UserRepository userRepository) {
    this.bookingRepository = bookingRepository;
    this.flightRepository = flightRepository;
    this.userRepository = userRepository;
  }

  /**
   * Get all bookings for the authenticated user with pagination
   */
  public PageResponse<BookingDTO> getUserBookings(String status, int page, int size) {
    User user = getCurrentUser();

    Pageable pageable = PageRequest.of(page, size, Sort.by("bookingTime").descending());

    Page<Booking> bookingPage;
    if (status != null && !status.isEmpty()) {
      bookingPage = bookingRepository.findByUserAndStatus(user, status, pageable);
    } else {
      bookingPage = bookingRepository.findByUser(user, pageable);
    }

    List<BookingDTO> bookingDTOs = bookingPage.getContent().stream()
      .map(this::convertToBookingDTO)
      .collect(Collectors.toList());

    return new PageResponse<>(
      bookingDTOs,
      bookingPage.getNumber(),
      bookingPage.getSize(),
      bookingPage.getTotalElements(),
      bookingPage.getTotalPages(),
      bookingPage.isLast()
    );
  }

  /**
   * Get booking details by ID
   */
  public BookingDetailDTO getBookingById(Long id) {
    User user = getCurrentUser();

    Booking booking = bookingRepository.findById(id)
      .orElseThrow(() -> new ApiException("Booking not found with id: " + id, HttpStatus.NOT_FOUND));

    // Check if booking belongs to current user
    if (!booking.getUser().getUserId().equals(user.getUserId())) {
      throw new ApiException("You don't have permission to view this booking", HttpStatus.FORBIDDEN);
    }

    return convertToBookingDetailDTO(booking);
  }

  /**
   * Create a new booking
   */
  @Transactional
  public BookingCreateResponse createBooking(BookingRequest request) {
    User user = getCurrentUser();

    // Find flight
    Flight flight = flightRepository.findById(request.getFlightId())
      .orElseThrow(() -> new ApiException("Flight not found with id: " + request.getFlightId(), HttpStatus.BAD_REQUEST));

    // Generate reference number (8 characters)
    String reference = generateReference();

    // Calculate total price
    BigDecimal totalPrice = flight.getPrice().multiply(new BigDecimal(request.getPassengers().size()));

    // Create booking
    Booking booking = new Booking();
    booking.setUser(user);
    booking.setFlight(flight);
    booking.setReference(reference);
    booking.setStatus("Upcoming");
    booking.setBookingTime(LocalDateTime.now());
    booking.setTotalPrice(totalPrice);

    // Create passengers
    List<Passenger> passengers = new ArrayList<>();
    for (PassengerRequest passengerRequest : request.getPassengers()) {
      Passenger passenger = new Passenger();
      passenger.setBooking(booking);
      passenger.setFirstName(passengerRequest.getFirstName());
      passenger.setLastName(passengerRequest.getLastName());
      passenger.setEmail(passengerRequest.getEmail());
      passengers.add(passenger);
    }

    booking.setPassengers(passengers);

    // Save booking
    Booking savedBooking = bookingRepository.save(booking);

    // Return response
    return new BookingCreateResponse(reference, totalPrice);
  }

  /**
   * Generate a unique booking reference
   */
  private String generateReference() {
    return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
  }

  /**
   * Get the currently authenticated user
   */
  private User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    return userRepository.findByEmail(email)
      .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
  }

  /**
   * Convert Booking entity to BookingDTO
   */
  private BookingDTO convertToBookingDTO(Booking booking) {
    Flight flight = booking.getFlight();
    String route = flight.getDepartureAirport().getCode() + " → " + flight.getDestinationAirport().getCode();

    return BookingDTO.builder()
      .reference(booking.getReference())
      .route(route)
      .date(flight.getDepartureDate())
      .status(booking.getStatus())
      .build();
  }

  /**
   * Convert Booking entity to BookingDetailDTO
   */
  private BookingDetailDTO convertToBookingDetailDTO(Booking booking) {
    Flight flight = booking.getFlight();

    FlightDTO flightDTO = FlightDTO.builder()
      .id(flight.getFlightId())
      .flightNumber(flight.getFlightNumber())
      .departure(flight.getDepartureAirport().getCode())
      .destination(flight.getDestinationAirport().getCode())
      .date(flight.getDepartureDate())
      .time(flight.getDepartureTime())
      .price(flight.getPrice())
      .build();

    List<PassengerDTO> passengerDTOs = booking.getPassengers().stream()
      .map(p -> PassengerDTO.builder()
        .id(p.getPassengerId())
        .firstName(p.getFirstName())
        .lastName(p.getLastName())
        .email(p.getEmail())
        .build())
      .collect(Collectors.toList());

    return BookingDetailDTO.builder()
      .id(booking.getBookingId())
      .reference(booking.getReference())
      .bookingTime(booking.getBookingTime())
      .status(booking.getStatus())
      .totalPrice(booking.getTotalPrice())
      .flight(flightDTO)
      .passengers(passengerDTOs)
      .build();
  }

  /**
   * Response class for booking creation
   */
  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class BookingCreateResponse {
    private String bookingReference;
    private BigDecimal totalPrice;
  }
}
