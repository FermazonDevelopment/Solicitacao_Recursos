package com.overtimeos.service;

import com.overtimeos.dto.EmployeeDto;
import com.overtimeos.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<EmployeeDto> getEmployees(String department, boolean isAdmin) {
        if (isAdmin) {
            return employeeRepository.findAllWithDepartment()
                    .stream().map(EmployeeDto::new).toList();
        }
        return employeeRepository.findByDepartmentName(department)
                .stream().map(EmployeeDto::new).toList();
    }
}
