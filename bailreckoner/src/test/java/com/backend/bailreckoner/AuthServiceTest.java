package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.AuthResponse;
import com.backend.bailreckoner.dto.LoginRequest;
import com.backend.bailreckoner.dto.RegisterRequest;
import com.backend.bailreckoner.entity.User;
import com.backend.bailreckoner.enums.Role;
import com.backend.bailreckoner.repository.OrganizationRepository;
import com.backend.bailreckoner.repository.UserRepository;
import com.backend.bailreckoner.security.JwtTokenProvider;
import com.backend.bailreckoner.service.AuditService;
import com.backend.bailreckoner.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(UUID.randomUUID())
                .name("John Doe")
                .email("john@example.com")
                .password("encoded_pass")
                .role(Role.LAWYER)
                .build();
    }

    @Test
    @DisplayName("Register User - Success")
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setName("John Doe");
        req.setEmail("john@example.com");
        req.setPassword("password123");
        req.setRole(Role.LAWYER);

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateToken(any(), any(), any())).thenReturn("mock_jwt_token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("john@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Login User - Success")
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail("john@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encoded_pass")).thenReturn(true);
        when(tokenProvider.generateToken(any(), any(), any())).thenReturn("mock_jwt_token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        verify(auditService, times(1)).logAction(any(), any(), any(), any());
    }
}
