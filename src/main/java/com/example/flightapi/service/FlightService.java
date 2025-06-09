package com.example.flightapi.service;

import com.example.flightapi.dto.FlightDTO;
import com.example.flightapi.dto.FlightDetailDTO;
import com.example.flightapi.dto.PageResponse;
import com.example.flightapi.entity.Airport;
import com.example.flightapi.entity.Flight;
import com.example.flightapi.exception.ApiException;
import com.example.flightapi.repository.AirportRepository;
import com.example.flightapi.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

  private final FlightRepository flightRepository;
  private final AirportRepository airportRepository;

  @Autowired
  public FlightService(FlightRepository flightRepository, AirportRepository airportRepository) {
    this.flightRepository = flightRepository;
    this.airportRepository = airportRepository;
  }

  /**
   * Search for flights based on departure, destination, and date
   */
  public PageResponse<FlightDTO> searchFlights(String from, String to, LocalDate date, int page, int size) {
    // Find airports by code
    Airport departureAirport = airportRepository.findByCode(from)
      .orElseThrow(() -> new ApiException("Departure airport not found: " + from, HttpStatus.BAD_REQUEST));

    Airport destinationAirport = airportRepository.findByCode(to)
      .orElseThrow(() -> new ApiException("Destination airport not found: " + to, HttpStatus.BAD_REQUEST));

    // Create pageable request
    Pageable pageable = PageRequest.of(page, size);

    // Search flights with pagination
    Page<Flight> flightPage = flightRepository.findByDepartureAirportAndDestinationAirportAndDepartureDate(
      departureAirport, destinationAirport, date, pageable);

    // Convert to DTOs
    List<FlightDTO> flightDTOs = flightPage.getContent().stream()
      .map(this::convertToFlightDTO)
      .collect(Collectors.toList());

    // Create paginated response
    return new PageResponse<>(
      flightDTOs,
      flightPage.getNumber(),
      flightPage.getSize(),
      flightPage.getTotalElements(),
      flightPage.getTotalPages(),
      flightPage.isLast()
    );
  }

  /**
   * Get flight details by ID
   */
  public FlightDetailDTO getFlightById(Long id) {
    Flight flight = flightRepository.findById(id)
      .orElseThrow(() -> new ApiException("Flight not found with id: " + id, HttpStatus.NOT_FOUND));

    return convertToFlightDetailDTO(flight);
  }

  /**
   * Convert Flight entity to FlightDTO
   */
  private FlightDTO convertToFlightDTO(Flight flight) {
    return FlightDTO.builder()
      .id(flight.getFlightId())
      .flightNumber(flight.getFlightNumber())
      .departure(flight.getDepartureAirport().getCode())
      .destination(flight.getDestinationAirport().getCode())
      .date(flight.getDepartureDate())
      .time(flight.getDepartureTime())
      .price(flight.getPrice())
      .build();
  }

  /**
   * Convert Flight entity to FlightDetailDTO
   */
  private FlightDetailDTO convertToFlightDetailDTO(Flight flight) {
    return FlightDetailDTO.builder()
      .id(flight.getFlightId())
      .flightNumber(flight.getFlightNumber())
      .departureAirport(convertToAirportDTO(flight.getDepartureAirport()))
      .destinationAirport(convertToAirportDTO(flight.getDestinationAirport()))
      .departureDate(flight.getDepartureDate())
      .departureTime(flight.getDepartureTime())
      .price(flight.getPrice())
      .aircraft("Boeing 737") // This would come from additional flight data
      .airline("Sample Airlines") // This would come from additional flight data
      .duration(120) // This would be calculated based on flight distance
      .availableSeats(150) // This would come from a seat inventory system
      .build();
  }

  /**
   * Convert Airport entity to AirportDTO
   */
  private com.example.flightapi.dto.AirportDTO convertToAirportDTO(Airport airport) {
    return com.example.flightapi.dto.AirportDTO.builder()
      .code(airport.getCode())
      .name(airport.getName())
      .city(airport.getCity())
      .build();
  }
}
