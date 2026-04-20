package com.overtimeos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class OvertimeRequestUpdateDto {

    @NotBlank(message = "Permanência é obrigatória")
    private String permanencia;

    @NotBlank(message = "Motivo é obrigatório")
    private String motivo;

    private boolean veiculoProprio;

    @NotEmpty
    private List<String> resources;
}
