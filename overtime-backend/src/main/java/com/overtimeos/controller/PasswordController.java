package com.overtimeos.controller;

import com.overtimeos.dto.ChangeOwnPasswordDto;
import com.overtimeos.dto.ResolvePasswordDto;
import com.overtimeos.service.PasswordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/passwords")
@RequiredArgsConstructor
public class PasswordController {

    private final PasswordService svc;

    /** Qualquer departamento autenticado troca a própria senha. */
    @PutMapping("/me")
    public ResponseEntity<?> changeOwn(
            @Valid @RequestBody ChangeOwnPasswordDto body,
            Authentication auth) {
        svc.changeOwnPassword(auth.getName(), body.currentPassword(), body.newPassword());
        return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));
    }

    /** TI ou Admin lista todos os departamentos. */
    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments(Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.getAllDepartmentNames());
    }

    /** TI ou Admin redefine a senha de qualquer departamento. */
    @PutMapping("/departments/{name}")
    public ResponseEntity<?> changeDeptPassword(
            @PathVariable String name,
            @Valid @RequestBody ResolvePasswordDto body,
            Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        svc.changeDepartmentPassword(name, body.newPassword());
        return ResponseEntity.ok(Map.of("message", "Senha de " + name + " alterada com sucesso"));
    }

    private boolean canManage(Authentication auth) {
        return "TI".equalsIgnoreCase(auth.getName());
    }
}
