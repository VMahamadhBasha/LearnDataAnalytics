package com.ldawspt.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class SecurityTest {

    private JwtTokenProvider jwtTokenProvider;
    private Authentication authentication;
    private UserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        // Set the JWT Secret (needs to be at least 256 bits for HMAC-SHA512)
        String secret = "test-secret-key-that-is-sufficiently-long-and-secure-for-hmac-sha-algorithms-jwt";
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationInMs", 3600000L); // 1 hour

        userPrincipal = new UserPrincipal(
                10L,
                "testuser",
                "test@example.com",
                "password",
                Collections.emptyList()
        );

        authentication = Mockito.mock(Authentication.class);
    }

    @Test
    void testTokenGenerationAndParsing() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);

        // Act
        String token = jwtTokenProvider.generateToken(authentication);

        // Assert
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));

        Long userId = jwtTokenProvider.getUserIdFromJWT(token);
        assertEquals(10L, userId);
    }

    @Test
    void testInvalidToken() {
        // Act & Assert
        assertFalse(jwtTokenProvider.validateToken("invalid-token-string"));
    }
}
