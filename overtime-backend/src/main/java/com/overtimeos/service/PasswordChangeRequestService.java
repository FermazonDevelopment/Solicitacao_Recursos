package com.overtimeos.service;

import com.overtimeos.dto.PasswordRequestDto;
import com.overtimeos.entity.Department;
import com.overtimeos.entity.PasswordChangeRequest;
import com.overtimeos.repository.DepartmentRepository;
import com.overtimeos.repository.PasswordChangeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PasswordChangeRequestService {

    private final PasswordChangeRequestRepository repo;
    private final DepartmentRepository deptRepo;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public PasswordRequestDto create(String departmentName) {
        if (repo.existsByDepartmentNameIgnoreCaseAndStatus(departmentName, PasswordChangeRequest.Status.PENDING)) {
            throw new IllegalArgumentException("Já existe uma solicitação pendente para este departamento");
        }
        PasswordChangeRequest req = new PasswordChangeRequest();
        req.setDepartmentName(departmentName);
        return toDto(repo.save(req));
    }

    public List<PasswordRequestDto> getPending() {
        return repo.findByStatusOrderByRequestedAtAsc(PasswordChangeRequest.Status.PENDING)
                .stream().map(this::toDto).toList();
    }

    public PasswordRequestDto getMyPending(String departmentName) {
        return repo.findFirstByDepartmentNameIgnoreCaseAndStatusOrderByRequestedAtDesc(
                        departmentName, PasswordChangeRequest.Status.PENDING)
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public PasswordRequestDto resolve(Long id, String newPassword) {
        PasswordChangeRequest req = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        Department dept = deptRepo.findByNameIgnoreCase(req.getDepartmentName())
                .orElseThrow(() -> new IllegalArgumentException("Departamento não encontrado"));

        dept.setPassword(passwordEncoder.encode(newPassword));
        deptRepo.save(dept);

        req.setStatus(PasswordChangeRequest.Status.RESOLVED);
        return toDto(repo.save(req));
    }

    @Transactional
    public void reject(Long id) {
        PasswordChangeRequest req = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
        req.setStatus(PasswordChangeRequest.Status.REJECTED);
        repo.save(req);
    }

    private PasswordRequestDto toDto(PasswordChangeRequest req) {
        return new PasswordRequestDto(
                req.getId(),
                req.getDepartmentName(),
                req.getStatus().name(),
                req.getRequestedAt()
        );
    }
}
