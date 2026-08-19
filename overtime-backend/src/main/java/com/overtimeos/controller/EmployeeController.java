package com.overtimeos.controller;

import com.overtimeos.dto.EmployeeDto;
import com.overtimeos.dto.OutsourcedEmployeeCreateDto;
import com.overtimeos.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getEmployees(Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        String dept = auth.getName();
        return ResponseEntity.ok(employeeService.getEmployees(dept, isAdmin));
    }

    @PostMapping("/outsourced")
    public ResponseEntity<List<EmployeeDto>> createOutsourced(
            @Valid @RequestBody OutsourcedEmployeeCreateDto dto, Authentication auth) {
        String dept = auth.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createOutsourced(dto, dept));
    }
}
