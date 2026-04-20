package com.overtimeos.service;

import com.overtimeos.dto.LoginRequest;
import com.overtimeos.dto.LoginResponse;
import com.overtimeos.entity.Department;
import com.overtimeos.repository.DepartmentRepository;
import com.overtimeos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        Department dept = departmentRepository.findByNameIgnoreCase(request.getDepartment())
                .orElseThrow(() -> new IllegalArgumentException("Departamento não encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), dept.getPassword())) {
            throw new IllegalArgumentException("Senha incorreta");
        }

        String token = jwtService.generateToken(dept.getName(), dept.isAdmin());
        return new LoginResponse(token, dept.getName(), dept.isAdmin());
    }
}
