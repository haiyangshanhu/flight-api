package com.example.flightapi.security;

import com.example.flightapi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenUtil {

  @Autowired
  private JwtUtil jwtUtil;

  public boolean validateToken(String token) {
    String username = jwtUtil.extractUsername(token);
    return username != null && jwtUtil.validateToken(token, username);
  }

  public Authentication getAuthentication(String token) {
    String username = jwtUtil.extractUsername(token);
    return new UsernamePasswordAuthenticationToken(username, null, null);
  }
}
