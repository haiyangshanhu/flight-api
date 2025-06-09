package com.example.flightapi.repository;

import com.example.flightapi.entity.Airport;
import com.example.flightapi.entity.Flight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

  Optional<Flight> findByFlightNumber(String flightNumber);

  List<Flight> findByDepartureAirport(Airport departureAirport);

  List<Flight> findByDestinationAirport(Airport destinationAirport);

  List<Flight> findByDepartureDate(LocalDate departureDate);

  // Added pagination support
  Page<Flight> findByDepartureAirportAndDestinationAirportAndDepartureDate(
    Airport departureAirport, Airport destinationAirport, LocalDate departureDate, Pageable pageable);

  List<Flight> findByDepartureDateBetween(LocalDate startDate, LocalDate endDate);

  @Query("SELECT f FROM Flight f WHERE f.departureAirport.code = :departureCode AND f.destinationAirport.code = :destinationCode AND f.departureDate = :departureDate")
  List<Flight> findFlights(@Param("departureCode") String departureCode,
                           @Param("destinationCode") String destinationCode,
                           @Param("departureDate") LocalDate departureDate);

  @Query("SELECT f FROM Flight f JOIN f.departureAirport da JOIN f.destinationAirport aa WHERE da.city = :departureCity AND aa.city = :destinationCity AND f.departureDate = :departureDate")
  Page<Flight> findFlightsByCities(@Param("departureCity") String departureCity,
                                   @Param("destinationCity") String destinationCity,
                                   @Param("departureDate") LocalDate departureDate,
                                   Pageable pageable);
  boolean existsByFlightNumber(String flightNumber);
}
