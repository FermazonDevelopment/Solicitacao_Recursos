package com.overtimeos.dto;

import com.overtimeos.entity.Employee;

public record EmployeeManagementDto(
        Integer id,
        String name,
        String department,
        String registration,
        String address,
        boolean active,
        boolean outsourced,
        String companyName
) {
    public EmployeeManagementDto(Employee e) {
        this(e.getId(), e.getName(), e.getDepartment().getName(),
                e.getRegistration(), e.getAddress(), e.isActive(),
                e.isOutsourced(), e.getCompanyName());
    }
}
