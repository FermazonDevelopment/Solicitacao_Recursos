package com.overtimeos.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SolidesWebhookPayload {

    @JsonProperty("acao")
    private String acao;

    @JsonProperty("dados")
    private Dados dados;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Dados {

        @JsonProperty("nome")
        private String nome;

        @JsonProperty("matricula")
        private String matricula;

        @JsonProperty("endereco")
        private Endereco endereco;

        @JsonProperty("departamento")
        private Departamento departamento;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Departamento {

        @JsonProperty("id")
        private Long id;

        @JsonProperty("nome")
        private String nome;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Endereco {

        @JsonProperty("logradouro")
        private String logradouro;

        @JsonProperty("numero")
        private String numero;

        @JsonProperty("complemento")
        private String complemento;

        @JsonProperty("bairro")
        private String bairro;

        @JsonProperty("cep")
        private String cep;

        public String buildAddress() {
            StringBuilder sb = new StringBuilder();
            append(sb, logradouro);
            append(sb, numero);
            append(sb, complemento);
            append(sb, bairro);
            return sb.toString().isBlank() ? null : sb.toString();
        }

        private void append(StringBuilder sb, String value) {
            if (value != null && !value.isBlank()) {
                if (sb.length() > 0) sb.append(", ");
                sb.append(value.trim());
            }
        }
    }
}
