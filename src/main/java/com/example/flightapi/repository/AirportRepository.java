package com.example.flightapi.repository;

import com.example.flightapi.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {

  Optional<Airport> findByCode(String code);

  List<Airport> findByCity(String city);

  List<Airport> findByNameContainingIgnoreCase(String name);

  List<Airport> findByCityContainingIgnoreCase(String city);
}
