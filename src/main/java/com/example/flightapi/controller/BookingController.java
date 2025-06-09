package com.example.flightapi.controller;

import com.example.flightapi.common.ApiResponse;
import com.example.flightapi.dto.BookingDTO;
import com.example.flightapi.dto.BookingDetailDTO;
import com.example.flightapi.dto.BookingRequest;
import com.example.flightapi.dto.PageResponse;
import com.example.flightapi.exception.ApiException;
import com.example.flightapi.service.BookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "BearerAuth")
@RequestMapping("/api/bookings")
public class BookingController {

  private final BookingService bookingService;

  @Autowired
  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  /**
   * Get all bookings for the authenticated user
   */
  @GetMapping
  public ApiResponse<PageResponse<BookingDTO>> getUserBookings(
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {

    try {
      PageResponse<BookingDTO> bookings = bookingService.getUserBookings(status, page, size);
      return ApiResponse.success(bookings);
    } catch (ApiException e) {
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error retrieving bookings: " + e.getMessage());
    }
  }

  /**
   * Get booking details by ID
   */
  @GetMapping("/{id}")
  public ApiResponse<BookingDetailDTO> getBookingById(@PathVariable Long id) {
    try {
      BookingDetailDTO booking = bookingService.getBookingById(id);
      return ApiResponse.success(booking);
    } catch (ApiException e) {
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error retrieving booking: " + e.getMessage());
    }
  }

  /**
   * Create a new booking
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ApiResponse<BookingService.BookingCreateResponse> createBooking(@Valid @RequestBody BookingRequest request) {
    try {
      BookingService.BookingCreateResponse response = bookingService.createBooking(request);
      return ApiResponse.success(response);
    } catch (ApiException e) {
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error creating booking: " + e.getMessage());
    }
  }
}
