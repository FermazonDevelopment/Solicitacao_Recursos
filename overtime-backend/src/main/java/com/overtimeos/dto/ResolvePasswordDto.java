package com.overtimeos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResolvePasswordDto(
        @NotBlank(message = "Nova senha é obrigatória")
        @Size(min = 4, message = "Senha deve ter ao menos 4 caracteres")
        String newPassword
) {}
