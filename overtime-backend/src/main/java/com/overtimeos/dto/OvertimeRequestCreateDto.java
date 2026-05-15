package com.overtimeos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter @Setter
public class OvertimeRequestCreateDto {

    @NotNull(message = "Data é obrigatória")
    private LocalDate date;

    @NotBlank(message = "Permanência é obrigatória")
    private String permanencia;

    @NotEmpty(message = "Selecione ao menos um colaborador")
    @Valid
    private List<CollabEntryDto> collaborators;

    @Getter @Setter
    public static class CollabEntryDto {
        @NotNull
        private Integer employeeId;

        @NotBlank(message = "Motivo é obrigatório")
        private String motivo;

        private boolean veiculoProprio;

        @NotNull
        private List<String> resources;
    }
}
