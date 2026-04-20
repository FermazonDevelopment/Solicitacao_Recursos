package com.overtimeos.controller;

import com.overtimeos.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<String>> listNames() {
        List<String> names = departmentRepository.findAll()
                .stream()
                .map(d -> d.getName())
                .sorted()
                .toList();
        return ResponseEntity.ok(names);
    }
}
