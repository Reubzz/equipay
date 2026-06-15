package com.equipay.dto.receipt;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ParseReceiptResponse {

    private Merchant merchant;

    @JsonProperty("receiptDate")
    private String receiptDate;

    private String currency;

    private List<ReceiptItem> items;

    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal tip;
    private BigDecimal total;

    @JsonProperty("overallConfidence")
    private Double overallConfidence;
}
