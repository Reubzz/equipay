package com.equipay.controller;

import com.equipay.dto.receipt.ParseReceiptResponse;
import com.equipay.service.gemini.GeminiClient;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private static final Logger log = LoggerFactory.getLogger(ReceiptController.class);

    private final GeminiClient geminiClient;

    @PostMapping(value = "/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ParseReceiptResponse> parseReceipt(@RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {

            ParseReceiptResponse response = geminiClient.parseReceipt(file.getBytes());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Receipt parsing failed", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }
}
