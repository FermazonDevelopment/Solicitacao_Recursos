package com.overtimeos.controller;

import com.overtimeos.dto.SolidesWebhookPayload;
import com.overtimeos.service.SolidesIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class SolidesWebhookController {

    private final SolidesIntegrationService integrationService;

    @Value("${solides.webhook.secret}")
    private String webhookSecret;

    /**
     * Endpoint chamado automaticamente pelo Solides quando um colaborador é editado.
     *
     * Configurar no Solides:
     *   URL    : http://172.16.1.5:8080/api/webhook/solides
     *   Evento : edicao_colaborador
     *   Header : X-Solides-Secret = overtime-fermazon-2026
     */
    @PostMapping("/solides")
    public ResponseEntity<?> receiveWebhook(
            @RequestHeader(value = "X-Solides-Secret", required = false) String secret,
            @RequestBody SolidesWebhookPayload payload) {

        if (!webhookSecret.equals(secret)) {
            log.warn("Solides webhook: secret inválido.");
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String acao = payload.getAcao();
        String nome = payload.getDados() != null ? payload.getDados().getNome() : "?";

        switch (acao != null ? acao : "") {
            case "edicao_colaborador" -> {
                log.info("Solides webhook: edicao_colaborador para '{}'", nome);
                boolean updated = integrationService.syncFromWebhook(payload);
                return ResponseEntity.ok(Map.of("received", true, "updated", updated));
            }
            case "novo_colaborador" -> {
                log.info("Solides webhook: novo_colaborador '{}'", nome);
                boolean created = integrationService.registerFromWebhook(payload);
                return ResponseEntity.ok(Map.of("received", true, "created", created));
            }
            case "demissao_colaborador" -> {
                log.info("Solides webhook: demissao_colaborador '{}'", nome);
                boolean deactivated = integrationService.deactivateFromWebhook(payload);
                return ResponseEntity.ok(Map.of("received", true, "deactivated", deactivated));
            }
            default -> {
                log.info("Solides webhook: evento '{}' ignorado.", acao);
                return ResponseEntity.ok(Map.of("received", true, "updated", false));
            }
        }
    }

    /**
     * Sincronização manual completa com o Solides (apenas admin).
     * POST http://172.16.1.5:8080/api/webhook/solides/sync
     */
    @PostMapping("/solides/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> manualSync() {
        int updated = integrationService.syncAll();
        return ResponseEntity.ok(Map.of("message", "Sincronização concluída", "updated", updated));
    }

    @PostMapping("/solides/sync-departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> syncDepartments() {
        return ResponseEntity.ok(integrationService.syncDepartments());
    }

}
