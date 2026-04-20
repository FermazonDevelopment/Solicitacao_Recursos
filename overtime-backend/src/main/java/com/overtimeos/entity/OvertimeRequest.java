package com.overtimeos.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
    name = "overtime_requests",
    uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "date"})
)
@Getter @Setter @NoArgsConstructor
public class OvertimeRequest {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "day_type", nullable = false, length = 20)
    private String dayType;

    @Column(nullable = false, length = 20)
    private String permanencia;

    @Column(name = "veiculo_proprio", nullable = false)
    private boolean veiculoProprio = false;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "registered_by", nullable = false, length = 50)
    private String registeredBy;

    @Column(name = "registered_at", nullable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(nullable = false, length = 20)
    private String status = "PENDENTE";

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "overtime_request_resources",
        joinColumns = @JoinColumn(name = "request_id")
    )
    @Column(name = "resource")
    private Set<String> resources = new HashSet<>();
}
