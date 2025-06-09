package com.example.flightapi.service;

import com.example.flightapi.dto.AirportDTO;
import com.example.flightapi.entity.Airport;
import com.example.flightapi.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirportService {

  private final AirportRepository airportRepository;

  @Autowired
  public AirportService(AirportRepository airportRepository) {
    this.airportRepository = airportRepository;
  }

  /**
   * Get all airports
   */
  public List<AirportDTO> getAllAirports() {
    return airportRepository.findAll().stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  /**
   * Convert Airport entity to AirportDTO
   */
  private AirportDTO convertToDTO(Airport airport) {
    return AirportDTO.builder()
      .code(airport.getCode())
      .name(airport.getName())
      .city(airport.getCity())
      .build();
  }
}
