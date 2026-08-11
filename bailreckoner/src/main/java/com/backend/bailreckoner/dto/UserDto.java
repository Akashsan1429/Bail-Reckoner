package com.backend.bailreckoner.dto;

import com.backend.bailreckoner.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class UserDto {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private UUID organizationId;
    private String organizationName;
    private Instant createdAt;
}
