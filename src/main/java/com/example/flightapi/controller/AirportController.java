package com.example.flightapi.controller;

import com.example.flightapi.common.ApiResponse;
import com.example.flightapi.dto.AirportDTO;
import com.example.flightapi.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

  private final AirportService airportService;

  @Autowired
  public AirportController(AirportService airportService) {
    this.airportService = airportService;
  }

  /**
   * Get all airports
   */
  @GetMapping
  public ApiResponse<List<AirportDTO>> getAllAirports() {
    try {
      List<AirportDTO> airports = airportService.getAllAirports();
      return ApiResponse.success(airports);
    } catch (Exception e) {
      return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error retrieving airports: " + e.getMessage());
    }
  }
}
