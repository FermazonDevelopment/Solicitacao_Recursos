package com.overtimeos.service;

import com.overtimeos.dto.DepartmentManagementDto;
import com.overtimeos.dto.EmployeeManagementDto;
import com.overtimeos.entity.Department;
import com.overtimeos.entity.Employee;
import com.overtimeos.repository.DepartmentRepository;
import com.overtimeos.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagementService {

    private final DepartmentRepository deptRepo;
    private final EmployeeRepository empRepo;

    public List<DepartmentManagementDto> listDepartments() {
        return deptRepo.findAllWithEmployees().stream()
                .map(DepartmentManagementDto::new)
                .toList();
    }

    public DepartmentManagementDto toggleAdmin(Integer id) {
        Department dept = deptRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Departamento não encontrado"));
        if ("TI".equalsIgnoreCase(dept.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível alterar as permissões do departamento TI");
        }
        dept.setAdmin(!dept.isAdmin());
        return new DepartmentManagementDto(deptRepo.save(dept));
    }

    public void deleteDepartment(Integer id) {
        Department dept = deptRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Departamento não encontrado"));
        if ("TI".equalsIgnoreCase(dept.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível excluir o departamento TI");
        }
        List<Employee> emps = empRepo.findByDepartmentName(dept.getName());
        if (!emps.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Remova ou transfira todos os funcionários antes de excluir o departamento");
        }
        deptRepo.delete(dept);
    }

    public List<EmployeeManagementDto> listEmployees() {
        return empRepo.findAllWithDepartmentIncludingInactive().stream()
                .map(EmployeeManagementDto::new)
                .toList();
    }

    public EmployeeManagementDto toggleActive(Integer id) {
        Employee emp = empRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        emp.setActive(!emp.isActive());
        return new EmployeeManagementDto(empRepo.save(emp));
    }

    public void deleteEmployee(Integer id) {
        empRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado"));
        try {
            empRepo.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir um funcionário com solicitações vinculadas. Desative-o em vez disso.");
        }
    }
}
