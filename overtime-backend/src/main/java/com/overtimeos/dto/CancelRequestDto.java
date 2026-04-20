package com.overtimeos.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class CancelRequestDto {

    @NotBlank(message = "Motivo do cancelamento é obrigatório")
    private String reason;
}
