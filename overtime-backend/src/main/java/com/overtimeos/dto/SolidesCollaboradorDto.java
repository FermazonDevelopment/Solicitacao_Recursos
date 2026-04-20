package com.overtimeos.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SolidesCollaboradorDto {

    private Long id;

    @JsonProperty("nome")
    private String name;

    @JsonProperty("matricula")
    private String registration;

    private Boolean active;

    @JsonProperty("departamento")
    private DepartamentoDto departamento;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DepartamentoDto {
        @JsonProperty("id")
        private Long id;
        @JsonProperty("nome")
        private String nome;
    }

    // Campos de endereço
    private String streetName;
    private String number;
    private String additionalInformation;
    private String neighborhood;
    private String city;
    private String stateAcronym;
    private String zipCode;

    /**
     * Monta o endereço em formato único para armazenar no banco.
     * Ex: "Rua IBIQUERA, 28, NOVO ALEIXO, Manaus, AM"
     */
    public String buildAddress() {
        StringBuilder sb = new StringBuilder();

        append(sb, streetName);
        append(sb, number);
        append(sb, additionalInformation);
        append(sb, neighborhood);
        append(sb, city);
        append(sb, stateAcronym);

        return sb.toString().isBlank() ? null : sb.toString();
    }

    private void append(StringBuilder sb, String value) {
        if (value != null && !value.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(value.trim());
        }
    }
}
