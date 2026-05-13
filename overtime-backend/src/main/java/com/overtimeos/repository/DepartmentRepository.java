package com.overtimeos.repository;

import com.overtimeos.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByNameIgnoreCase(String name);

    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees ORDER BY d.name")
    List<Department> findAllWithEmployees();
}
