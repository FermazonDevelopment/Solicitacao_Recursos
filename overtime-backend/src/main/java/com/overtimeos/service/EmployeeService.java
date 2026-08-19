package com.overtimeos.service;

import com.overtimeos.dto.EmployeeDto;
import com.overtimeos.dto.OutsourcedEmployeeCreateDto;
import com.overtimeos.entity.Department;
import com.overtimeos.entity.Employee;
import com.overtimeos.repository.DepartmentRepository;
import com.overtimeos.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<EmployeeDto> getEmployees(String department, boolean isAdmin) {
        if (isAdmin) {
            return employeeRepository.findAllWithDepartment()
                    .stream().map(EmployeeDto::new).toList();
        }
        return employeeRepository.findByDepartmentName(department)
                .stream().map(EmployeeDto::new).toList();
    }

    @Transactional
    public List<EmployeeDto> createOutsourced(OutsourcedEmployeeCreateDto dto, String departmentName) {
        Department department = departmentRepository.findByNameIgnoreCase(departmentName)
                .orElseThrow(() -> new IllegalArgumentException("Departamento não encontrado"));

        List<String> names = dto.getNames().stream()
                .map(String::trim)
                .filter(n -> !n.isBlank())
                .toList();

        if (names.isEmpty()) {
            throw new IllegalArgumentException("Informe ao menos um colaborador");
        }

        String company = dto.getCompanyName().trim();

        return names.stream().map(name -> {
            Employee e = new Employee();
            e.setName(name);
            e.setCompanyName(company);
            e.setDepartment(department);
            e.setRegistration("TERC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            e.setActive(true);
            e.setOutsourced(true);
            return new EmployeeDto(employeeRepository.save(e));
        }).toList();
    }
}
