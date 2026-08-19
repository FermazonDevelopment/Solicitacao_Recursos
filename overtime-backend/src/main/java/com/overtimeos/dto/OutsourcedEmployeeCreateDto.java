package com.overtimeos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class OutsourcedEmployeeCreateDto {
    @NotBlank(message = "Empresa é obrigatória")
    private String companyName;

    @NotEmpty(message = "Informe ao menos um colaborador")
    private List<String> names;
}
