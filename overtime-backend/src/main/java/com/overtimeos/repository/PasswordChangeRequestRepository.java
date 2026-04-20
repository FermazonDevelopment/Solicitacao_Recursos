package com.overtimeos.repository;

import com.overtimeos.entity.PasswordChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordChangeRequestRepository extends JpaRepository<PasswordChangeRequest, Long> {

    List<PasswordChangeRequest> findByStatusOrderByRequestedAtAsc(PasswordChangeRequest.Status status);

    boolean existsByDepartmentNameIgnoreCaseAndStatus(String departmentName, PasswordChangeRequest.Status status);

    Optional<PasswordChangeRequest> findFirstByDepartmentNameIgnoreCaseAndStatusOrderByRequestedAtDesc(
            String departmentName, PasswordChangeRequest.Status status);
}
