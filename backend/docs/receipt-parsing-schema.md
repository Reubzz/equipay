# Receipt Parsing Schema for EquiPay

## Purpose

This document defines the exact JSON structure that Gemini must return when parsing a receipt image.

This schema is the single source of truth for:

* Gemini prompt design
* Gemini response validation
* Backend DTOs
* Frontend import mapping

The parser should only return information that can be reasonably extracted from a receipt image.

The parser MUST NOT invent:

* participants
* split assignments
* payer information
* ownership of items

Those are user decisions made later in the EquiPay workflow.

---

# Required Response Structure

```json
{
  "merchant": {
    "name": "Bluebird Cafe"
  },

  "receiptDate": "2026-06-15",

  "currency": "INR",

  "items": [
    {
      "name": "Margherita Pizza",
      "quantity": 2,
      "unitPrice": 350.00,
      "totalPrice": 700.00,
      "confidence": 0.98
    },
    {
      "name": "Espresso",
      "quantity": 1,
      "unitPrice": 120.00,
      "totalPrice": 120.00,
      "confidence": 0.90
    }
  ],

  "subtotal": 820.00,
  "tax": 74.00,
  "tip": 0.00,
  "total": 894.00,

  "overallConfidence": 0.92
}
```

---

# Field Definitions

## merchant

Merchant information extracted from the receipt.

```json
{
  "name": "Bluebird Cafe"
}
```

Required:

* name

Optional future fields:

* address
* phone
* gstNumber

---

## receiptDate

Date printed on the receipt.

Format:

```text
YYYY-MM-DD
```

Examples:

```text
2026-06-15
2026-01-08
```

May be null if not found.

---

## currency

ISO 4217 currency code.

Examples:

```text
INR
USD
EUR
GBP
```

Required whenever monetary values exist.

---

## items

Array of parsed receipt line items.

Can be empty if no items are detected.

Each item:

```json
{
  "name": "Margherita Pizza",
  "quantity": 2,
  "unitPrice": 350.00,
  "totalPrice": 700.00,
  "confidence": 0.98
}
```

### name

Required.

Non-empty string.

### quantity

Required.

Default to:

```json
1
```

when quantity is not explicitly present.

Supports decimal quantities for grocery receipts.

Examples:

```json
1
2
0.75
1.25
```

### unitPrice

Optional.

Null if not available.

### totalPrice

Required.

Must be greater than or equal to zero.

### confidence

Optional.

Range:

```text
0.0 - 1.0
```

Represents model confidence for that line item.

---

## subtotal

Subtotal before tax and tip.

Required when available.

---

## tax

Tax amount.

Default:

```json
0
```

if absent.

---

## tip

Tip amount.

Default:

```json
0
```

if absent.

---

## total

Final payable amount.

Required.

---

## overallConfidence

Confidence score for the overall receipt extraction.

Range:

```text
0.0 - 1.0
```

---

# Validation Rules

## Root Object

Required fields:

```text
items
currency
total
```

---

## Item Rules

Required:

```text
name
quantity
totalPrice
```

Validation:

```text
name must not be blank
quantity > 0
totalPrice >= 0
confidence between 0 and 1
```

---

## Monetary Values

Validation:

```text
subtotal >= 0
tax >= 0
tip >= 0
total >= 0
```

---

## Currency

Must be a valid ISO 4217 code.

Examples:

```text
INR
USD
EUR
GBP
AED
```

---

# Mapping To Frontend

Backend Response:

```json
{
  "items": [...],
  "subtotal": 820,
  "tax": 74,
  "tip": 0,
  "total": 894
}
```

Frontend Mapping:

```javascript
formData.items
formData.subtotal
formData.tax
formData.tip
formData.totalAmount
```

Item Mapping:

```javascript
item.name
item.quantity
item.totalAmount = totalPrice
```

Assignments and participant ownership are handled entirely by the frontend after parsing.

---

# Gemini Prompt Requirements

Gemini must:

* Return ONLY valid JSON
* Return no markdown
* Return no explanations
* Return no code fences
* Return data matching this schema exactly
* Use null when a value cannot be determined
* Never invent participants or assignments

Example:

Valid:

```json
{
  "merchant": {
    "name": "Bluebird Cafe"
  },
  "currency": "INR",
  "items": []
}
```

Invalid:

```text
Here is the parsed receipt:
```

Invalid:

````markdown
```json
{
}
````

```

---

# Future Extensions

Possible future additions:

- merchant.address
- merchant.phone
- gstNumber
- receiptTime
- paymentMethod
- discounts
- serviceCharge
- imageQualityWarnings

These fields are intentionally excluded from the MVP.
```
