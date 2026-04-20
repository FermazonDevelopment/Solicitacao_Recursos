package com.overtimeos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {

    @NotBlank(message = "Departamento é obrigatório")
    private String department;

    @NotBlank(message = "Senha é obrigatória")
    private String password;
}
