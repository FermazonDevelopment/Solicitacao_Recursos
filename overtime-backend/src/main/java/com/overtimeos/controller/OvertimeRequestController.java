package com.overtimeos.controller;

import com.overtimeos.dto.CancelRequestDto;
import com.overtimeos.dto.OvertimeRequestCreateDto;
import com.overtimeos.dto.OvertimeRequestDto;
import com.overtimeos.dto.OvertimeRequestUpdateDto;
import com.overtimeos.service.OvertimeRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class OvertimeRequestController {

    private final OvertimeRequestService requestService;

    @GetMapping
    public ResponseEntity<List<OvertimeRequestDto>> getRequests(
            Authentication auth,
            @RequestParam(required = false) String dept,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        String callerDept = auth.getName();

        return ResponseEntity.ok(requestService.getRequests(callerDept, isAdmin, dept, date));
    }

    @PostMapping
    public ResponseEntity<List<OvertimeRequestDto>> createRequests(
            @Valid @RequestBody OvertimeRequestCreateDto dto,
            Authentication auth) {

        String registeredBy = auth.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(requestService.createRequests(dto, registeredBy));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OvertimeRequestDto> updateRequest(
            @PathVariable String id,
            @Valid @RequestBody OvertimeRequestUpdateDto dto,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(requestService.updateRequest(id, dto, auth.getName(), isAdmin));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<OvertimeRequestDto> confirmRequest(
            @PathVariable String id,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(requestService.confirmRequest(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OvertimeRequestDto> cancelConfirmedRequest(
            @PathVariable String id,
            @Valid @RequestBody CancelRequestDto dto,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(requestService.cancelConfirmedRequest(id, dto, auth.getName(), isAdmin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(
            @PathVariable String id,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        requestService.deleteRequest(id, auth.getName(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
