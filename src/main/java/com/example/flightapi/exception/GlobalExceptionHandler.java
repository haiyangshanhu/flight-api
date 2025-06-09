package com.example.flightapi.exception;

import com.example.flightapi.common.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  /**
   * Handle custom API exceptions
   */
  @ExceptionHandler(ApiException.class)
  public ApiResponse<Object> handleApiException(ApiException e) {
    logger.error("API Exception: {}", e.getMessage(), e);
    return ApiResponse.error(e.getStatusCode(), e.getMessage());
  }

  /**
   * Handle validation exceptions from @Valid annotations
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return ApiResponse.error(400, "Validation failed", errors);
  }

  /**
   * Handle binding exceptions
   */
  @ExceptionHandler(BindException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Map<String, String>> handleBindException(BindException e) {
    Map<String, String> errors = new HashMap<>();
    e.getBindingResult().getFieldErrors().forEach((error) -> {
      String fieldName = error.getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return ApiResponse.error(400, "Bind exception", errors);
  }

  /**
   * Handle type mismatch exceptions (wrong parameter types)
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
    String message = String.format("Parameter '%s' should be of type '%s'",
      e.getName(), e.getRequiredType().getSimpleName());
    return ApiResponse.badRequest(message);
  }

  /**
   * Handle JSON parsing errors
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
    return ApiResponse.badRequest("Malformed JSON request");
  }

  /**
   * Handle missing required parameters
   */
  @ExceptionHandler(MissingServletRequestParameterException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiResponse<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException e) {
    return ApiResponse.badRequest("Missing parameter: " + e.getParameterName());
  }

  /**
   * Handle unsupported HTTP methods
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
  public ApiResponse<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException e) {
    return ApiResponse.error(405, "Method not allowed: " + e.getMessage());
  }

  /**
   * Handle resource not found
   */
  @ExceptionHandler(NoHandlerFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiResponse<Object> handleNoHandlerFoundException(NoHandlerFoundException e) {
    return ApiResponse.notFound("Resource not found: " + e.getRequestURL());
  }

  /**
   * Handle all other unexpected exceptions
   */
  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ApiResponse<Object> handleAllUncaughtException(Exception e) {
    logger.error("Unhandled exception occurred", e);
    return ApiResponse.serverError("An unexpected error occurred");
  }
}
