package com.example.flightapi.config;

import com.example.flightapi.entity.*;
import com.example.flightapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Configuration
@Profile("!prod") // Only run in non-production environments
public class DataInitializer {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AirportRepository airportRepository;

  @Autowired
  private FlightRepository flightRepository;

  @Autowired
  private BookingRepository bookingRepository;

  @Autowired
  private PassengerRepository passengerRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  private final Random random = new Random();

  @Bean
  public CommandLineRunner initData() {
    return args -> {
      // Check if data already exists
      if (userRepository.count() > 0 || airportRepository.count() > 0 ||
          flightRepository.count() > 0 || bookingRepository.count() > 0) {
        System.out.println("Data already initialized, skipping...");
        return;
      }

      System.out.println("Starting data initialization...");

      // Create sample users
      createUsers();

      // Create sample airports
      List<Airport> airports = createAirports();

      // Create sample flights
      List<Flight> flights = createFlights(airports);

      // Create sample bookings
      createBookings(flights);

      System.out.println("Data initialization completed!");
    };
  }

  private void createUsers() {

    System.out.println("Creating sample users...");

    // Create test user
    User testUser = new User();
    testUser.setEmail("user@example.com");
    testUser.setPassword(passwordEncoder.encode("password"));
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setCountry("United States");
    testUser.setPhone("+1234567890");

    User adminUser = new User();
    adminUser.setEmail("admin@example.com");
    adminUser.setPassword(passwordEncoder.encode("admin123"));
    adminUser.setFirstName("Admin");
    adminUser.setLastName("User");
    adminUser.setCountry("United Kingdom");
    adminUser.setPhone("+4412345678");

    userRepository.saveAll(List.of(testUser, adminUser));
  }

  private List<Airport> createAirports() {

    System.out.println("Creating sample airports...");

    List<Airport> airports = new ArrayList<>();

    // Major airports worldwide
    airports.add(createAirport("JFK", "John F. Kennedy International Airport", "New York"));
    airports.add(createAirport("LAX", "Los Angeles International Airport", "Los Angeles"));
    airports.add(createAirport("ORD", "O'Hare International Airport", "Chicago"));
    airports.add(createAirport("LHR", "Heathrow Airport", "London"));
    airports.add(createAirport("CDG", "Charles de Gaulle Airport", "Paris"));
    airports.add(createAirport("FRA", "Frankfurt Airport", "Frankfurt"));
    airports.add(createAirport("AMS", "Amsterdam Airport Schiphol", "Amsterdam"));
    airports.add(createAirport("DXB", "Dubai International Airport", "Dubai"));
    airports.add(createAirport("HKG", "Hong Kong International Airport", "Hong Kong"));
    airports.add(createAirport("SYD", "Sydney Airport", "Sydney"));
    airports.add(createAirport("NRT", "Narita International Airport", "Tokyo"));
    airports.add(createAirport("PEK", "Beijing Capital International Airport", "Beijing"));
    airports.add(createAirport("SIN", "Singapore Changi Airport", "Singapore"));
    airports.add(createAirport("ICN", "Incheon International Airport", "Seoul"));
    airports.add(createAirport("BKK", "Suvarnabhumi Airport", "Bangkok"));

    return airportRepository.saveAll(airports);
  }

  private Airport createAirport(String code, String name, String city) {
    Airport airport = new Airport();
    airport.setCode(code);
    airport.setName(name);
    airport.setCity(city);
    return airport;
  }

  private List<Flight> createFlights(List<Airport> airports) {
    System.out.println("Creating sample flights...");

    List<Flight> flights = new ArrayList<>();
    Set<String> usedFlightNumbers = new HashSet<>(); // Track used flight numbers

    // Generate flights for the next 30 days
    LocalDate startDate = LocalDate.now();

    for (int day = 0; day < 30; day++) {
      LocalDate flightDate = startDate.plusDays(day);

      // Generate multiple flights per day between different airport pairs
      for (int i = 0; i < airports.size(); i++) {
        for (int j = 0; j < airports.size(); j++) {
          // Don't create flights between the same airport
          if (i == j) continue;

          // Don't create too many flights
          if (random.nextInt(100) > 15) continue;

          Airport origin = airports.get(i);
          Airport destination = airports.get(j);

          // Create morning flight
          createAndAddFlight(flights, usedFlightNumbers, origin, destination, flightDate,
            LocalTime.of(6 + random.nextInt(4), random.nextInt(60)));

          // Create afternoon flight
          createAndAddFlight(flights, usedFlightNumbers, origin, destination, flightDate,
            LocalTime.of(12 + random.nextInt(4), random.nextInt(60)));

          // Create evening flight
          createAndAddFlight(flights, usedFlightNumbers, origin, destination, flightDate,
            LocalTime.of(17 + random.nextInt(4), random.nextInt(60)));
        }
      }
    }

    return flightRepository.saveAll(flights);
  }

  // Helper method to create a flight with a unique flight number
  private void createAndAddFlight(List<Flight> flights, Set<String> usedFlightNumbers,
                                  Airport origin, Airport destination,
                                  LocalDate date, LocalTime time) {

    // Generate a unique flight number
    String flightNumber;
    do {
      // Use airline code + 3-digit number
      String airlineCode = getRandomAirlineCode();
      int flightDigits = 100 + random.nextInt(900);
      flightNumber = airlineCode + flightDigits;
    } while (usedFlightNumbers.contains(flightNumber) ||
      flightRepository.existsByFlightNumber(flightNumber));

    // Add to used numbers set
    usedFlightNumbers.add(flightNumber);

    // Create the flight
    Flight flight = new Flight();
    flight.setFlightNumber(flightNumber);
    flight.setDepartureAirport(origin);
    flight.setDestinationAirport(destination);
    flight.setDepartureDate(date);
    flight.setDepartureTime(time);

    // Generate a price between $100 and $1000
    int basePrice = 100 + random.nextInt(900);
    flight.setPrice(new BigDecimal(basePrice));

    flights.add(flight);
  }

  // Helper method to get a random airline code
  private String getRandomAirlineCode() {
    String[] airlineCodes = {"AA", "DL", "UA", "BA", "LH", "AF", "KL", "EK", "QF", "SQ", "CX", "JL"};
    return airlineCodes[random.nextInt(airlineCodes.length)];
  }

  private Flight createFlight(Airport origin, Airport destination, LocalDate date, LocalTime time, String flightNumber) {

    Flight flight = new Flight();
    flight.setFlightNumber(flightNumber);
    flight.setDepartureAirport(origin);
    flight.setDestinationAirport(destination);
    flight.setDepartureDate(date);
    flight.setDepartureTime(time);

    // Generate a price between $100 and $1000
    int basePrice = 100 + random.nextInt(900);
    flight.setPrice(new BigDecimal(basePrice));

    return flight;
  }

  private void createBookings(List<Flight> flights) {

    System.out.println("Creating sample bookings...");

    // Get a test user
    User user = userRepository.findByEmail("user@example.com").orElseThrow();

    // Create some bookings for the test user
    for (int i = 0; i < 10; i++) {
      if (i >= flights.size()) break;

      Flight flight = flights.get(i);

      // Create booking
      Booking booking = new Booking();
      booking.setUser(user);
      booking.setFlight(flight);
      booking.setReference(generateReference());
      booking.setStatus(getRandomStatus());
      booking.setBookingTime(LocalDateTime.now().minusDays(random.nextInt(30)));

      // Determine number of passengers (1-3)
      int numPassengers = 1 + random.nextInt(3);

      // Calculate total price
      booking.setTotalPrice(flight.getPrice().multiply(new BigDecimal(numPassengers)));

      // Save booking to get ID
      Booking savedBooking = bookingRepository.save(booking);

      // Create passengers
      List<Passenger> passengers = new ArrayList<>();
      for (int p = 0; p < numPassengers; p++) {
        Passenger passenger = new Passenger();
        passenger.setBooking(savedBooking);

        // First passenger is the user
        if (p == 0) {
          passenger.setFirstName(user.getFirstName());
          passenger.setLastName(user.getLastName());
          passenger.setEmail(user.getEmail());
        } else {
          // Additional passengers are random
          passenger.setFirstName(getRandomFirstName());
          passenger.setLastName(getRandomLastName());
          passenger.setEmail(passenger.getFirstName().toLowerCase() + "." +
            passenger.getLastName().toLowerCase() + "@example.com");
        }

        passengers.add(passenger);
      }

      passengerRepository.saveAll(passengers);
    }
  }

  private String generateReference() {
    // Generate 8-character alphanumeric reference
    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < 8; i++) {
      sb.append(chars.charAt(random.nextInt(chars.length())));
    }
    return sb.toString();
  }

  private String getRandomStatus() {
    String[] statuses = {"CONFIRMED", "CONFIRMED", "CONFIRMED", "COMPLETED", "CANCELLED"};
    return statuses[random.nextInt(statuses.length)];
  }

  private String getRandomFirstName() {
    String[] names = {"James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
      "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
      "Thomas", "Sarah", "Charles", "Karen"};
    return names[random.nextInt(names.length)];
  }

  private String getRandomLastName() {
    String[] names = {"Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
      "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
      "Thompson", "Garcia", "Martinez", "Robinson"};
    return names[random.nextInt(names.length)];
  }
}
