package com.overtimeos.service;

import com.overtimeos.entity.Department;
import com.overtimeos.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final DepartmentRepository deptRepo;
    private final PasswordEncoder passwordEncoder;

    /** Qualquer departamento troca a própria senha (valida senha atual). */
    @Transactional
    public void changeOwnPassword(String deptName, String currentPassword, String newPassword) {
        Department dept = findDept(deptName);
        if (!passwordEncoder.matches(currentPassword, dept.getPassword())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }
        dept.setPassword(passwordEncoder.encode(newPassword));
        deptRepo.save(dept);
    }

    /** TI ou Admin troca a senha de qualquer departamento sem validar a atual. */
    @Transactional
    public void changeDepartmentPassword(String deptName, String newPassword) {
        Department dept = findDept(deptName);
        dept.setPassword(passwordEncoder.encode(newPassword));
        deptRepo.save(dept);
    }

    /** Lista os nomes de todos os departamentos (para o seletor do admin). */
    public List<String> getAllDepartmentNames() {
        return deptRepo.findAll().stream()
                .map(Department::getName)
                .sorted()
                .toList();
    }

    private Department findDept(String name) {
        return deptRepo.findByNameIgnoreCase(name)
                .orElseThrow(() -> new IllegalArgumentException("Departamento não encontrado: " + name));
    }
}
