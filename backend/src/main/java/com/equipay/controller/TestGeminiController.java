package com.equipay.controller;

import com.equipay.dto.receipt.ParseReceiptResponse;
import com.equipay.service.gemini.GeminiClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping
public class TestGeminiController {

    private final GeminiClient geminiClient;

    public TestGeminiController(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    @PostMapping(
            value = "/test-gemini",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ParseReceiptResponse> testGemini(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        ParseReceiptResponse response =
                geminiClient.parseReceipt(file.getBytes());

        return ResponseEntity.ok(response);
    }
}