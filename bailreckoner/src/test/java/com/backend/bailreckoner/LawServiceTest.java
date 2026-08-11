package com.backend.bailreckoner;

import com.backend.bailreckoner.dto.LawSectionDto;
import com.backend.bailreckoner.entity.LawSection;
import com.backend.bailreckoner.repository.LawSectionRepository;
import com.backend.bailreckoner.service.LawService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LawServiceTest {

    @Mock
    private LawSectionRepository lawSectionRepository;

    @InjectMocks
    private LawService lawService;

    private LawSection sampleLaw;

    @BeforeEach
    void setUp() {
        sampleLaw = LawSection.builder()
                .id(UUID.randomUUID())
                .lawName("Indian Penal Code")
                .sectionNumber("420")
                .title("Cheating")
                .description("Cheating and dishonestly inducing delivery of property")
                .bailable(false)
                .maximumSentenceYears(7)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Get All Active Laws")
    void testGetAllLaws() {
        when(lawSectionRepository.findByActiveTrue()).thenReturn(List.of(sampleLaw));

        List<LawSectionDto> result = lawService.getAllLaws();

        assertEquals(1, result.size());
        assertEquals("420", result.get(0).getSectionNumber());
        assertFalse(result.get(0).getBailable());
    }

    @Test
    @DisplayName("Get Law By Id - Success")
    void testGetLawByIdSuccess() {
        when(lawSectionRepository.findById(sampleLaw.getId())).thenReturn(Optional.of(sampleLaw));

        LawSectionDto dto = lawService.getLawById(sampleLaw.getId());

        assertNotNull(dto);
        assertEquals("Cheating", dto.getTitle());
    }

    @Test
    @DisplayName("Search Laws - By Section Query")
    void testSearchLaws() {
        when(lawSectionRepository.searchLaws("420")).thenReturn(List.of(sampleLaw));

        List<LawSectionDto> result = lawService.searchLaws("420");

        assertFalse(result.isEmpty());
        assertEquals("420", result.get(0).getSectionNumber());
    }
}
