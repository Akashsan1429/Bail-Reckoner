package com.backend.bailreckoner.service;

import com.backend.bailreckoner.entity.AuditLog;
import com.backend.bailreckoner.enums.AuditAction;
import com.backend.bailreckoner.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(UUID userId, AuditAction action, String targetType, UUID targetId) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            // Audit logging should not crash business operations
        }
    }
}
