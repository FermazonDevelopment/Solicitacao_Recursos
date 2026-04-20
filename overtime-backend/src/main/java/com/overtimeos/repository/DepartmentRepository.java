package com.overtimeos.repository;

import com.overtimeos.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByNameIgnoreCase(String name);
}
