package com.equipay.service.gemini;

import com.equipay.exception.SchemaValidationException;
import com.equipay.dto.receipt.ParseReceiptResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClient {
    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);
    private final GeminiProperties properties;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiClient(GeminiProperties properties) {
        this.properties = properties;
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public ParseReceiptResponse parseReceipt(byte[] imageBytes) {
        if (properties.getEndpoint() == null) {
            throw new IllegalStateException("Gemini endpoint not configured (property gemini.endpoint)");
        }

        log.info("[GeminiClient] Request started");
        String prompt = buildPrompt();

        // Build payload preserving current structure
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        List<Object> parts = List.of(textPart);

        if (imageBytes != null && imageBytes.length > 0) {
            String mime = (imageBytes.length >= 2 && (imageBytes[0] & 0xFF) == 0xFF && (imageBytes[1] & 0xFF) == 0xD8)
                    ? "image/jpeg" : "application/octet-stream";
            Map<String, Object> inline = Map.of(
                    "mime_type", mime,
                    "data", Base64.getEncoder().encodeToString(imageBytes)
            );
            Map<String, Object> imagePart = Map.of("inline_data", inline);
            parts = List.of(textPart, imagePart);
        }

        content.put("parts", parts);
        requestBody.put("contents", List.of(content));

        String jsonPayload;
        try {
            jsonPayload = objectMapper.writeValueAsString(requestBody);
            log.debug("[GeminiClient] Payload: {}", jsonPayload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize Gemini request payload", e);
        }

        String responseBody;
        try {
            WebClient.RequestBodySpec req = webClient.post()
                    .uri(properties.getEndpoint())
                    .contentType(MediaType.APPLICATION_JSON);

            if (properties.getApiKey() != null && !properties.getApiKey().trim().isEmpty()) {
                req = req.header("x-goog-api-key", properties.getApiKey());
            }

            responseBody = req.bodyValue(jsonPayload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("[GeminiClient] Gemini response received");
        } catch (WebClientResponseException ex) {
            log.error("Gemini request failed: {}", ex.getMessage());
            throw new RuntimeException("Failed to call Gemini endpoint", ex);
        } catch (Exception ex) {
            log.error("Gemini request failed", ex);
            throw new RuntimeException("Failed to call Gemini endpoint", ex);
        }

        if (responseBody == null) throw new RuntimeException("Empty response from Gemini");

        JsonNode root;
        try {
            root = objectMapper.readTree(responseBody);
        } catch (Exception e) {
            log.error("[GeminiClient] Failed to parse Gemini wrapper response", e);
            throw new SchemaValidationException("Failed to parse Gemini wrapper response: " + e.getMessage(), e);
        }

        JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
        if (textNode.isMissingNode() || textNode.asText().trim().isEmpty()) {
            throw new SchemaValidationException("Gemini response does not contain textual JSON at candidates[0].content.parts[0].text");
        }

        String jsonText = textNode.asText().trim();
        ParseReceiptResponse parsed;
        try {
            parsed = objectMapper.readValue(jsonText, ParseReceiptResponse.class);
        } catch (Exception e) {
            log.error("[GeminiClient] Failed to parse JSON returned by Gemini", e);
            throw new SchemaValidationException("Gemini returned invalid JSON: " + e.getMessage(), e);
        }

        validate(parsed);
        log.info("[GeminiClient] Validation passed");
        return parsed;
    }

    private String buildPrompt() {
        return """
        Parse this receipt image.

        Return ONLY valid JSON.

        Do not return markdown.
        Do not return explanations.
        Do not wrap the response in code fences.

        Use this exact schema:

        {
          "merchant": {
            "name": "string"
          },
          "receiptDate": "YYYY-MM-DD",
          "currency": "INR",
          "items": [
            {
              "name": "string",
              "quantity": 1,
              "unitPrice": 0,
              "totalPrice": 0,
              "confidence": 0.0
            }
          ],
          "subtotal": 0,
          "tax": 0,
          "tip": 0,
          "total": 0,
          "overallConfidence": 0.0
        }

        Rules:
        - Use null when a value cannot be determined.
        - Currency must be ISO 4217.
        - Return exactly one JSON object.
        - No extra fields.
        """;
    }

    private void validate(ParseReceiptResponse r) {
        if (r == null) throw new RuntimeException("Gemini returned null");
        if (r.getItems() == null) throw new RuntimeException("Items missing");
        if (r.getCurrency() == null) throw new RuntimeException("Currency missing");
        if (r.getTotal() == null) throw new RuntimeException("Total missing");
    }
}
