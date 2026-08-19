package com.overtimeos.service;

import com.overtimeos.dto.CancelRequestDto;
import com.overtimeos.dto.OvertimeRequestCreateDto;
import com.overtimeos.dto.OvertimeRequestDto;
import com.overtimeos.dto.OvertimeRequestUpdateDto;
import com.overtimeos.entity.Employee;
import com.overtimeos.entity.OvertimeRequest;
import com.overtimeos.repository.EmployeeRepository;
import com.overtimeos.repository.OvertimeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OvertimeRequestService {

    private final OvertimeRequestRepository requestRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<OvertimeRequestDto> getRequests(String callerDept, boolean isAdmin,
                                                 String filterDept, LocalDate filterDate) {
        String dept = (filterDept != null && !filterDept.isBlank()) ? filterDept : null;
        List<OvertimeRequest> list;

        if (isAdmin) {
            list = filterDate != null
                ? requestRepository.findAllWithDeptAndDateFilter(dept, filterDate)
                : requestRepository.findAllWithDeptFilter(dept);
        } else {
            list = filterDate != null
                ? requestRepository.findByDepartmentAndDate(callerDept, filterDate)
                : requestRepository.findByDepartment(callerDept);
        }

        return list.stream().map(OvertimeRequestDto::new).toList();
    }

    @Transactional
    public List<OvertimeRequestDto> createRequests(OvertimeRequestCreateDto dto, String registeredBy) {
        LocalDate date    = dto.getDate();

        if (date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Não é permitido registrar solicitações para datas retroativas");
        }

        String dayType    = resolveDayType(date);
        long ts           = System.currentTimeMillis();

        return dto.getCollaborators().stream().map(entry -> {
            Employee employee = employeeRepository.findById(entry.getEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException(
                        "Colaborador ID " + entry.getEmployeeId() + " não encontrado"));

            if (!employee.isActive()) {
                throw new IllegalArgumentException(
                    employee.getName() + " está inativo e não pode ter solicitações registradas");
            }

            if (requestRepository.existsByEmployeeIdAndDate(entry.getEmployeeId(), date)) {
                throw new IllegalArgumentException(
                    employee.getName() + " já possui registro para " + date);
            }

            if (employee.isOutsourced()
                    && entry.getResources().stream().anyMatch(r -> r.equals("rota") || r.equals("uber"))) {
                throw new IllegalArgumentException(
                    employee.getName() + " é terceirizado e não pode solicitar Rota ou Uber");
            }

            OvertimeRequest req = new OvertimeRequest();
            req.setId("req-" + ts + "-" + entry.getEmployeeId());
            req.setEmployee(employee);
            req.setDate(date);
            req.setDayType(dayType);
            req.setPermanencia(dto.getPermanencia());
            req.setVeiculoProprio(entry.isVeiculoProprio());
            req.setMotivo(entry.getMotivo());
            req.setRegisteredBy(registeredBy);
            req.setResources(Set.copyOf(entry.getResources()));

            return new OvertimeRequestDto(requestRepository.save(req));
        }).toList();
    }

    @Transactional
    public OvertimeRequestDto confirmRequest(String id) {
        OvertimeRequest req = requestRepository.findByIdWithEmployee(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
        req.setStatus("CONFIRMADO");
        return new OvertimeRequestDto(requestRepository.save(req));
    }

    @Transactional
    public OvertimeRequestDto updateRequest(String id, OvertimeRequestUpdateDto dto,
                                             String callerDept, boolean isAdmin) {
        OvertimeRequest req = requestRepository.findByIdWithEmployee(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        if (!isAdmin && !req.getEmployee().getDepartment().getName().equals(callerDept)) {
            throw new IllegalArgumentException("Sem permissão para editar esta solicitação");
        }

        req.setPermanencia(dto.getPermanencia());
        req.setMotivo(dto.getMotivo());
        req.setVeiculoProprio(dto.isVeiculoProprio());
        req.getResources().clear();
        req.getResources().addAll(dto.getResources());

        return new OvertimeRequestDto(requestRepository.save(req));
    }

    @Transactional
    public OvertimeRequestDto cancelConfirmedRequest(String id, CancelRequestDto dto,
                                                      String callerDept, boolean isAdmin) {
        OvertimeRequest req = requestRepository.findByIdWithEmployee(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
        if (!"CONFIRMADO".equals(req.getStatus())) {
            throw new IllegalArgumentException("Somente solicitações confirmadas podem ser canceladas por este endpoint");
        }
        if (!isAdmin && !req.getEmployee().getDepartment().getName().equals(callerDept)) {
            throw new IllegalArgumentException("Sem permissão para cancelar esta solicitação");
        }
        req.setStatus("CANCELADO");
        req.setCancellationReason(dto.getReason().trim());
        req.setCancelledAt(LocalDateTime.now());
        return new OvertimeRequestDto(requestRepository.save(req));
    }

    @Transactional
    public void deleteRequest(String id, String callerDept, boolean isAdmin) {
        OvertimeRequest req = requestRepository.findByIdWithEmployee(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        if (!isAdmin && !req.getEmployee().getDepartment().getName().equals(callerDept)) {
            throw new IllegalArgumentException("Sem permissão para cancelar esta solicitação");
        }

        requestRepository.delete(req);
    }

    private String resolveDayType(LocalDate date) {
        int dow = date.getDayOfWeek().getValue(); // 6=SAT, 7=SUN
        if (dow == 6 || dow == 7) return "weekend";
        if (isBrazilianHoliday(date)) return "weekend";
        return "weekday";
    }

    private boolean isBrazilianHoliday(LocalDate date) {
        int m = date.getMonthValue();
        int d = date.getDayOfMonth();
        return (m == 1 && d == 1)
            || (m == 4 && d == 21)
            || (m == 5 && d == 1)
            || (m == 9 && d == 7)
            || (m == 10 && d == 12)
            || (m == 11 && d == 2)
            || (m == 11 && d == 15)
            || (m == 11 && d == 20)
            || (m == 12 && d == 25);
    }
}
