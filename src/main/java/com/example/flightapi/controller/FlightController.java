package com.example.flightapi.controller;

import com.example.flightapi.common.ApiResponse;
import com.example.flightapi.dto.FlightDTO;
import com.example.flightapi.dto.FlightDetailDTO;
import com.example.flightapi.dto.PageResponse;
import com.example.flightapi.exception.ApiException;
import com.example.flightapi.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

  private final FlightService flightService;

  @Autowired
  public FlightController(FlightService flightService) {
    this.flightService = flightService;
  }

  /**
   * Search flights by departure, destination, and date
   */
  @GetMapping
  public ApiResponse<PageResponse<FlightDTO>> searchFlights(
    @RequestParam String from,
    @RequestParam String to,
    @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {

    try {
      PageResponse<FlightDTO> flights = flightService.searchFlights(from, to, date, page, size);
      return ApiResponse.success(flights);
    } catch (ApiException e) {
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error searching flights: " + e.getMessage());
    }
  }

  /**
   * Get flight details by ID
   */
  @GetMapping("/{id}")
  public ApiResponse<FlightDetailDTO> getFlightById(@PathVariable Long id) {
    try {
      FlightDetailDTO flight = flightService.getFlightById(id);
      return ApiResponse.success(flight);
    } catch (ApiException e) {
      return ApiResponse.error(e.getStatusCode(), e.getMessage());
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error retrieving flight: " + e.getMessage());
    }
  }
}
