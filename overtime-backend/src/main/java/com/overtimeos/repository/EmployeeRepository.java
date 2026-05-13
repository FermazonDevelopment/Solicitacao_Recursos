package com.overtimeos.repository;

import com.overtimeos.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.department.name = :deptName AND e.active = true ORDER BY e.name")
    List<Employee> findByDepartmentName(@Param("deptName") String deptName);

    @Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.active = true ORDER BY e.department.name, e.name")
    List<Employee> findAllWithDepartment();

    @Query("SELECT e FROM Employee e JOIN FETCH e.department ORDER BY e.department.name, e.name")
    List<Employee> findAllWithDepartmentIncludingInactive();
}
