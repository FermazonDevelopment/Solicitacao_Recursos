package com.overtimeos.repository;

import com.overtimeos.entity.OvertimeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface OvertimeRequestRepository extends JpaRepository<OvertimeRequest, String> {

    boolean existsByEmployeeIdAndDate(Integer employeeId, LocalDate date);

    List<OvertimeRequest> findByEmployeeId(Integer employeeId);

    @Query("""
        SELECT r FROM OvertimeRequest r
        JOIN FETCH r.employee e
        JOIN FETCH e.department d
        WHERE r.id = :id
        """)
    java.util.Optional<OvertimeRequest> findByIdWithEmployee(@Param("id") String id);

    // ── Admin queries ──────────────────────────────────────────────────────────

    @Query("""
        SELECT r FROM OvertimeRequest r
        JOIN FETCH r.employee e
        JOIN FETCH e.department d
        WHERE (:dept IS NULL OR d.name = :dept)
        ORDER BY r.registeredAt DESC
        """)
    List<OvertimeRequest> findAllWithDeptFilter(@Param("dept") String dept);

    @Query("""
        SELECT r FROM OvertimeRequest r
        JOIN FETCH r.employee e
        JOIN FETCH e.department d
        WHERE (:dept IS NULL OR d.name = :dept)
          AND r.date = :date
        ORDER BY r.registeredAt DESC
        """)
    List<OvertimeRequest> findAllWithDeptAndDateFilter(
        @Param("dept") String dept,
        @Param("date") LocalDate date
    );

    // ── Department (non-admin) queries ─────────────────────────────────────────

    @Query("""
        SELECT r FROM OvertimeRequest r
        JOIN FETCH r.employee e
        JOIN FETCH e.department d
        WHERE d.name = :deptName
        ORDER BY r.registeredAt DESC
        """)
    List<OvertimeRequest> findByDepartment(@Param("deptName") String deptName);

    @Query("""
        SELECT r FROM OvertimeRequest r
        JOIN FETCH r.employee e
        JOIN FETCH e.department d
        WHERE d.name = :deptName
          AND r.date = :date
        ORDER BY r.registeredAt DESC
        """)
    List<OvertimeRequest> findByDepartmentAndDate(
        @Param("deptName") String deptName,
        @Param("date") LocalDate date
    );

    // ── Dashboard queries ──────────────────────────────────────────────────────

    @Query("SELECT COUNT(r) FROM OvertimeRequest r WHERE r.date = :date")
    long countByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(r) FROM OvertimeRequest r WHERE r.status = 'PENDENTE'")
    long countPending();

    @Query("""
        SELECT r FROM OvertimeRequest r
        JOIN FETCH r.employee e
        JOIN FETCH e.department d
        WHERE r.date >= :from AND r.date <= :to
        ORDER BY r.date
        """)
    List<OvertimeRequest> findBetweenDates(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
