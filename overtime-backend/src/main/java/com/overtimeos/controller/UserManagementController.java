package com.overtimeos.controller;

import com.overtimeos.dto.DepartmentManagementDto;
import com.overtimeos.dto.EmployeeManagementDto;
import com.overtimeos.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/management")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService svc;

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentManagementDto>> listDepartments(Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.listDepartments());
    }

    @PatchMapping("/departments/{id}/toggle-admin")
    public ResponseEntity<DepartmentManagementDto> toggleAdmin(@PathVariable Integer id, Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.toggleAdmin(id));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Integer id, Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        svc.deleteDepartment(id);
        return ResponseEntity.ok(Map.of("message", "Departamento excluído com sucesso"));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeManagementDto>> listEmployees(Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.listEmployees());
    }

    @PatchMapping("/employees/{id}/toggle-active")
    public ResponseEntity<EmployeeManagementDto> toggleActive(@PathVariable Integer id, Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(svc.toggleActive(id));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Integer id, Authentication auth) {
        if (!canManage(auth)) return ResponseEntity.status(403).build();
        svc.deleteEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Funcionário excluído com sucesso"));
    }

    private boolean canManage(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return isAdmin || "TI".equalsIgnoreCase(auth.getName());
    }
}
