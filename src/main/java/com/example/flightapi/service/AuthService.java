package com.example.flightapi.service;

import com.example.flightapi.dto.AuthResponse;
import com.example.flightapi.dto.LoginRequest;
import com.example.flightapi.dto.RegisterRequest;
import com.example.flightapi.entity.User;
import com.example.flightapi.exception.ApiException;
import com.example.flightapi.repository.UserRepository;
import com.example.flightapi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  @Autowired
  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  /**
   * User registration
   *
   * @param request Registration data
   * @return Authentication response with token and user info
   * @throws ApiException if email already exists
   */
  public AuthResponse register(RegisterRequest request) {
    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ApiException("Email already in use", HttpStatus.CONFLICT);
    }

    // Create new user
    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setCountry(request.getCountry());
    user.setPhone(request.getPhone());

    // Save user to database
    User savedUser = userRepository.save(user);

    // Generate JWT token
    String token = jwtUtil.generateToken(savedUser.getEmail());

    // Create and return authentication response
    return new AuthResponse(
      token,
      savedUser.getUserId(),
      savedUser.getEmail(),
      savedUser.getFirstName(),
      savedUser.getLastName()
    );
  }

  /**
   * User login
   *
   * @param request Login credentials
   * @return Authentication response with token and user info
   * @throws ApiException if credentials are invalid
   */
  public AuthResponse login(LoginRequest request) {
    // Find user by email
    User user = userRepository.findByEmail(request.getEmail())
      .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

    // Verify password
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    String token = jwtUtil.generateToken(user.getEmail());

    // Create and return authentication response
    return new AuthResponse(
      token,
      user.getUserId(),
      user.getEmail(),
      user.getFirstName(),
      user.getLastName()
    );
  }
}
