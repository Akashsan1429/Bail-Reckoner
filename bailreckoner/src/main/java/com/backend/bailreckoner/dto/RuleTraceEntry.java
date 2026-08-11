package com.backend.bailreckoner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleTraceEntry {
    private String ruleId;
    private String checkName;
    private boolean passed;
    private String details;
}
