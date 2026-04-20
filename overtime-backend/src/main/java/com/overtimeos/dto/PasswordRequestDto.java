package com.overtimeos.dto;

import java.time.LocalDateTime;

public record PasswordRequestDto(
        Long id,
        String departmentName,
        String status,
        LocalDateTime requestedAt
) {}
