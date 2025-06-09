package com.example.flightapi.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // 这会自动生成getter和setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // 不序列化null值
public class ApiResponse<T> {

  private boolean success;
  private int code;
  private String message;
  private T data;

  // 成功响应静态方法
  public static <T> ApiResponse<T> success() {
    return success(null);
  }

  public static <T> ApiResponse<T> success(T data) {
    return ApiResponse.<T>builder()
      .success(true)
      .code(200)
      .message("OK")
      .data(data)
      .build();
  }

  public static <T> ApiResponse<T> success(String message, T data) {
    return ApiResponse.<T>builder()
      .success(true)
      .code(200)
      .message(message)
      .data(data)
      .build();
  }

  // 错误响应静态方法
  public static <T> ApiResponse<T> error(int code, String message) {
    return ApiResponse.<T>builder()
      .success(false)
      .code(code)
      .message(message)
      .data(null)
      .build();
  }

  // 带数据的错误响应方法 - 添加这个方法
  public static <T> ApiResponse<T> error(int code, String message, T data) {
    return ApiResponse.<T>builder()
      .success(false)
      .code(code)
      .message(message)
      .data(data)
      .build();
  }

  // 设置数据的方法
  public ApiResponse<T> setData(T data) {
    this.data = data;
    return this;
  }

  // 获取链式设置数据的方法 (返回this以支持链式调用)
  public ApiResponse<T> data(T data) {
    this.data = data;
    return this;
  }

  // 常用错误响应
  public static <T> ApiResponse<T> badRequest(String message) {
    return error(400, message != null ? message : "Invalid request");
  }


  public static <T> ApiResponse<T> badRequest(String message, T data) {
    return error(400, message != null ? message : "Invalid request", data);
  }

  public static <T> ApiResponse<T> unauthorized(String message) {
    return error(401, message != null ? message : "Unauthorized");
  }

  public static <T> ApiResponse<T> forbidden(String message) {
    return error(403, message != null ? message : "Forbidden");
  }

  public static <T> ApiResponse<T> notFound(String message) {
    return error(404, message != null ? message : "Resource not found");
  }

  public static <T> ApiResponse<T> serverError(String message) {
    return error(500, message != null ? message : "Internal server error");
  }
}
