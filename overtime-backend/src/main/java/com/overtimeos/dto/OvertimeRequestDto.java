package com.overtimeos.dto;

import com.overtimeos.entity.OvertimeRequest;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
public class OvertimeRequestDto {
    private final String id;
    private final Integer employeeId;
    private final String name;
    private final String department;
    private final String registration;
    private final String address;
    private final boolean outsourced;
    private final String companyName;
    private final LocalDate date;
    private final String dayType;
    private final String permanencia;
    private final boolean veiculoProprio;
    private final String motivo;
    private final Set<String> resources;
    private final String registeredBy;
    private final LocalDateTime registeredAt;
    private final String status;
    private final String cancellationReason;
    private final LocalDateTime cancelledAt;

    public OvertimeRequestDto(OvertimeRequest r) {
        this.id                 = r.getId();
        this.employeeId         = r.getEmployee().getId();
        this.name               = r.getEmployee().getName();
        this.department         = r.getEmployee().getDepartment().getName();
        this.registration       = r.getEmployee().getRegistration();
        this.address            = r.getEmployee().getAddress();
        this.outsourced         = r.getEmployee().isOutsourced();
        this.companyName        = r.getEmployee().getCompanyName();
        this.date               = r.getDate();
        this.dayType            = r.getDayType();
        this.permanencia        = r.getPermanencia();
        this.veiculoProprio     = r.isVeiculoProprio();
        this.motivo             = r.getMotivo();
        this.resources          = r.getResources();
        this.registeredBy       = r.getRegisteredBy();
        this.registeredAt       = r.getRegisteredAt();
        this.status             = r.getStatus();
        this.cancellationReason = r.getCancellationReason();
        this.cancelledAt        = r.getCancelledAt();
    }
}
