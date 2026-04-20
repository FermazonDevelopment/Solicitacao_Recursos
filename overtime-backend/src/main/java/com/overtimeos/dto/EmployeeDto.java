package com.overtimeos.dto;

import com.overtimeos.entity.Employee;
import lombok.Getter;

@Getter
public class EmployeeDto {
    private final Integer id;
    private final String name;
    private final String department;
    private final String address;
    private final String registration;

    public EmployeeDto(Employee e) {
        this.id           = e.getId();
        this.name         = e.getName();
        this.department   = e.getDepartment().getName();
        this.address      = e.getAddress();
        this.registration = e.getRegistration();
    }
}
