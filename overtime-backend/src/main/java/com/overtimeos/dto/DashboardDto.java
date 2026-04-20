package com.overtimeos.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class DashboardDto {
    private long total;
    private long confirmedCount;
    private long pendingCount;
    private long todayCount;
    private Map<String, Long> resourceCounts;
    private Map<String, Long> departmentCounts;
    private Map<String, Long> permanenciaCounts;
    private List<CollaboratorRankDto> topCollaborators;
    private List<DayTrendDto> weekTrend;

    @Getter
    @Builder
    public static class CollaboratorRankDto {
        private String name;
        private long count;
    }

    @Getter
    @Builder
    public static class DayTrendDto {
        private String date;
        private String label;
        private long count;
    }
}
