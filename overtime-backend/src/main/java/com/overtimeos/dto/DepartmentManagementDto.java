package com.overtimeos.dto;

import com.overtimeos.entity.Department;

public record DepartmentManagementDto(
        Integer id,
        String name,
        boolean admin,
        int employeeCount
) {
    public DepartmentManagementDto(Department d) {
        this(d.getId(), d.getName(), d.isAdmin(),
                d.getEmployees() != null ? d.getEmployees().size() : 0);
    }
}
