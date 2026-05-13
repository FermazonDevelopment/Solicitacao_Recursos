package com.overtimeos.controller;

import com.overtimeos.dto.PasswordRequestDto;
import com.overtimeos.dto.ResolvePasswordDto;
import com.overtimeos.service.PasswordChangeRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/password-requests")
@RequiredArgsConstructor
public class PasswordChangeRequestController {

    private final PasswordChangeRequestService svc;

    /** Qualquer departamento autenticado pode solicitar troca para si mesmo */
    @PostMapping
    public ResponseEntity<PasswordRequestDto> create(Authentication auth) {
        return ResponseEntity.ok(svc.create(auth.getName()));
    }

    /** Consultar solicitação pendente do próprio departamento */
    @GetMapping("/mine")
    public ResponseEntity<PasswordRequestDto> getMine(Authentication auth) {
        PasswordRequestDto dto = svc.getMyPending(auth.getName());
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
    }

    /** Listar todas pendentes — apenas TI ou Admin */
    @GetMapping("/pending")
    public ResponseEntity<List<PasswordRequestDto>> getPending(Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.getPending());
    }

    /** Aprovar e definir nova senha — apenas TI ou Admin */
    @PutMapping("/{id}/resolve")
    public ResponseEntity<PasswordRequestDto> resolve(
            @PathVariable Long id,
            @Valid @RequestBody ResolvePasswordDto body,
            Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.resolve(id, body.newPassword()));
    }

    /** Rejeitar solicitação — apenas TI ou Admin */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> reject(@PathVariable Long id, Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        svc.reject(id);
        return ResponseEntity.noContent().build();
    }

    private boolean canManage(Authentication auth) {
        return "TI".equalsIgnoreCase(auth.getName());
    }
}
