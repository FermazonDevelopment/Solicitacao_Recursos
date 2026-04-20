package com.overtimeos.service;

import com.overtimeos.dto.DashboardDto;
import com.overtimeos.entity.OvertimeRequest;
import com.overtimeos.repository.OvertimeRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OvertimeRequestRepository requestRepository;

    @Transactional(readOnly = true)
    public DashboardDto getDashboard(LocalDate from, LocalDate to) {
        LocalDate today = LocalDate.now();
        LocalDate effectiveFrom = (from != null) ? from : LocalDate.of(2000, 1, 1);
        LocalDate effectiveTo   = (to   != null) ? to   : today;

        List<OvertimeRequest> all = requestRepository.findBetweenDates(effectiveFrom, effectiveTo);
        List<OvertimeRequest> confirmed = all.stream()
                .filter(r -> "CONFIRMADO".equals(r.getStatus())).toList();

        // Resource counts (apenas confirmados)
        List<String> resourceKeys = List.of("lanche", "janta", "rota", "uber", "cafe", "almoco");
        Map<String, Long> resourceCounts = new LinkedHashMap<>();
        for (String k : resourceKeys) {
            resourceCounts.put(k, confirmed.stream().filter(r -> r.getResources().contains(k)).count());
        }

        // Department counts (apenas confirmados)
        Map<String, Long> deptCounts = confirmed.stream()
                .collect(Collectors.groupingBy(
                    r -> r.getEmployee().getDepartment().getName(),
                    Collectors.counting()
                ));

        // Permanencia distribution (apenas confirmados)
        Map<String, Long> permCounts = confirmed.stream()
                .collect(Collectors.groupingBy(OvertimeRequest::getPermanencia, Collectors.counting()));

        // Top collaborators (apenas confirmados)
        Map<String, Long> collabCounts = confirmed.stream()
                .collect(Collectors.groupingBy(r -> r.getEmployee().getName(), Collectors.counting()));
        List<DashboardDto.CollaboratorRankDto> topCollabs = collabCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(6)
                .map(e -> DashboardDto.CollaboratorRankDto.builder()
                        .name(e.getKey()).count(e.getValue()).build())
                .toList();

        // Last 7 days trend (apenas confirmados)
        LocalDate trendFrom = today.minusDays(6);
        List<OvertimeRequest> weekReqs = requestRepository.findBetweenDates(trendFrom, today);
        List<DashboardDto.DayTrendDto> trend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            long count = weekReqs.stream()
                    .filter(r -> r.getDate().equals(day) && "CONFIRMADO".equals(r.getStatus())).count();
            String label = day.getDayOfWeek()
                    .getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"))
                    + " " + String.format("%02d", day.getDayOfMonth());
            trend.add(DashboardDto.DayTrendDto.builder()
                    .date(day.toString()).label(label).count(count).build());
        }

        return DashboardDto.builder()
                .total(all.size())
                .confirmedCount(all.stream().filter(r -> "CONFIRMADO".equals(r.getStatus())).count())
                .pendingCount(all.stream().filter(r -> "PENDENTE".equals(r.getStatus())).count())
                .todayCount(all.stream().filter(r -> r.getDate().equals(today)).count())
                .resourceCounts(resourceCounts)
                .departmentCounts(deptCounts)
                .permanenciaCounts(permCounts)
                .topCollaborators(topCollabs)
                .weekTrend(trend)
                .build();
    }
}
