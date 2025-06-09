package com.example.flightapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "USER")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long userId;

  @Column(name = "email", length = 100, nullable = false, unique = true)
  private String email;

  @Column(name = "password", length = 255, nullable = false)
  private String password;

  @Column(name = "first_name", length = 50)
  private String firstName;

  @Column(name = "last_name", length = 50)
  private String lastName;

  @Column(name = "country", length = 100)
  private String country;

  @Column(name = "phone", length = 20)
  private String phone;
}
