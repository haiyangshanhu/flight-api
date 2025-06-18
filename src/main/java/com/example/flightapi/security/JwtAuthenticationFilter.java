package com.example.flightapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;
import java.io.IOException;

@Component("customJwtAuthenticationFilter")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtTokenUtil jwtTokenUtil;
  private final JwtConfig jwtConfig;

  @Autowired
  public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil, JwtConfig jwtConfig) {
    this.jwtTokenUtil = jwtTokenUtil;
    this.jwtConfig = jwtConfig;
  }

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                  @NonNull HttpServletResponse response, 
                                  @NonNull FilterChain filterChain)
    throws ServletException, IOException {

    String jwt = getJwtFromRequest(request);

    if (StringUtils.hasText(jwt) && jwtTokenUtil.validateToken(jwt)) {
      Authentication authentication = jwtTokenUtil.getAuthentication(jwt);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    filterChain.doFilter(request, response);
  }

  private String getJwtFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader(jwtConfig.getHeaderName());
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtConfig.getTokenPrefix())) {
      return bearerToken.substring(jwtConfig.getTokenPrefix().length());
    }
    return null;
  }
}
