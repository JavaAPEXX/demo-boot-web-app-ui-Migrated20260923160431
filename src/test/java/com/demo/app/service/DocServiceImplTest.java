```java
package com.demo.app.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;

import com.demo.app.model.Document;
import com.demo.app.repository.DocRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Unit tests for {@link DocServiceImpl}.
 */
@ExtendWith(MockitoExtension.class)
class DocServiceImplTest {

    @Mock
    private DocRepository docRepository;

    @InjectMocks
    private DocServiceImpl docService;

    @Test
    @DisplayName("Given a valid user id, when findAllDocs is invoked, then return the list of documents")
    void givenValidUserId_whenFindAllDocs_thenReturnDocumentList() {
        // Arrange
        Long userId = 42L;
        Document doc1 = new Document(); // assuming a no‑arg constructor exists
        Document doc2 = new Document();
        List<Document> expectedDocs = List.of(doc1, doc2);
        when(docRepository.findUserDocs(userId)).thenReturn(expectedDocs);

        // Act
        List<Document> actualDocs = docService.findAllDocs(userId);

        // Assert
        assertNotNull(actualDocs, "Returned list should not be null");
        assertEquals(expectedDocs.size(), actualDocs.size(), "Returned list size should match expected");
        assertEquals(expectedDocs, actualDocs, "Returned list should be exactly the repository result");
        verify(docRepository, times(1)).findUserDocs(userId);
    }

    @Test
    @DisplayName("Given a user id with no documents, when findAllDocs is invoked, then return an empty list")
    void givenUserIdWithNoDocs_whenFindAllDocs_thenReturnEmptyList() {
        // Arrange
        Long userId = 99L;
        when(docRepository.findUserDocs(userId)).thenReturn(Collections.emptyList());

        // Act
        List<Document> actualDocs =