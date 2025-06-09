package com.example.flightapi.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {

  private final HttpStatus status;

  public ApiException(String message, HttpStatus status) {
    super(message);
    this.status = status;
  }

  // Simple constructor with default status
  public ApiException(String message) {
    this(message, HttpStatus.BAD_REQUEST);
  }

  // Constructor with cause
  public ApiException(String message, HttpStatus status, Throwable cause) {
    super(message, cause);
    this.status = status;
  }

  // Getter for status code as int
  public int getStatusCode() {
    return status.value();
  }
}
